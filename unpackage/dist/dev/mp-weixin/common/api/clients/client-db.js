"use strict";
const common_vendor = require("../../vendor.js");
let dbInstance = null;
function getDatabase() {
  if (!dbInstance) {
    dbInstance = common_vendor._r.database();
  }
  return dbInstance;
}
function getCollection(name) {
  return getDatabase().collection(name);
}
exports.getCollection = getCollection;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/api/clients/client-db.js.map
