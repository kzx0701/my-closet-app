/**
 * 获取当前登录会话信息。
 * 这里统一从 uniCloud 当前用户信息中提取 uid、token 过期时间和是否已登录，供页面分流与业务服务复用。
 *
 * @returns {{
 *   uid: string,
 *   hasLogin: boolean,
 *   tokenExpired: number,
 *   currentUserInfo: object
 * }}
 */
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
