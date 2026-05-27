"use strict";
const common_api_clients_cloudObject = require("../clients/cloud-object.js");
const closetCloudObject = common_api_clients_cloudObject.getCloudObject("closet-co");
function createCloset(payload) {
  return closetCloudObject.createCloset(payload);
}
function getClosetDetail(payload) {
  return closetCloudObject.getClosetDetail(payload);
}
function getPersonalClosetList() {
  return closetCloudObject.getPersonalClosetList();
}
function getFamilyClosetList() {
  return closetCloudObject.getFamilyClosetList();
}
function updateCloset(payload) {
  return closetCloudObject.updateCloset(payload);
}
function deleteCloset(payload) {
  return closetCloudObject.deleteCloset(payload);
}
function getHomeSummary(payload) {
  return closetCloudObject.getHomeSummary(payload);
}
exports.createCloset = createCloset;
exports.deleteCloset = deleteCloset;
exports.getClosetDetail = getClosetDetail;
exports.getFamilyClosetList = getFamilyClosetList;
exports.getHomeSummary = getHomeSummary;
exports.getPersonalClosetList = getPersonalClosetList;
exports.updateCloset = updateCloset;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/modules/closet.js.map
