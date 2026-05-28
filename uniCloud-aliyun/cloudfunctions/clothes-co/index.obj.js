const db = uniCloud.database();
const dbCmd = db.command;
const clothesTable = db.collection("clothes");
const closetsTable = db.collection("closets");

const PERSONAL_SCOPE = "personal";
const VALID_CATEGORY_CODES = ["top", "bottom", "outerwear", "shoes", "accessory"];
const VALID_SEASON_CODES = ["spring", "summer", "autumn", "winter"];

function getUniIdCommonModule() {
  try {
    return require("uni-id-common");
  } catch (error) {
    if (error?.code !== "MODULE_NOT_FOUND") {
      throw error;
    }

    return require("../../../uni_modules/uni-id-common/uniCloud/cloudfunctions/common/uni-id-common");
  }
}

function requireLogin(context) {
  const uid = context.authInfo?.uid;

  if (!uid) {
    const error = new Error("当前未登录");
    error.errCode = "CLOTHES_UNAUTHORIZED";
    throw error;
  }

  return uid;
}

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

async function assertPersonalClosetPermission(uid, closetId) {
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

  if (closet.scope_type !== PERSONAL_SCOPE || closet.scope_owner_user_id !== uid) {
    const error = new Error("只能绑定自己的个人衣橱");
    error.errCode = "CLOTHES_CLOSET_FORBIDDEN";
    throw error;
  }

  return normalizedClosetId;
}

async function getClothesById(clothesId) {
  const clothesRes = await clothesTable.doc(clothesId).get();
  return clothesRes.data[0] || null;
}

async function assertPersonalClothesPermission(uid, clothesId) {
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

  if (clothes.scope_type !== PERSONAL_SCOPE || clothes.scope_owner_user_id !== uid) {
    const error = new Error("你无权操作这条个人衣物");
    error.errCode = "CLOTHES_FORBIDDEN";
    throw error;
  }

  return clothes;
}

async function attachClosetNames(clothesList = []) {
  if (!clothesList.length) {
    return [];
  }

  const closetIds = Array.from(new Set(clothesList.map((item) => item.closet_id).filter(Boolean)));

  if (!closetIds.length) {
    return clothesList;
  }

  const closetsRes = await closetsTable
    .where({
      _id: dbCmd.in(closetIds),
    })
    .field("_id, name")
    .get();

  const closetMap = new Map((closetsRes.data || []).map((item) => [item._id, item.name]));

  return clothesList.map((item) => ({
    ...item,
    closet_name: closetMap.get(item.closet_id) || "",
  }));
}

module.exports = {
  async _before() {
    const token = this.getUniIdToken();

    if (!token) {
      this.authInfo = null;
      return;
    }

    const uniIdCommon = getUniIdCommonModule().createInstance({
      clientInfo: this.getClientInfo(),
    });
    const authResult = await uniIdCommon.checkToken(token);

    if (authResult.errCode) {
      throw authResult;
    }

    this.authInfo = authResult;
  },

  async createClothes(payload = {}) {
    const uid = requireLogin(this);
    const name = assertClothesName(payload.name);
    const category = assertOptionCode(payload.category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    const season = assertOptionCode(payload.season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    const color = normalizeOptionalText(payload.color, 20, "颜色");
    const remark = normalizeOptionalText(payload.remark, 500, "备注");
    const closetId = await assertPersonalClosetPermission(uid, payload.closetId);

    const createPayload = {
      scope_type: PERSONAL_SCOPE,
      scope_owner_user_id: uid,
      created_by: uid,
      name,
      category,
      season,
      color,
      remark,
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

    await assertPersonalClothesPermission(uid, clothesId);

    return {
      clothes: await getClothesById(clothesId),
    };
  },

  async updateClothes(payload = {}) {
    const uid = requireLogin(this);
    const clothesId = String(payload.clothesId || "").trim();

    await assertPersonalClothesPermission(uid, clothesId);

    const name = assertClothesName(payload.name);
    const category = assertOptionCode(payload.category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    const season = assertOptionCode(payload.season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    const color = normalizeOptionalText(payload.color, 20, "颜色");
    const remark = normalizeOptionalText(payload.remark, 500, "备注");
    const closetId = await assertPersonalClosetPermission(uid, payload.closetId);

    const updatePayload = {
      name,
      category,
      season,
      color,
      remark,
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

    await assertPersonalClothesPermission(uid, clothesId);

    await clothesTable.doc(clothesId).update({
      status: "disabled",
    });

    return {
      success: true,
    };
  },

  async getPersonalClothesList() {
    const uid = requireLogin(this);
    const payload = arguments[0] || {};
    const closetId = String(payload.closetId || "").trim();
    const category = String(payload.category || "").trim();
    const season = String(payload.season || "").trim();

    const where = {
      scope_type: PERSONAL_SCOPE,
      scope_owner_user_id: uid,
      status: "active",
    };

    if (closetId) {
      await assertPersonalClosetPermission(uid, closetId);
      where.closet_id = closetId;
    }

    if (category) {
      where.category = assertOptionCode(category, "衣物分类", "CLOTHES_CATEGORY_REQUIRED", VALID_CATEGORY_CODES);
    }

    if (season) {
      where.season = assertOptionCode(season, "适用季节", "CLOTHES_SEASON_REQUIRED", VALID_SEASON_CODES);
    }

    const res = await clothesTable
      .where(where)
      .orderBy("created_at", "desc")
      .get();

    return {
      list: await attachClosetNames(res.data || []),
    };
  },
};
