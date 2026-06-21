import { ROUTES, ROUTE_TARGETS } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";

/**
 * 解析应用启动后的页面目标。
 * 这是登录后统一分流的核心服务，固定按以下顺序判断：
 * 1. 未登录 -> 登录页
 * 2. 家庭状态查询失败 -> 降级进入首页（离线模式），而非阻塞用户
 * 3. 已加入家庭 -> 首页
 * 4. 未加入家庭但已跳过家庭引导 -> 首页
 * 5. 其他情况 -> 家庭引导页
 *
 * 降级策略：当家庭状态查询失败（网络错误/服务不可用）时，
 * 如果用户已登录且本地有缓存或已跳过家庭引导，直接进入首页，
 * 首页各区块独立加载，失败时展示缓存或错误态。
 *
 * @returns {Promise<{
 *   target: string,
 *   url: string,
 *   session: object,
 *   membership?: object,
 *   hasSkippedFamilyGuide?: boolean,
 *   degraded?: boolean
 * }>}
 */
export async function resolveLaunchTarget() {
  const session = getCurrentSession();

  // 游客模式：未登录用户直接进入首页，浏览公开内容
  // 涉及个人数据的操作在首页内拦截并提示登录
  if (!session.hasLogin) {
    return {
      target: ROUTE_TARGETS.home,
      url: ROUTES.home,
      session,
      guest: true,
    };
  }

  const membership = await getFamilyMembership(session.uid);
  const hasSkippedFamilyGuide = getFamilyGuideSkipState(session.uid);

  // 鉴权失效：跳转登录页
  if (membership.status === "unauthorized") {
    return {
      target: ROUTE_TARGETS.login,
      url: ROUTES.login,
      session,
      membership,
    };
  }

  // 网络错误/服务不可用：已登录用户直接降级进入首页
  // 首页各区块独立加载，有缓存展示缓存，无缓存展示空状态/错误态，不阻塞用户
  if (membership.status === "failed") {
    return {
      target: ROUTE_TARGETS.home,
      url: ROUTES.home,
      session,
      membership,
      hasSkippedFamilyGuide,
      degraded: true, // 标记为降级模式
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
