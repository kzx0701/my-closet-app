/**
 * 业务数据缓存服务
 *
 * 设计原则：
 * 1. 按 uid 维度隔离，不同用户缓存互不干扰
 * 2. 每条缓存带时间戳，支持 TTL 过期判断
 * 3. 仅缓存"可降级展示"的数据（列表、摘要），不缓存需要强一致性的数据
 * 4. 缓存为"最佳努力"策略：读取失败返回 null，写入失败静默忽略
 */

const KEY_PREFIX = "cache:";
const DEFAULT_TTL = 30 * 60 * 1000; // 30 分钟

// ===== 内部工具 =====

function buildKey(uid, scope) {
  return `${KEY_PREFIX}${uid || "guest"}:${scope}`;
}

function readCache(uid, scope) {
  try {
    const key = buildKey(uid, scope);
    const data = uni.getStorageSync(key);
    if (!data || typeof data !== "object") return null;
    return data;
  } catch (e) {
    return null;
  }
}

function writeCache(uid, scope, value) {
  try {
    const key = buildKey(uid, scope);
    uni.setStorageSync(key, {
      value,
      timestamp: Date.now(),
    });
  } catch (e) {
    // 缓存写入失败静默忽略
  }
}

function isExpired(cacheEntry, ttl = DEFAULT_TTL) {
  if (!cacheEntry || !cacheEntry.timestamp) return true;
  return Date.now() - cacheEntry.timestamp > ttl;
}

// ===== 首页摘要缓存 =====

const SCOPE_HOME_SUMMARY_PERSONAL = "homeSummary:personal";
const SCOPE_HOME_SUMMARY_FAMILY = "homeSummary:family";

export function getHomeSummaryCache(uid, scopeType = "personal") {
  const scope =
    scopeType === "family"
      ? SCOPE_HOME_SUMMARY_FAMILY
      : SCOPE_HOME_SUMMARY_PERSONAL;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setHomeSummaryCache(uid, scopeType, summary) {
  const scope =
    scopeType === "family"
      ? SCOPE_HOME_SUMMARY_FAMILY
      : SCOPE_HOME_SUMMARY_PERSONAL;
  writeCache(uid, scope, summary);
}

// ===== 首页衣物列表缓存（用于分类分布展示） =====

const SCOPE_HOME_CLOTHES = "homeClothes";

export function getHomeClothesCache(uid) {
  const entry = readCache(uid, SCOPE_HOME_CLOTHES);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setHomeClothesCache(uid, clothesList) {
  writeCache(uid, SCOPE_HOME_CLOTHES, clothesList);
}

// ===== 衣物列表页缓存 =====

const SCOPE_CLOTHES_LIST = "clothesList";

export function getClothesListCache(uid, scopeType = "personal") {
  const scope = `${SCOPE_CLOTHES_LIST}:${scopeType}`;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setClothesListCache(uid, scopeType, data) {
  const scope = `${SCOPE_CLOTHES_LIST}:${scopeType}`;
  writeCache(uid, scope, data);
}

// ===== 衣橱列表页缓存 =====

const SCOPE_CLOSET_LIST = "closetList";

export function getClosetListCache(uid, scopeType = "personal") {
  const scope = `${SCOPE_CLOSET_LIST}:${scopeType}`;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setClosetListCache(uid, scopeType, data) {
  const scope = `${SCOPE_CLOSET_LIST}:${scopeType}`;
  writeCache(uid, scope, data);
}

// ===== 家庭信息缓存 =====

const SCOPE_FAMILY_INFO = "familyInfo";

export function getFamilyInfoCache(uid) {
  const entry = readCache(uid, SCOPE_FAMILY_INFO);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setFamilyInfoCache(uid, familyData) {
  writeCache(uid, SCOPE_FAMILY_INFO, familyData);
}

// ===== 用户信息缓存 =====

const SCOPE_USER_INFO = "userInfo";

export function getUserInfoCache(uid) {
  const entry = readCache(uid, SCOPE_USER_INFO);
  if (!entry || isExpired(entry)) return null;
  return entry.value;
}

export function setUserInfoCache(uid, userInfo) {
  writeCache(uid, SCOPE_USER_INFO, userInfo);
}

// ===== 缓存管理 =====

/**
 * 清除指定用户的所有业务数据缓存
 * @param {string} uid
 */
export function clearUserCache(uid) {
  if (!uid) return;
  try {
    const info = uni.getStorageInfoSync();
    const prefix = `${KEY_PREFIX}${uid}:`;
    info.keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        uni.removeStorageSync(key);
      }
    });
  } catch (e) {
    // 清除失败静默忽略
  }
}

/**
 * 检查缓存是否可用（非空且未过期）
 * @param {string} uid
 * @param {string} scopeType - 缓存作用域
 * @returns {boolean}
 */
export function hasValidCache(uid, scopeType = "personal") {
  const summary = getHomeSummaryCache(uid, scopeType);
  return summary !== null;
}
