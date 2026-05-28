import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const clothesCloudObject = getCloudObject("clothes-co");

/**
 * 获取当前登录用户个人空间下的衣物列表。
 * 当前这一批只开放个人空间衣物查询。
 *
 * @param {{
 *   closetId?: string,
 *   category?: string,
 *   season?: string
 * }} [payload]
 * @returns {Promise<{list: object[]}>}
 */
export function getPersonalClothesList(payload) {
  return clothesCloudObject.getPersonalClothesList(payload);
}

/**
 * 获取一条个人空间衣物详情。
 * 当前用于衣物编辑页回填表单。
 *
 * @param {{clothesId: string}} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function getClothesDetail(payload) {
  return clothesCloudObject.getClothesDetail(payload);
}

/**
 * 创建一条个人空间衣物记录。
 * 当前支持填写名称、分类、季节、颜色、备注，并可选绑定个人衣橱。
 *
 * @param {{
 *   name: string,
 *   category: string,
 *   season: string,
 *   color?: string,
 *   remark?: string,
 *   closetId?: string
 * }} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function createClothes(payload) {
  return clothesCloudObject.createClothes(payload);
}

/**
 * 更新一条个人空间衣物记录。
 * 当前仅允许修改自己的个人衣物。
 *
 * @param {{
 *   clothesId: string,
 *   name: string,
 *   category: string,
 *   season: string,
 *   color?: string,
 *   remark?: string,
 *   closetId?: string
 * }} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function updateClothes(payload) {
  return clothesCloudObject.updateClothes(payload);
}

/**
 * 删除一条个人空间衣物记录。
 *
 * @param {{clothesId: string}} payload
 * @returns {Promise<{success: boolean}>}
 */
export function deleteClothes(payload) {
  return clothesCloudObject.deleteClothes(payload);
}
