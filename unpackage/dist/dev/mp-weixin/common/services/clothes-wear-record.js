"use strict";
const common_vendor = require("../vendor.js");
const STORAGE_KEY_PREFIX = "clothesWear:";
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}
function loadRecords(uid) {
  try {
    const data = common_vendor.index.getStorageSync(buildStorageKey(uid));
    return data && typeof data === "object" ? data : {};
  } catch (e) {
    common_vendor.index.__f__("error", "at common/services/clothes-wear-record.js:24", "loadClothesWearRecords failed", e);
    return {};
  }
}
function getClothesWearCountMap(uid, clothesIds) {
  const records = loadRecords(uid);
  const map = {};
  (clothesIds || []).forEach((id) => {
    if (!id)
      return;
    const list = records[id];
    map[id] = Array.isArray(list) ? list.length : 0;
  });
  return map;
}
exports.getClothesWearCountMap = getClothesWearCountMap;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/clothes-wear-record.js.map
