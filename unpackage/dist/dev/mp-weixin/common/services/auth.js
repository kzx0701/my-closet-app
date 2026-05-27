"use strict";
const common_vendor = require("../vendor.js");
function getCurrentSession() {
  const currentUserInfo = common_vendor._r.getCurrentUserInfo();
  const uid = (currentUserInfo == null ? void 0 : currentUserInfo.uid) || "";
  const tokenExpired = Number((currentUserInfo == null ? void 0 : currentUserInfo.tokenExpired) || 0);
  const hasLogin = Boolean(uid) && (!tokenExpired || tokenExpired > Date.now());
  return {
    uid,
    hasLogin,
    tokenExpired,
    currentUserInfo
  };
}
exports.getCurrentSession = getCurrentSession;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/auth.js.map
