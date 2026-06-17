"use strict";
const common_vendor = require("../vendor.js");
const STORAGE_KEY_PREFIX = "clothesScope:";
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}
function getClothesScopeState(uid) {
  const scopeType = common_vendor.index.getStorageSync(buildStorageKey(uid));
  return scopeType === "family" ? "family" : "personal";
}
function setClothesScopeState(uid, scopeType) {
  common_vendor.index.setStorageSync(buildStorageKey(uid), scopeType === "family" ? "family" : "personal");
}
exports.getClothesScopeState = getClothesScopeState;
exports.setClothesScopeState = setClothesScopeState;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/clothes-scope-state.js.map
