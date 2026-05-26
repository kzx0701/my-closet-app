const db = uniCloud.database();
const familiesTable = db.collection("families");
const familyMembersTable = db.collection("family_members");

function requireLogin(context) {
  const uid = context.authInfo?.uid;

  if (!uid) {
    const error = new Error("当前未登录");
    error.errCode = "FAMILY_UNAUTHORIZED";
    throw error;
  }

  return uid;
}

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

async function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  for (let i = 0; i < 8; i += 1) {
    let inviteCode = "";

    for (let j = 0; j < 6; j += 1) {
      inviteCode += chars[Math.floor(Math.random() * chars.length)];
    }

    const existsRes = await familiesTable.where({
      invite_code: inviteCode,
    }).limit(1).get();

    if (!existsRes.data.length) {
      return inviteCode;
    }
  }

  const fallbackCode = `F${Date.now().toString(36).slice(-7).toUpperCase()}`;
  return fallbackCode.slice(0, 8);
}

async function getFamilyById(familyId) {
  const res = await familiesTable.doc(familyId).get();
  return res.data[0] || null;
}

module.exports = {
  async _before() {
    const token = this.getUniIdToken();

    if (!token) {
      this.authInfo = null;
      return;
    }

    const uniIdCommon = require("uni-id-common").createInstance({
      clientInfo: this.getClientInfo(),
    });
    const authResult = await uniIdCommon.checkToken(token);

    if (authResult.errCode) {
      throw authResult;
    }

    this.authInfo = authResult;
  },

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

    const family = await getFamilyById(familyId);

    return {
      family,
      membership: {
        family_id: familyId,
        user_id: uid,
        role: "admin",
        status: "active",
      },
    };
  },

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
