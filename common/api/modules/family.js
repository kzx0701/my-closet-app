import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const familyCloudObject = getCloudObject("family-co");

/**
 * 查询当前登录用户的当前家庭信息。
 * 仅负责调用云对象，不处理页面分流和状态装配。
 *
 * @returns {Promise<{hasFamily: boolean, family: object|null, membership: object|null}>}
 */
export function fetchCurrentFamily() {
  return familyCloudObject.getCurrentFamily();
}

/**
 * 创建家庭，并由当前登录用户自动成为管理员。
 * 仅负责调用云对象，不处理成功后的跳转和提示文案。
 *
 * @param {{name: string}} payload 创建家庭所需参数
 * @returns {Promise<{family: object, membership: object}>}
 */
export function createFamily(payload) {
  return familyCloudObject.createFamily(payload);
}
