"use strict";
const common_vendor = require("../../vendor.js");
function getCloudObject(name) {
  return common_vendor._r.importObject(name, {
    customUI: true
  });
}
exports.getCloudObject = getCloudObject;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/clients/cloud-object.js.map
