const db = uniCloud.database();
const dbCmd = db.command;
const familiesTable = db.collection("families");
const familyMembersTable = db.collection("family_members");

/**
 * 获取 uni-id-common 模块。
 * 正式云环境优先使用标准 common 模块；本地调试缺少依赖时，回退到项目内 uni_modules 中的实现。
 *
 * @returns {object} uni-id-common module
 */
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

/**
 * 确保当前请求已经登录，并返回当前用户 uid。
 *
 * @param {object} context 云对象上下文
 * @returns {string} 当前登录用户 uid
 */
function requireLogin(context) {
  const uid = context.authInfo?.uid;

  if (!uid) {
    const error = new Error("当前未登录");
    error.errCode = "FAMILY_UNAUTHORIZED";
    throw error;
  }

  return uid;
}

/**
 * 校验家庭名称是否合法。
 *
 * @param {string} name 家庭名称
 * @returns {string} 去空格后的合法家庭名称
 */
function assertFamilyName(name) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    const error = new Error("请输入家庭名称");
    error.errCode = "FAMILY_NAME_REQUIRED";
    throw error;
  }

  if (normalizedName.length > 30) {
    const error = new Error("家庭名称不能超过 30 个字符");
    error.errCode = "FAMILY_NAME_TOO_LONG";
    throw error;
  }

  return normalizedName;
}

/**
 * 校验家庭邀请码是否合法。
 *
 * @param {string} inviteCode 家庭邀请码
 * @returns {string} 标准化后的邀请码
 */
function assertInviteCode(inviteCode) {
  const normalizedInviteCode = String(inviteCode || "")
    .trim()
    .toUpperCase();

  if (!normalizedInviteCode) {
    const error = new Error("请输入邀请码");
    error.errCode = "FAMILY_INVITE_CODE_REQUIRED";
    throw error;
  }

  return normalizedInviteCode;
}

/**
 * 查询指定用户当前是否有激活状态的家庭成员关系。
 *
 * @param {string} uid 用户 ID
 * @returns {Promise<object | null>} 当前成员关系记录
 */
async function getMembershipByUserId(uid) {
  const res = await familyMembersTable
    .where({
      user_id: uid,
      status: "active",
    })
    .limit(1)
    .get();

  return res.data[0] || null;
}

/**
 * 生成一个尽量唯一的家庭邀请码。
 * 先尝试随机码，若多次冲突则使用基于时间戳的兜底方案。
 *
 * @returns {Promise<string>} 家庭邀请码
 */
async function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  for (let i = 0; i < 8; i += 1) {
    let inviteCode = "";

    for (let j = 0; j < 6; j += 1) {
      inviteCode += chars[Math.floor(Math.random() * chars.length)];
    }

    const existsRes = await familiesTable
      .where({
        invite_code: inviteCode,
      })
      .limit(1)
      .get();

    if (!existsRes.data.length) {
      return inviteCode;
    }
  }

  const fallbackCode = `F${Date.now().toString(36).slice(-7).toUpperCase()}`;
  return fallbackCode.slice(0, 8);
}

/**
 * 按家庭 ID 查询家庭主记录。
 *
 * @param {string} familyId 家庭 ID
 * @returns {Promise<object | null>} 家庭记录
 */
async function getFamilyById(familyId) {
  const res = await familiesTable.doc(familyId).get();
  return res.data[0] || null;
}

/**
 * 按邀请码查询处于激活状态的家庭。
 *
 * @param {string} inviteCode 家庭邀请码
 * @returns {Promise<object | null>} 家庭记录
 */
async function getFamilyByInviteCode(inviteCode) {
  const res = await familiesTable
    .where({
      invite_code: inviteCode,
      status: "active",
    })
    .limit(1)
    .get();

  return res.data[0] || null;
}

module.exports = {
  /**
   * 云对象前置钩子。
   * 这里统一完成 token 校验，并把鉴权结果挂到 this.authInfo，供后续接口复用。
   */
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

  /**
   * 创建家庭。
   * 会先校验登录态、家庭名和用户当前成员状态，再写入 families 主表与 family_members 成员表。
   * 创建成功后，当前用户会自动成为该家庭的管理员。
   *
   * @param {{name: string}} payload 创建家庭参数
   * @returns {Promise<{family: object, membership: object}>}
   */
  async createFamily({ name } = {}) {
    const uid = requireLogin(this);
    const normalizedName = assertFamilyName(name);
    const existedMembership = await getMembershipByUserId(uid);

    if (existedMembership) {
      const error = new Error("你已加入家庭，暂不支持重复创建");
      error.errCode = "FAMILY_ALREADY_JOINED";
      throw error;
    }

    const inviteCode = await generateInviteCode();
    const familyCreateRes = await familiesTable.add({
      name: normalizedName,
      invite_code: inviteCode,
      owner_user_id: uid,
      status: "active",
      member_count: 1,
    });

    const familyId = familyCreateRes.id;

    try {
      await familyMembersTable.add({
        family_id: familyId,
        user_id: uid,
        role: "admin",
        status: "active",
      });
    } catch (error) {
      await familiesTable.doc(familyId).remove();
      throw error;
    }

    return {
      family: await getFamilyById(familyId),
      membership: {
        family_id: familyId,
        user_id: uid,
        role: "admin",
        status: "active",
      },
    };
  },

  /**
   * 通过邀请码加入家庭。
   * 会校验登录态、邀请码有效性，以及当前用户是否已加入其他家庭。
   * 加入成功后新增成员关系，并同步更新家庭人数。
   *
   * @param {{inviteCode: string}} payload 加入家庭参数
   * @returns {Promise<{family: object, membership: object}>}
   */
  async joinFamilyByInviteCode({ inviteCode } = {}) {
    const uid = requireLogin(this);
    const normalizedInviteCode = assertInviteCode(inviteCode);
    const existedMembership = await getMembershipByUserId(uid);

    if (existedMembership) {
      const error = new Error("你已加入家庭，暂不支持重复加入");
      error.errCode = "FAMILY_ALREADY_JOINED";
      throw error;
    }

    const family = await getFamilyByInviteCode(normalizedInviteCode);

    if (!family) {
      const error = new Error("邀请码无效或家庭不可用");
      error.errCode = "FAMILY_INVITE_CODE_INVALID";
      throw error;
    }

    await familyMembersTable.add({
      family_id: family._id,
      user_id: uid,
      role: "member",
      status: "active",
    });

    await familiesTable.doc(family._id).update({
      member_count: dbCmd.inc(1),
    });

    return {
      family: await getFamilyById(family._id),
      membership: {
        family_id: family._id,
        user_id: uid,
        role: "member",
        status: "active",
      },
    };
  },

  /**
   * 查询当前登录用户的家庭归属状态。
   * 若用户尚未加入家庭，则返回 hasFamily=false；若已加入，则返回家庭主记录和成员关系记录。
   *
   * @returns {Promise<{hasFamily: boolean, family: object | null, membership: object | null}>}
   */
  async getCurrentFamily() {
    const uid = requireLogin(this);
    const membership = await getMembershipByUserId(uid);

    if (!membership) {
      return {
        hasFamily: false,
        family: null,
        membership: null,
      };
    }

    const family = await getFamilyById(membership.family_id);

    if (!family || family.status !== "active") {
      return {
        hasFamily: false,
        family: null,
        membership: null,
      };
    }

    return {
      hasFamily: true,
      family,
      membership,
    };
  },
};
