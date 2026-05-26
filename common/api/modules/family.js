import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const familyCloudObject = getCloudObject("family-co");

/**
 * 查询当前登录用户的家庭归属状态。
 * 主要用于登录后的页面分流，以及首页判断当前是个人空间还是家庭空间。
 *
 * @returns {Promise<{hasFamily: boolean, family: object | null, membership: object | null}>}
 */
export function fetchCurrentFamily() {
  return familyCloudObject.getCurrentFamily();
}

/**
 * 创建一个新的家庭，并将当前登录用户自动设置为家庭管理员。
 * 主要用于家庭引导页中的“创建家庭”流程。
 *
 * @param {{name: string}} payload 创建家庭所需参数
 * @returns {Promise<{family: object, membership: object}>}
 */
export function createFamily(payload) {
  return familyCloudObject.createFamily(payload);
}

/**
 * 通过邀请码加入一个已存在的家庭。
 * 主要用于家庭引导页中的“加入家庭”流程。
 *
 * @param {{inviteCode: string}} payload 加入家庭所需参数
 * @returns {Promise<{family: object, membership: object}>}
 */
export function joinFamilyByInviteCode(payload) {
  return familyCloudObject.joinFamilyByInviteCode(payload);
}
