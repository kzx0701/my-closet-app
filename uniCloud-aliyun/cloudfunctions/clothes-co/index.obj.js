const db = uniCloud.database();
const dbCmd = db.command;
const clothesTable = db.collection("clothes");
const closetsTable = db.collection("closets");
const familyMembersTable = db.collection("family_members");
const usersTable = db.collection("uni-id-users");
const { authBefore, requireLogin } = require("../common/app-common");

const PERSONAL_SCOPE = "personal";
const FAMILY_SCOPE = "family";
const VALID_CATEGORY_CODES = ["top", "bottom", "outerwear", "shoes", "accessory"];
const VALID_SEASON_CODES = ["spring", "summer", "autumn", "winter"];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function assertClothesName(name) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    const error = new Error("请输入衣物名称");
    error.errCode = "CLOTHES_NAME_REQUIRED";
    throw error;
  }

  if (normalizedName.length > 50) {
    const error = new Error("衣物名称不能超过 50 个字符");
    error.errCode = "CLOTHES_NAME_TOO_LONG";
    throw error;
  }

  return normalizedName;
}

function normalizeOptionalText(value, maxLength, fieldLabel) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (normalizedValue.length > maxLength) {
    const error = new Error(`${fieldLabel}不能超过 ${maxLength} 个字符`);
    error.errCode = "CLOTHES_FIELD_TOO_LONG";
    throw error;
  }

  return normalizedValue;
}

function assertOptionCode(value, fieldLabel, errCode, validCodes) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    const error = new Error(`请选择${fieldLabel}`);
    error.errCode = errCode;
    throw error;
  }

  if (!validCodes.includes(normalizedValue)) {
    const error = new Error(`${fieldLabel}不在支持范围内`);
    error.errCode = `${errCode}_INVALID`;
    throw error;
  }

  return normalizedValue;
}

async function getActiveFamilyMembership(uid) {
  const res = await familyMembersTable
    .where({ user_id: uid, status: "active" })
    .limit(1)
    .get();
  return res.data[0] || null;
}

async function resolveCreateScope(uid, scopeType) {
  const normalizedScopeType = String(scopeType || PERSONAL_SCOPE).trim();

  if (normalizedScopeType === PERSONAL_SCOPE) {
    return { scopeType: PERSONAL_SCOPE, scopeOwnerUserId: uid, familyId: "" };
  }

  if (normalizedScopeType !== FAMILY_SCOPE) {
    const error = new Error("衣物作用域不合法");
    error.errCode = "CLOTHES_SCOPE_INVALID";
    throw error;
  }

  const membership = await getActiveFamilyMembership(uid);

  if (!membership?.family_id) {
    const error = new Error("你当前还没有加入家庭");
    error.errCode = "CLOTHES_FAMILY_REQUIRED";
    throw error;
  }

  return { scopeType: FAMILY_SCOPE, scopeOwnerUserId: "", familyId: membership.family_id };
}

async function assertClosetPermission(uid, scopeType, familyId, closetId) {
  const normalizedClosetId = String(closetId || "").trim();

  if (!normalizedClosetId) {
    return "";
  }

  const closetRes = await closetsTable.doc(normalizedClosetId).get();
  const closet = closetRes.data[0] || null;

  if (!closet || closet.status !== "active") {
    const error = new Error("所选衣橱不存在或已不可用");
    error.errCode = "CLOTHES_CLOSET_NOT_FOUND";
    throw error;
  }

  if (scopeType === PERSONAL_SCOPE) {
    if (closet.scope_type !== PERSONAL_SCOPE || closet.scope_owner_user_id !== uid) {
      const error = new Error("只能绑定自己的个人衣橱");
      error.errCode = "CLOTHES_CLOSET_FORBIDDEN";
      throw error;
    }
  } else if (scopeType === FAMILY_SCOPE) {
    if (closet.scope_type !== FAMILY_SCOPE || closet.family_id !== familyId) {
      const error = new Error("只能绑定当前家庭的衣橱");
      error.errCode = "CLOTHES_CLOSET_FORBIDDEN";
      throw error;
    }
  }

  return normalizedClosetId;
}

async function assertClothesManagePermission(uid, clothesId) {
  const normalizedClothesId = String(clothesId || "").trim();

  if (!normalizedClothesId) {
    const error = new Error("缺少衣物ID");
    error.errCode = "CLOTHES_ID_REQUIRED";
    throw error;
  }

  const clothes = await getClothesById(normalizedClothesId);

  if (!clothes || clothes.status !== "active") {
    const error = new Error("衣物不存在或已不可用");
    error.errCode = "CLOTHES_NOT_FOUND";
    throw error;
  }

  if (clothes.scope_type === PERSONAL_SCOPE) {
    if (clothes.scope_owner_user_id !== uid) {
      const error = new Error("你无权操作这条个人衣物");
      error.errCode = "CLOTHES_FORBIDDEN";
      throw error;
    }
  } else if (clothes.scope_type === FAMILY_SCOPE) {
    const membership = await getActiveFamilyMembership(uid);

    if (!membership?.family_id || membership.family_id !== clothes.family_id) {
      const error = new Error("你无权操作这条家庭衣物");
      error.errCode = "CLOTHES_FORBIDDEN";
      throw error;
    }

    const isCreator = clothes.created_by === uid;
    const isAdmin = membership.role === "admin";

    if (!isCreator && !isAdmin) {
      const error = new Error("普通成员只能管理自己创建的衣物");
      error.errCode = "CLOTHES_FORBIDDEN";
      throw error;
    }
  }

  return clothes;
}

async function getClothesById(clothesId) {
  const clothesRes = await clothesTable.doc(clothesId).get();
  return clothesRes.data[0] || null;
}

async function attachClosetNames(clothesList = []) {
  if (!clothesList.length) return [];

  const closetIds = Array.from(new Set(clothesList.map((item) => item.closet_id).filter(Boolean)));

  if (!closetIds.length) return clothesList;

  const closetsRes = await closetsTable
    .where({ _id: dbCmd.in(closetIds) })
    .field("_id, name")
    .get();

  const closetMap = new Map((closetsRes.data || []).map((item) => [item._id, item.name]));

  return clothesList.map((item) => ({
    ...item,
    closet_name: closetMap.get(item.closet_id) || "",
  }));
}

function buildCreatorName(userRecord = {}) {
  const nickname = String(userRecord.nickname || "").trim();
  const username = String(userRecord.username || "").trim();
  return nickname || username || "未知成员";
}

async function attachCreatorNames(clothesList = []) {
  if (!clothesList.length) return [];

  const creatorIds = Array.from(new Set(clothesList.map((item) => item.created_by).filter(Boolean)));

  if (!creatorIds.length) return clothesList;

  const usersRes = await usersTable
    .where({ _id: dbCmd.in(creatorIds) })
    .field("_id, nickname, username")
    .get();

  const userMap = new Map(
    (usersRes.data || []).map((item) => [
      item._id,
      { creator_name: buildCreatorName(item) },
    ])
  );

  return clothesList.map((item) => ({
    ...item,
    ...(userMap.get(item.created_by) || {}),
  }));
}

module.exports = {
  _before: authBefore,

  async createClothes(payload = {}) {
    const uid = requireLogin(this);
    const scope = await resolveCreateScope(uid, payload.scopeType);
    const name = assertClothesName(payload.name);
    const category = assertOptionCode(payload.category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    const season = assertOptionCode(payload.season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    const color = normalizeOptionalText(payload.color, 20, "颜色");
    const remark = normalizeOptionalText(payload.remark, 500, "备注");
    const imageUrl = normalizeOptionalText(payload.imageUrl, 500, "图片地址");
    const closetId = await assertClosetPermission(uid, scope.scopeType, scope.familyId, payload.closetId);

    const createPayload = {
      scope_type: scope.scopeType,
      scope_owner_user_id: scope.scopeOwnerUserId,
      family_id: scope.familyId,
      created_by: uid,
      name,
      category,
      season,
      color,
      remark,
      image_url: imageUrl,
      status: "active",
    };

    if (closetId) {
      createPayload.closet_id = closetId;
    }

    const createRes = await clothesTable.add(createPayload);
    const clothesRes = await clothesTable.doc(createRes.id).get();

    return {
      clothes: clothesRes.data[0] || null,
    };
  },

  async getClothesDetail(payload = {}) {
    const uid = requireLogin(this);
    const clothesId = String(payload.clothesId || "").trim();
    await assertClothesManagePermission(uid, clothesId);

    return {
      clothes: await getClothesById(clothesId),
    };
  },

  async updateClothes(payload = {}) {
    const uid = requireLogin(this);
    const clothesId = String(payload.clothesId || "").trim();
    const clothes = await assertClothesManagePermission(uid, clothesId);

    const name = assertClothesName(payload.name);
    const category = assertOptionCode(payload.category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    const season = assertOptionCode(payload.season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    const color = normalizeOptionalText(payload.color, 20, "颜色");
    const remark = normalizeOptionalText(payload.remark, 500, "备注");
    const imageUrl = normalizeOptionalText(payload.imageUrl, 500, "图片地址");
    const closetId = await assertClosetPermission(uid, clothes.scope_type, clothes.family_id, payload.closetId);

    const updatePayload = {
      name,
      category,
      season,
      color,
      remark,
      image_url: imageUrl,
      updated_at: new Date(),
    };

    if (closetId) {
      updatePayload.closet_id = closetId;
    } else {
      updatePayload.closet_id = dbCmd.remove();
    }

    await clothesTable.doc(clothesId).update(updatePayload);

    return {
      clothes: await getClothesById(clothesId),
    };
  },

  async deleteClothes(payload = {}) {
    const uid = requireLogin(this);
    const clothesId = String(payload.clothesId || "").trim();
    await assertClothesManagePermission(uid, clothesId);

    await clothesTable.doc(clothesId).update({
      status: "disabled",
      updated_at: new Date(),
    });

    return { success: true };
  },

  async getPersonalClothesList(payload = {}) {
    const uid = requireLogin(this);
    const closetId = String(payload.closetId || "").trim();
    const category = String(payload.category || "").trim();
    const season = String(payload.season || "").trim();
    const page = Math.max(1, Number(payload.page) || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(payload.pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;

    const where = {
      scope_type: PERSONAL_SCOPE,
      scope_owner_user_id: uid,
      status: "active",
    };

    if (closetId) {
      await assertClosetPermission(uid, PERSONAL_SCOPE, "", closetId);
      where.closet_id = closetId;
    }

    if (category) {
      where.category = assertOptionCode(category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    }

    if (season) {
      where.season = assertOptionCode(season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    }

    const [listRes, countRes] = await Promise.all([
      clothesTable
        .where(where)
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(pageSize)
        .get(),
      clothesTable.where(where).count(),
    ]);

    return {
      list: await attachClosetNames(listRes.data || []),
      total: countRes.total || 0,
      page,
      pageSize,
    };
  },

  async getFamilyClothesList(payload = {}) {
    const uid = requireLogin(this);
    const membership = await getActiveFamilyMembership(uid);

    if (!membership?.family_id) {
      const error = new Error("你当前还没有加入家庭");
      error.errCode = "CLOTHES_FAMILY_REQUIRED";
      throw error;
    }

    const closetId = String(payload.closetId || "").trim();
    const category = String(payload.category || "").trim();
    const season = String(payload.season || "").trim();
    const page = Math.max(1, Number(payload.page) || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(payload.pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;

    const where = {
      scope_type: FAMILY_SCOPE,
      family_id: membership.family_id,
      status: "active",
    };

    if (closetId) {
      await assertClosetPermission(uid, FAMILY_SCOPE, membership.family_id, closetId);
      where.closet_id = closetId;
    }

    if (category) {
      where.category = assertOptionCode(category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    }

    if (season) {
      where.season = assertOptionCode(season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    }

    const [listRes, countRes] = await Promise.all([
      clothesTable
        .where(where)
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(pageSize)
        .get(),
      clothesTable.where(where).count(),
    ]);

    const listWithClosetNames = await attachClosetNames(listRes.data || []);
    const listWithCreators = await attachCreatorNames(listWithClosetNames);

    return {
      list: listWithCreators,
      total: countRes.total || 0,
      page,
      pageSize,
      familyId: membership.family_id,
    };
  },
};
