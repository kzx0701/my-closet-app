"use strict";
const common_vendor = require("../vendor.js");
const STORAGE_KEY_PREFIX = "familyGuideSkipped:";
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid}`;
}
function getFamilyGuideSkipState(uid) {
  if (!uid) {
    return false;
  }
  return Boolean(common_vendor.index.getStorageSync(buildStorageKey(uid)));
}
function setFamilyGuideSkipState(uid, skipped) {
  if (!uid) {
    return;
  }
  if (skipped) {
    common_vendor.index.setStorageSync(buildStorageKey(uid), 1);
    return;
  }
  common_vendor.index.removeStorageSync(buildStorageKey(uid));
}
function clearFamilyGuideSkipState(uid) {
  if (!uid) {
    return;
  }
  common_vendor.index.removeStorageSync(buildStorageKey(uid));
}
exports.clearFamilyGuideSkipState = clearFamilyGuideSkipState;
exports.getFamilyGuideSkipState = getFamilyGuideSkipState;
exports.setFamilyGuideSkipState = setFamilyGuideSkipState;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/family-guide-state.js.map
