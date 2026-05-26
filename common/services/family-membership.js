import { fetchCurrentFamily } from "@/common/api/modules/family.js";

/**
 * 获取当前用户的家庭归属状态。
 * 这里负责把原始接口结果整理成页面和分流逻辑更容易消费的结构。
 *
 * @param {string} uid 当前登录用户 ID
 * @returns {Promise<{hasFamily: boolean, membershipRecord: object | null, familyRecord?: object | null, error?: unknown}>}
 */
export async function getFamilyMembership(uid) {
  if (!uid) {
    return {
      hasFamily: false,
      membershipRecord: null,
    };
  }

  try {
    const result = await fetchCurrentFamily();
    const membershipRecord = result?.membership || null;

    return {
      hasFamily: Boolean(result?.hasFamily && membershipRecord),
      membershipRecord,
      familyRecord: result?.family || null,
    };
  } catch (error) {
    console.error("getFamilyMembership failed", error);
    return {
      hasFamily: false,
      membershipRecord: null,
      familyRecord: null,
      error,
    };
  }
}
