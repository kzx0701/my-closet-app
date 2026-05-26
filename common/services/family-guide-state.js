const STORAGE_KEY_PREFIX = "familyGuideSkipped:";

/**
 * 生成当前用户的“已跳过家庭引导”本地存储键。
 *
 * @param {string} uid 用户 ID
 * @returns {string} 本地存储键
 */
function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid}`;
}

/**
 * 读取当前用户是否已跳过家庭引导。
 * 该状态用于登录后分流：没有加入家庭但已跳过引导时，可直接进入首页个人模式。
 *
 * @param {string} uid 用户 ID
 * @returns {boolean} 是否已跳过家庭引导
 */
export function getFamilyGuideSkipState(uid) {
  if (!uid) {
    return false;
  }

  return Boolean(uni.getStorageSync(buildStorageKey(uid)));
}

/**
 * 设置当前用户的家庭引导跳过状态。
 *
 * @param {string} uid 用户 ID
 * @param {boolean} skipped 是否已跳过
 */
export function setFamilyGuideSkipState(uid, skipped) {
  if (!uid) {
    return;
  }

  if (skipped) {
    uni.setStorageSync(buildStorageKey(uid), 1);
    return;
  }

  uni.removeStorageSync(buildStorageKey(uid));
}

/**
 * 清除当前用户的家庭引导跳过状态。
 * 当用户创建家庭或加入家庭成功后，应清理该标记。
 *
 * @param {string} uid 用户 ID
 */
export function clearFamilyGuideSkipState(uid) {
  if (!uid) {
    return;
  }

  uni.removeStorageSync(buildStorageKey(uid));
}
