"use strict";
const common_vendor = require("../vendor.js");
const STORAGE_KEY_PREFIX = "closetScope:";
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}
function getClosetScopeState(uid) {
  const scopeType = common_vendor.index.getStorageSync(buildStorageKey(uid));
  return scopeType === "family" ? "family" : "personal";
}
function setClosetScopeState(uid, scopeType) {
  common_vendor.index.setStorageSync(buildStorageKey(uid), scopeType === "family" ? "family" : "personal");
}
exports.getClosetScopeState = getClosetScopeState;
exports.setClosetScopeState = setClosetScopeState;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/closet-scope-state.js.map
