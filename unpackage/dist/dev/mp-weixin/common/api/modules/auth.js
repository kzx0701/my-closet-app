"use strict";
const common_api_clients_cloudObject = require("../clients/cloud-object.js");
const common_api_clients_clientDb = require("../clients/client-db.js");
const uniIdCo = common_api_clients_cloudObject.getCloudObject("uni-id-co");
function login(payload) {
  return uniIdCo.login(payload);
}
function registerUser(payload) {
  return uniIdCo.registerUser(payload);
}
async function getCurrentUserInfo(uid) {
  var _a;
  if (!uid)
    return null;
  const res = await common_api_clients_clientDb.getCollection("uni-id-users").doc(uid).field("nickname, username, avatar_file").get();
  const user = res.data[0];
  if (!user)
    return null;
  return {
    nickname: user.nickname || "",
    username: user.username || "",
    avatar: ((_a = user.avatar_file) == null ? void 0 : _a.url) || ""
  };
}
exports.getCurrentUserInfo = getCurrentUserInfo;
exports.login = login;
exports.registerUser = registerUser;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/modules/auth.js.map
