const db = uniCloud.database();
const usersTable = db.collection("uni-id-users");
const { authBefore, requireLogin } = require("../common/app-common");

module.exports = {
  async _before() {
    await authBefore.call(this);
  },

  /**
   * 更新当前登录用户的昵称和头像。
   * 微信小程序登录后调用，将微信返回的用户信息写入数据库。
   *
   * @param {object} params
   * @param {string} [params.nickname] 昵称
   * @param {string} [params.avatarUrl] 头像 URL
   * @returns {{ errCode: number }}
   */
  async updateMyProfile(params = {}) {
    const uid = requireLogin(this);
    const { nickname, avatarUrl } = params;

    const data = {};
    if (nickname) data.nickname = nickname;
    if (avatarUrl) {
      data.avatar_file = {
        name: "wechat-avatar",
        extname: "jpg",
        url: avatarUrl,
      };
    }

    if (Object.keys(data).length === 0) {
      return { errCode: 0 };
    }

    await usersTable.doc(uid).update(data);
    return { errCode: 0 };
  },
};
