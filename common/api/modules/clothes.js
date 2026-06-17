import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const clothesCloudObject = getCloudObject("clothes-co");

/**
 * 获取当前登录用户个人空间下的衣物列表。
 *
 * @param {{
 *   closetId?: string,
 *   category?: string,
 *   season?: string,
 *   page?: number,
 *   pageSize?: number
 * }} [payload]
 * @returns {Promise<{list: object[], total: number, page: number, pageSize: number}>}
 */
export function getPersonalClothesList(payload) {
  return clothesCloudObject.getPersonalClothesList(payload);
}

/**
 * 获取当前登录用户所在家庭空间下的衣物列表。
 *
 * @param {{
 *   closetId?: string,
 *   category?: string,
 *   season?: string,
 *   page?: number,
 *   pageSize?: number
 * }} [payload]
 * @returns {Promise<{list: object[], total: number, page: number, pageSize: number, familyId?: string}>}
 */
export function getFamilyClothesList(payload) {
  return clothesCloudObject.getFamilyClothesList(payload);
}

/**
 * 获取一条衣物详情。
 *
 * @param {{clothesId: string}} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function getClothesDetail(payload) {
  return clothesCloudObject.getClothesDetail(payload);
}

/**
 * 创建一条衣物记录。
 * 支持个人空间和家庭空间。
 *
 * @param {{
 *   scopeType?: "personal" | "family",
 *   name: string,
 *   category: string,
 *   season: string,
 *   color?: string,
 *   remark?: string,
 *   imageUrl?: string,
 *   closetId?: string
 * }} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function createClothes(payload) {
  return clothesCloudObject.createClothes(payload);
}

/**
 * 更新一条衣物记录。
 *
 * @param {{
 *   clothesId: string,
 *   name: string,
 *   category: string,
 *   season: string,
 *   color?: string,
 *   remark?: string,
 *   imageUrl?: string,
 *   closetId?: string
 * }} payload
 * @returns {Promise<{clothes: object | null}>}
 */
export function updateClothes(payload) {
  return clothesCloudObject.updateClothes(payload);
}

/**
 * 删除一条衣物记录。
 *
 * @param {{clothesId: string}} payload
 * @returns {Promise<{success: boolean}>}
 */
export function deleteClothes(payload) {
  return clothesCloudObject.deleteClothes(payload);
}
