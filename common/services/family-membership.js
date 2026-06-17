import { fetchCurrentFamily } from "@/common/api/modules/family.js";

const UNAUTHORIZED_CODES = [
  "APP_UNAUTHORIZED",
  "FAMILY_UNAUTHORIZED",
  "uni-id-token-expired",
  "uni-id-check-token-failed",
  "uni-id-token-not-exist",
];

const FAMILY_REQUEST_TIMEOUT_MS = 8000;

/**
 * 为异步任务增加超时保护。
 * 当前主要用于家庭状态查询，避免云对象迟迟不返回时页面一直停留在加载态。
 *
 * @param {Promise<unknown>} task 原始异步任务
 * @param {number} timeoutMs 超时时间（毫秒）
 * @returns {Promise<unknown>}
 */
function withTimeout(task, timeoutMs) {
  return Promise.race([
    task,
    new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error("家庭状态查询超时");
        error.errCode = "FAMILY_REQUEST_TIMEOUT";
        reject(error);
      }, timeoutMs);
    }),
  ]);
}

/**
 * 获取当前用户的家庭归属状态。
 * 该服务层会在原始家庭查询接口之上补充：
 * 1. 登录失效识别
 * 2. 请求超时保护
 * 3. 统一的状态结构，供页面分流与首页渲染使用
 *
 * @param {string} uid 当前登录用户 ID
 * @returns {Promise<{
 *   status: "success" | "unauthorized" | "failed",
 *   hasFamily: boolean,
 *   membershipRecord: object | null,
 *   familyRecord: object | null,
 *   errorCode?: string,
 *   errorMessage?: string,
 *   error?: unknown
 * }>}
 */
export async function getFamilyMembership(uid) {
  if (!uid) {
    return {
      status: "unauthorized",
      hasFamily: false,
      membershipRecord: null,
      familyRecord: null,
      errorCode: "APP_UNAUTHORIZED",
      errorMessage: "当前未登录",
    };
  }

  try {
    const result = await withTimeout(fetchCurrentFamily(), FAMILY_REQUEST_TIMEOUT_MS);
    const membershipRecord = result?.membership || null;

    return {
      status: "success",
      hasFamily: Boolean(result?.hasFamily && membershipRecord),
      membershipRecord,
      familyRecord: result?.family || null,
      errorCode: "",
      errorMessage: "",
    };
  } catch (error) {
    console.error("getFamilyMembership failed", error);

    const errorCode = error?.errCode || error?.code || "";

    return {
      status: UNAUTHORIZED_CODES.includes(errorCode) ? "unauthorized" : "failed",
      hasFamily: false,
      membershipRecord: null,
      familyRecord: null,
      errorCode,
      errorMessage: error?.message || "家庭状态查询失败",
      error,
    };
  }
}
