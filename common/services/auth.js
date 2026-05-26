export function getCurrentSession() {
  const currentUserInfo = uniCloud.getCurrentUserInfo();
  const uid = currentUserInfo?.uid || "";
  const tokenExpired = Number(currentUserInfo?.tokenExpired || 0);
  const hasLogin = Boolean(uid) && (!tokenExpired || tokenExpired > Date.now());

  return {
    uid,
    hasLogin,
    tokenExpired,
    currentUserInfo,
  };
}
