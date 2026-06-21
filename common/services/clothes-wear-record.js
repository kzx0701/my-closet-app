const STORAGE_KEY_PREFIX = "clothesWear:";

/**
 * 生成当前用户的衣物穿着记录本地存储键。
 *
 * @param {string} uid 用户 ID
 * @returns {string} 本地存储键
 */
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}

/**
 * 从本地存储加载全部穿着记录。
 *
 * @param {string} uid 用户 ID
 * @returns {Object<string, number[]>} 以 clothesId 为键、时间戳数组为值的记录对象
 */
function loadRecords(uid) {
  try {
    const data = uni.getStorageSync(buildStorageKey(uid));
    return data && typeof data === "object" ? data : {};
  } catch (e) {
    console.error("loadClothesWearRecords failed", e);
    return {};
  }
}

/**
 * 将全部穿着记录写入本地存储。
 *
 * @param {string} uid 用户 ID
 * @param {Object<string, number[]>} records 穿着记录对象
 */
function saveRecords(uid, records) {
  try {
    uni.setStorageSync(buildStorageKey(uid), records);
  } catch (e) {
    console.error("saveClothesWearRecords failed", e);
  }
}

/**
 * 获取单件衣物的穿着次数。
 *
 * @param {string} uid 用户 ID
 * @param {string} clothesId 衣物 ID
 * @returns {number} 穿着次数
 */
export function getClothesWearCount(uid, clothesId) {
  if (!clothesId) return 0;
  const records = loadRecords(uid);
  const list = records[clothesId];
  return Array.isArray(list) ? list.length : 0;
}

/**
 * 批量获取多件衣物的穿着次数。
 * 适用于列表页一次性查询多件衣物的穿着次数，避免多次读取本地存储。
 *
 * @param {string} uid 用户 ID
 * @param {string[]} clothesIds 衣物 ID 数组
 * @returns {Object<string, number>} 以 clothesId 为键、穿着次数为值的映射
 */
export function getClothesWearCountMap(uid, clothesIds) {
  const records = loadRecords(uid);
  const map = {};
  (clothesIds || []).forEach((id) => {
    if (!id) return;
    const list = records[id];
    map[id] = Array.isArray(list) ? list.length : 0;
  });
  return map;
}

/**
 * 为指定衣物添加一条穿着记录（当前时间）。
 *
 * @param {string} uid 用户 ID
 * @param {string} clothesId 衣物 ID
 */
export function addClothesWearRecord(uid, clothesId) {
  if (!clothesId) return;
  const records = loadRecords(uid);
  if (!Array.isArray(records[clothesId])) {
    records[clothesId] = [];
  }
  records[clothesId].push(Date.now());
  saveRecords(uid, records);
}

/**
 * 移除指定衣物的全部穿着记录。
 *
 * @param {string} uid 用户 ID
 * @param {string} clothesId 衣物 ID
 */
export function removeClothesWearRecords(uid, clothesId) {
  if (!clothesId) return;
  const records = loadRecords(uid);
  if (records[clothesId] !== undefined) {
    delete records[clothesId];
    saveRecords(uid, records);
  }
}

/**
 * 清空当前用户的全部衣物穿着记录。
 *
 * @param {string} uid 用户 ID
 */
export function clearAllClothesWearRecords(uid) {
  saveRecords(uid, {});
}
