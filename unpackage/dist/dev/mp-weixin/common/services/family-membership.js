"use strict";
const common_vendor = require("../vendor.js");
const common_api_modules_family = require("../api/modules/family.js");
const UNAUTHORIZED_CODES = [
  "FAMILY_UNAUTHORIZED",
  "uni-id-token-expired",
  "uni-id-check-token-failed",
  "uni-id-token-not-exist"
];
const FAMILY_REQUEST_TIMEOUT_MS = 8e3;
function withTimeout(task, timeoutMs) {
  return Promise.race([
    task,
    new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error("家庭状态查询超时");
        error.errCode = "FAMILY_REQUEST_TIMEOUT";
        reject(error);
      }, timeoutMs);
    })
  ]);
}
async function getFamilyMembership(uid) {
  if (!uid) {
    return {
      status: "unauthorized",
      hasFamily: false,
      membershipRecord: null,
      familyRecord: null,
      errorCode: "FAMILY_UNAUTHORIZED",
      errorMessage: "当前未登录"
    };
  }
  try {
    const result = await withTimeout(common_api_modules_family.fetchCurrentFamily(), FAMILY_REQUEST_TIMEOUT_MS);
    const membershipRecord = (result == null ? void 0 : result.membership) || null;
    return {
      status: "success",
      hasFamily: Boolean((result == null ? void 0 : result.hasFamily) && membershipRecord),
      membershipRecord,
      familyRecord: (result == null ? void 0 : result.family) || null,
      errorCode: "",
      errorMessage: ""
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at common/services/family-membership.js:76", "getFamilyMembership failed", error);
    const errorCode = (error == null ? void 0 : error.errCode) || (error == null ? void 0 : error.code) || "";
    return {
      status: UNAUTHORIZED_CODES.includes(errorCode) ? "unauthorized" : "failed",
      hasFamily: false,
      membershipRecord: null,
      familyRecord: null,
      errorCode,
      errorMessage: (error == null ? void 0 : error.message) || "家庭状态查询失败",
      error
    };
  }
}
exports.getFamilyMembership = getFamilyMembership;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/family-membership.js.map
