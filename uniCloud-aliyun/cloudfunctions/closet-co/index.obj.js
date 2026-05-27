const db = uniCloud.database();
const closetsTable = db.collection("closets");

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
    error.errCode = "CLOSET_UNAUTHORIZED";
    throw error;
  }

  return uid;
}

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

  async createCloset(payload = {}) {
    const uid = requireLogin(this);
    const name = assertClosetName(payload.name);
    const roomName = normalizeOptionalText(payload.roomName, 30);
    const styleCode = assertRequiredCode(payload.styleCode, "衣柜样式", "CLOSET_STYLE_REQUIRED");
    const colorCode = assertRequiredCode(payload.colorCode, "衣柜颜色", "CLOSET_COLOR_REQUIRED");
    const description = normalizeOptionalText(payload.description, 200);

    const createRes = await closetsTable.add({
      scope_type: "personal",
      scope_owner_user_id: uid,
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

  async getPersonalClosetList() {
    const uid = requireLogin(this);

    const res = await closetsTable
      .where({
        scope_type: "personal",
        scope_owner_user_id: uid,
        status: "active",
      })
      .orderBy("sort", "asc")
      .orderBy("created_at", "desc")
      .get();

    return {
      list: res.data || [],
    };
  },
};
