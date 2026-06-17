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
 * 主要用于家庭引导页中的"加入家庭"流程。
 *
 * @param {{inviteCode: string}} payload 加入家庭所需参数
 * @returns {Promise<{family: object, membership: object}>}
 */
export function joinFamilyByInviteCode(payload) {
  return familyCloudObject.joinFamilyByInviteCode(payload);
}

/**
 * 查询当前家庭的成员列表。
 * 返回成员基本信息（昵称、用户名、角色、加入时间）。
 *
 * @returns {Promise<{members: object[]}>}
 */
export function getFamilyMembers() {
  return familyCloudObject.getFamilyMembers();
}

/**
 * 退出当前家庭。
 * 管理员不能退出（需要先转让或解散）。
 *
 * @returns {Promise<{success: boolean}>}
 */
export function leaveFamily() {
  return familyCloudObject.leaveFamily();
}

/**
 * 移除家庭成员（仅管理员可用）。
 *
 * @param {{userId: string}} payload 要移除的用户 ID
 * @returns {Promise<{success: boolean}>}
 */
export function removeFamilyMember(payload) {
  return familyCloudObject.removeFamilyMember(payload);
}
