import { ROUTES, ROUTE_TARGETS } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";

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

  if (membership.hasFamily) {
    return {
      target: ROUTE_TARGETS.home,
      url: ROUTES.home,
      session,
      membership,
    };
  }

  return {
    target: ROUTE_TARGETS.familyGuide,
    url: ROUTES.familyGuide,
    session,
    membership,
  };
}
