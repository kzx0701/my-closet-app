"use strict";
const common_constants_routes = require("../constants/routes.js");
const common_services_auth = require("./auth.js");
const common_services_familyGuideState = require("./family-guide-state.js");
const common_services_familyMembership = require("./family-membership.js");
async function resolveLaunchTarget() {
  const session = common_services_auth.getCurrentSession();
  if (!session.hasLogin) {
    return {
      target: common_constants_routes.ROUTE_TARGETS.home,
      url: common_constants_routes.ROUTES.home,
      session,
      guest: true
    };
  }
  const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
  const hasSkippedFamilyGuide = common_services_familyGuideState.getFamilyGuideSkipState(session.uid);
  if (membership.status === "unauthorized") {
    return {
      target: common_constants_routes.ROUTE_TARGETS.login,
      url: common_constants_routes.ROUTES.login,
      session,
      membership
    };
  }
  if (membership.status === "failed") {
    return {
      target: common_constants_routes.ROUTE_TARGETS.home,
      url: common_constants_routes.ROUTES.home,
      session,
      membership,
      hasSkippedFamilyGuide,
      degraded: true
      // 标记为降级模式
    };
  }
  if (membership.hasFamily) {
    return {
      target: common_constants_routes.ROUTE_TARGETS.home,
      url: common_constants_routes.ROUTES.home,
      session,
      membership
    };
  }
  if (hasSkippedFamilyGuide) {
    return {
      target: common_constants_routes.ROUTE_TARGETS.home,
      url: common_constants_routes.ROUTES.home,
      session,
      membership,
      hasSkippedFamilyGuide
    };
  }
  return {
    target: common_constants_routes.ROUTE_TARGETS.familyGuide,
    url: common_constants_routes.ROUTES.familyGuide,
    session,
    membership,
    hasSkippedFamilyGuide
  };
}
exports.resolveLaunchTarget = resolveLaunchTarget;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/session-router.js.map
