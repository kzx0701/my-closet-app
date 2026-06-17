/**
 * 应用公共模块。
 * 提供云对象共享的鉴权能力，避免每个云对象重复实现相同的 _before 钩子和鉴权函数。
 */

/**
 * 获取 uni-id-common 模块。
 * 正式云环境优先使用标准 common 模块；本地调试缺少依赖时，回退到项目内 uni_modules 中的实现。
 *
 * @returns {object} uni-id-common module
 */
function getUniIdCommonModule() {
  try {
    return require("uni-id-common");
  } catch (error) {
    if (error?.code !== "MODULE_NOT_FOUND") {
      throw error;
    }

    return require("../../../../uni_modules/uni-id-common/uniCloud/cloudfunctions/common/uni-id-common");
  }
}

/**
 * 云对象前置钩子。
 * 统一完成 token 校验，并把鉴权结果挂到 this.authInfo，供后续接口复用。
 * 云对象只需在 module.exports 中调用 this._authBefore() 即可完成鉴权。
 */
async function authBefore() {
  const token = this.getUniIdToken();

  if (!token) {
    this.authInfo = null;
    return;
  }

  const uniIdCommon = getUniIdCommonModule().createInstance({
    clientInfo: this.getClientInfo(),
  });
  const authResult = await uniIdCommon.checkToken(token);

  if (authResult.errCode) {
    throw authResult;
  }

  this.authInfo = authResult;
}

/**
 * 确保当前请求已经登录，并返回当前用户 uid。
 *
 * @param {object} context 云对象上下文
 * @param {string} [unauthorizedCode=APP_UNAUTHORIZED] 未登录时的错误码
 * @returns {string} 当前登录用户 uid
 */
function requireLogin(context, unauthorizedCode) {
  const uid = context.authInfo?.uid;

  if (!uid) {
    const error = new Error("当前未登录");
    error.errCode = unauthorizedCode || "APP_UNAUTHORIZED";
    throw error;
  }

  return uid;
}

module.exports = {
  authBefore,
  requireLogin,
};
