import { getCloudObject } from "@/common/api/clients/cloud-object.js";
import { getCollection } from "@/common/api/clients/client-db.js";

const uniIdCo = getCloudObject("uni-id-co");

/**
 * 用户名密码登录。
 * 支持用户名、手机号或邮箱作为账号。
 *
 * @param {{username?: string, mobile?: string, email?: string, password: string}} payload
 * @returns {Promise<object>} 登录结果，包含 token 等信息
 */
export function login(payload) {
  return uniIdCo.login(payload);
}

/**
 * 用户名密码注册。
 *
 * @param {{
 *   username: string,
 *   nickname?: string,
 *   password: string,
 *   password2: string,
 *   captcha: string
 * }} payload
 * @returns {Promise<object>} 注册结果，包含 token 等信息
 */
export function registerUser(payload) {
  return uniIdCo.registerUser(payload);
}

/**
 * 获取当前登录用户的基本资料。
 * 通过 clientDB 按 uid 查询 uni-id-users 表，仅取昵称、用户名、头像字段。
 *
 * @param {string} uid 用户 ID
 * @returns {Promise<{nickname: string, username: string, avatar: string} | null>}
 */
export async function getCurrentUserInfo(uid) {
  if (!uid) return null;

  const res = await getCollection("uni-id-users")
    .doc(uid)
    .field("nickname, username, avatar_file")
    .get();

  const user = res?.data?.[0];
  if (!user) return null;

  return {
    nickname: user.nickname || "",
    username: user.username || "",
    avatar: user.avatar_file?.url || "",
  };
}
