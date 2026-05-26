import { ROUTES, ROUTE_TARGETS } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";

/**
 * 解析应用启动后的页面目标。
 * 这是登录后统一分流的核心服务，固定按以下顺序判断：
 * 1. 未登录 -> 登录页
 * 2. 家庭状态查询失败 -> 留在入口页显示错误
 * 3. 已加入家庭 -> 首页
 * 4. 未加入家庭但已跳过家庭引导 -> 首页
 * 5. 其他情况 -> 家庭引导页
 *
 * @returns {Promise<{
 *   target: string,
 *   url: string,
 *   session: object,
 *   membership?: object,
 *   hasSkippedFamilyGuide?: boolean
 * }>}
 */
export async function resolveLaunchTarget() {
  const session = getCurrentSession();

  if (!session.hasLogin) {
    return {
      target: ROUTE_TARGETS.login,
      url: ROUTES.login,
      session,
    };
  }

  const membership = await getFamilyMembership(session.uid);
  const hasSkippedFamilyGuide = getFamilyGuideSkipState(session.uid);

  if (membership.status === "unauthorized") {
    return {
      target: ROUTE_TARGETS.login,
      url: ROUTES.login,
      session,
      membership,
    };
  }

  if (membership.status === "failed") {
    return {
      target: ROUTE_TARGETS.error,
      url: ROUTES.entry,
      session,
      membership,
    };
  }

  if (membership.hasFamily) {
    return {
      target: ROUTE_TARGETS.home,
      url: ROUTES.home,
      session,
      membership,
    };
  }

  if (hasSkippedFamilyGuide) {
    return {
      target: ROUTE_TARGETS.home,
      url: ROUTES.home,
      session,
      membership,
      hasSkippedFamilyGuide,
    };
  }

  return {
    target: ROUTE_TARGETS.familyGuide,
    url: ROUTES.familyGuide,
    session,
    membership,
    hasSkippedFamilyGuide,
  };
}
