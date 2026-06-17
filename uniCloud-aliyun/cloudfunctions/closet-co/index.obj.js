const db = uniCloud.database();
const dbCmd = db.command;
const closetsTable = db.collection("closets");
const familyMembersTable = db.collection("family_members");
const clothesTable = db.collection("clothes");
const usersTable = db.collection("uni-id-users");
const { authBefore, requireLogin } = require("../common/app-common");

const PERSONAL_SCOPE = "personal";
const FAMILY_SCOPE = "family";
const VALID_STYLE_CODES = ["modern-flat", "arched-vintage", "open-rack", "drawer-mix"];
const VALID_COLOR_CODES = ["oak-beige", "walnut-brown", "mist-white", "sage-green"];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function assertClosetName(name) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    const error = new Error("请输入衣橱名称");
    error.errCode = "CLOSET_NAME_REQUIRED";
    throw error;
  }

  if (normalizedName.length > 30) {
    const error = new Error("衣橱名称不能超过 30 个字符");
    error.errCode = "CLOSET_NAME_TOO_LONG";
    throw error;
  }

  return normalizedName;
}

function normalizeOptionalText(value, maxLength) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (normalizedValue.length > maxLength) {
    const error = new Error(`字段内容不能超过 ${maxLength} 个字符`);
    error.errCode = "CLOSET_FIELD_TOO_LONG";
    throw error;
  }

  return normalizedValue;
}

function assertRequiredCode(value, fieldName, errCode) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    const error = new Error(`请选择${fieldName}`);
    error.errCode = errCode;
    throw error;
  }

  return normalizedValue;
}

function assertOptionCode(value, fieldName, errCode, validCodes) {
  const normalizedValue = assertRequiredCode(value, fieldName, errCode);

  if (!validCodes.includes(normalizedValue)) {
    const error = new Error(`${fieldName}不在支持范围内`);
    error.errCode = `${errCode}_INVALID`;
    throw error;
  }

  return normalizedValue;
}

async function getActiveFamilyMembership(uid) {
  const res = await familyMembersTable
    .where({
      user_id: uid,
      status: "active",
    })
    .limit(1)
    .get();

  return res.data[0] || null;
}

async function resolveCreateScope(uid, scopeType) {
  const normalizedScopeType = String(scopeType || PERSONAL_SCOPE).trim();

  if (normalizedScopeType === PERSONAL_SCOPE) {
    return {
      scopeType: PERSONAL_SCOPE,
      scopeOwnerUserId: uid,
      familyId: "",
    };
  }

  if (normalizedScopeType !== FAMILY_SCOPE) {
    const error = new Error("衣橱作用域不合法");
    error.errCode = "CLOSET_SCOPE_INVALID";
    throw error;
  }

  const membership = await getActiveFamilyMembership(uid);

  if (!membership?.family_id) {
    const error = new Error("你当前还没有加入家庭");
    error.errCode = "CLOSET_FAMILY_REQUIRED";
    throw error;
  }

  return {
    scopeType: FAMILY_SCOPE,
    scopeOwnerUserId: "",
    familyId: membership.family_id,
  };
}

async function getClosetById(closetId) {
  const res = await closetsTable.doc(closetId).get();
  return res.data[0] || null;
}

async function assertClosetManagePermission(uid, closetId) {
  const closet = await getClosetById(closetId);

  if (!closet || closet.status !== "active") {
    const error = new Error("衣橱不存在或已不可用");
    error.errCode = "CLOSET_NOT_FOUND";
    throw error;
  }

  if (closet.scope_type === PERSONAL_SCOPE) {
    if (closet.scope_owner_user_id !== uid) {
      const error = new Error("你无权操作该个人衣橱");
      error.errCode = "CLOSET_FORBIDDEN";
      throw error;
    }

    return closet;
  }

  if (closet.scope_type === FAMILY_SCOPE) {
    const membership = await getActiveFamilyMembership(uid);

    if (!membership?.family_id || membership.family_id !== closet.family_id) {
      const error = new Error("你无权操作该家庭衣橱");
      error.errCode = "CLOSET_FORBIDDEN";
      throw error;
    }

    return closet;
  }

  const error = new Error("衣橱作用域不合法");
  error.errCode = "CLOSET_SCOPE_INVALID";
  throw error;
}

function buildCreatorName(userRecord = {}) {
  const nickname = String(userRecord.nickname || "").trim();
  const username = String(userRecord.username || "").trim();
  const mobile = String(userRecord.mobile || "").trim();

  return nickname || username || mobile || "未知成员";
}

async function attachClosetCreatorNames(closets = []) {
  if (!closets.length) {
    return [];
  }

  const creatorIds = Array.from(new Set(closets.map((item) => item.created_by).filter(Boolean)));

  if (!creatorIds.length) {
    return closets;
  }

  const usersRes = await usersTable
    .where({
      _id: dbCmd.in(creatorIds),
    })
    .field("_id, nickname, username, mobile")
    .get();

  const userMap = new Map(
    (usersRes.data || []).map((item) => [
      item._id,
      {
        creator_name: buildCreatorName(item),
        creator_nickname: String(item.nickname || "").trim(),
        creator_username: String(item.username || "").trim(),
      },
    ])
  );

  return closets.map((item) => {
    const creator = userMap.get(item.created_by) || {};

    return {
      ...item,
      ...creator,
    };
  });
}

async function getPersonalSummary(uid) {
  const [closetRes, clothesRes, unassignedRes] = await Promise.all([
    closetsTable
      .where({
        scope_type: PERSONAL_SCOPE,
        scope_owner_user_id: uid,
        status: "active",
      })
      .count(),
    clothesTable
      .where({
        scope_type: PERSONAL_SCOPE,
        scope_owner_user_id: uid,
        status: "active",
      })
      .count(),
    clothesTable
      .where({
        scope_type: PERSONAL_SCOPE,
        scope_owner_user_id: uid,
        status: "active",
        closet_id: dbCmd.exists(false),
      })
      .count(),
  ]);

  return {
    closetCount: closetRes.total || 0,
    clothesCount: clothesRes.total || 0,
    unassignedClothesCount: unassignedRes.total || 0,
  };
}

async function getFamilySummary(uid) {
  const membership = await getActiveFamilyMembership(uid);

  if (!membership?.family_id) {
    const error = new Error("你当前还没有加入家庭");
    error.errCode = "CLOSET_FAMILY_REQUIRED";
    throw error;
  }

  const [closetRes, clothesRes, unassignedRes] = await Promise.all([
    closetsTable
      .where({
        scope_type: FAMILY_SCOPE,
        family_id: membership.family_id,
        status: "active",
      })
      .count(),
    clothesTable
      .where({
        scope_type: FAMILY_SCOPE,
        family_id: membership.family_id,
        status: "active",
      })
      .count(),
    clothesTable
      .where({
        scope_type: FAMILY_SCOPE,
        family_id: membership.family_id,
        status: "active",
        closet_id: dbCmd.exists(false),
      })
      .count(),
  ]);

  return {
    closetCount: closetRes.total || 0,
    clothesCount: clothesRes.total || 0,
    unassignedClothesCount: unassignedRes.total || 0,
    familyId: membership.family_id,
  };
}

module.exports = {
  _before: authBefore,

  async createCloset(payload = {}) {
    const uid = requireLogin(this);
    const name = assertClosetName(payload.name);
    const roomName = normalizeOptionalText(payload.roomName, 30);
    const styleCode = assertOptionCode(payload.styleCode, "衣柜样式", "CLOSET_STYLE_REQUIRED", VALID_STYLE_CODES);
    const colorCode = assertOptionCode(payload.colorCode, "衣柜颜色", "CLOSET_COLOR_REQUIRED", VALID_COLOR_CODES);
    const description = normalizeOptionalText(payload.description, 200);
    const scope = await resolveCreateScope(uid, payload.scopeType);

    const createRes = await closetsTable.add({
      scope_type: scope.scopeType,
      scope_owner_user_id: scope.scopeOwnerUserId,
      family_id: scope.familyId,
      name,
      room_name: roomName,
      style_code: styleCode,
      color_code: colorCode,
      description,
      created_by: uid,
      status: "active",
      sort: 0,
    });

    const closetRes = await closetsTable.doc(createRes.id).get();

    return {
      closet: closetRes.data[0] || null,
    };
  },

  async updateCloset(payload = {}) {
    const uid = requireLogin(this);
    const closetId = String(payload.closetId || "").trim();

    if (!closetId) {
      const error = new Error("缺少衣橱ID");
      error.errCode = "CLOSET_ID_REQUIRED";
      throw error;
    }

    await assertClosetManagePermission(uid, closetId);

    const name = assertClosetName(payload.name);
    const roomName = normalizeOptionalText(payload.roomName, 30);
    const styleCode = assertOptionCode(payload.styleCode, "衣柜样式", "CLOSET_STYLE_REQUIRED", VALID_STYLE_CODES);
    const colorCode = assertOptionCode(payload.colorCode, "衣柜颜色", "CLOSET_COLOR_REQUIRED", VALID_COLOR_CODES);
    const description = normalizeOptionalText(payload.description, 200);

    await closetsTable.doc(closetId).update({
      name,
      room_name: roomName,
      style_code: styleCode,
      color_code: colorCode,
      description,
      updated_at: new Date(),
    });

    return {
      closet: await getClosetById(closetId),
    };
  },

  async getClosetDetail(payload = {}) {
    const uid = requireLogin(this);
    const closetId = String(payload.closetId || "").trim();

    if (!closetId) {
      const error = new Error("缺少衣橱ID");
      error.errCode = "CLOSET_ID_REQUIRED";
      throw error;
    }

    return {
      closet: await assertClosetManagePermission(uid, closetId),
    };
  },

  async deleteCloset(payload = {}) {
    const uid = requireLogin(this);
    const closetId = String(payload.closetId || "").trim();

    if (!closetId) {
      const error = new Error("缺少衣橱ID");
      error.errCode = "CLOSET_ID_REQUIRED";
      throw error;
    }

    await assertClosetManagePermission(uid, closetId);

    await clothesTable.where({ closet_id: closetId }).update({
      closet_id: dbCmd.remove(),
      updated_at: new Date(),
    });

    await closetsTable.doc(closetId).update({
      status: "disabled",
      updated_at: new Date(),
    });

    return {
      success: true,
    };
  },

  async getPersonalClosetList(payload = {}) {
    const uid = requireLogin(this);
    const page = Math.max(1, Number(payload.page) || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(payload.pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;

    const [listRes, countRes] = await Promise.all([
      closetsTable
        .where({
          scope_type: PERSONAL_SCOPE,
          scope_owner_user_id: uid,
          status: "active",
        })
        .orderBy("sort", "asc")
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(pageSize)
        .get(),
      closetsTable
        .where({
          scope_type: PERSONAL_SCOPE,
          scope_owner_user_id: uid,
          status: "active",
        })
        .count(),
    ]);

    return {
      list: listRes.data || [],
      total: countRes.total || 0,
      page,
      pageSize,
    };
  },

  async getFamilyClosetList(payload = {}) {
    const uid = requireLogin(this);
    const membership = await getActiveFamilyMembership(uid);

    if (!membership?.family_id) {
      const error = new Error("你当前还没有加入家庭");
      error.errCode = "CLOSET_FAMILY_REQUIRED";
      throw error;
    }

    const page = Math.max(1, Number(payload.page) || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(payload.pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;

    const where = {
      scope_type: FAMILY_SCOPE,
      family_id: membership.family_id,
      status: "active",
    };

    const [listRes, countRes] = await Promise.all([
      closetsTable
        .where(where)
        .orderBy("sort", "asc")
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(pageSize)
        .get(),
      closetsTable
        .where(where)
        .count(),
    ]);

    return {
      list: await attachClosetCreatorNames(listRes.data || []),
      total: countRes.total || 0,
      page,
      pageSize,
      familyId: membership.family_id,
    };
  },

  async getHomeSummary(payload = {}) {
    const uid = requireLogin(this);
    const scopeType = String(payload.scopeType || PERSONAL_SCOPE).trim();

    if (scopeType === FAMILY_SCOPE) {
      return getFamilySummary(uid);
    }

    if (scopeType === PERSONAL_SCOPE) {
      return getPersonalSummary(uid);
    }

    const error = new Error("首页摘要作用域不合法");
    error.errCode = "CLOSET_SCOPE_INVALID";
    throw error;
  },
};
