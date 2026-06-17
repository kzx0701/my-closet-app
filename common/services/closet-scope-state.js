const STORAGE_KEY_PREFIX = "closetScope:";

/**
 * 生成当前用户的衣橱作用域本地存储键。
 *
 * @param {string} uid 用户 ID
 * @returns {string} 本地存储键
 */
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}

/**
 * 获取当前用户的衣橱作用域状态。
 * 该状态用于衣橱列表页在个人空间和家庭空间之间切换。
 *
 * @param {string} uid 用户 ID
 * @returns {"personal" | "family"} 当前衣橱作用域
 */
export function getClosetScopeState(uid) {
  const scopeType = uni.getStorageSync(buildStorageKey(uid));
  return scopeType === "family" ? "family" : "personal";
}

/**
 * 设置当前用户的衣橱作用域状态。
 *
 * @param {string} uid 用户 ID
 * @param {"personal" | "family"} scopeType 目标作用域
 */
export function setClosetScopeState(uid, scopeType) {
  uni.setStorageSync(buildStorageKey(uid), scopeType === "family" ? "family" : "personal");
}
