"use strict";
const common_api_clients_cloudObject = require("../clients/cloud-object.js");
const familyCloudObject = common_api_clients_cloudObject.getCloudObject("family-co");
function fetchCurrentFamily() {
  return familyCloudObject.getCurrentFamily();
}
function createFamily(payload) {
  return familyCloudObject.createFamily(payload);
}
function joinFamilyByInviteCode(payload) {
  return familyCloudObject.joinFamilyByInviteCode(payload);
}
exports.createFamily = createFamily;
exports.fetchCurrentFamily = fetchCurrentFamily;
exports.joinFamilyByInviteCode = joinFamilyByInviteCode;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/modules/family.js.map
