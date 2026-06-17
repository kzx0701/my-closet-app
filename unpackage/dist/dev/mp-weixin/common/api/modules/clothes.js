"use strict";
const common_api_clients_cloudObject = require("../clients/cloud-object.js");
const clothesCloudObject = common_api_clients_cloudObject.getCloudObject("clothes-co");
function getPersonalClothesList(payload) {
  return clothesCloudObject.getPersonalClothesList(payload);
}
function getFamilyClothesList(payload) {
  return clothesCloudObject.getFamilyClothesList(payload);
}
function getClothesDetail(payload) {
  return clothesCloudObject.getClothesDetail(payload);
}
function createClothes(payload) {
  return clothesCloudObject.createClothes(payload);
}
function updateClothes(payload) {
  return clothesCloudObject.updateClothes(payload);
}
function deleteClothes(payload) {
  return clothesCloudObject.deleteClothes(payload);
}
exports.createClothes = createClothes;
exports.deleteClothes = deleteClothes;
exports.getClothesDetail = getClothesDetail;
exports.getFamilyClothesList = getFamilyClothesList;
exports.getPersonalClothesList = getPersonalClothesList;
exports.updateClothes = updateClothes;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/modules/clothes.js.map
