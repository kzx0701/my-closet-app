import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const closetCloudObject = getCloudObject("closet-co");

/**
 * 创建衣橱。
 * 当前已支持按个人空间或家庭空间创建预设样式衣橱。
 *
 * @param {{
 *   scopeType?: "personal" | "family",
 *   name: string,
 *   roomName?: string,
 *   styleCode: string,
 *   colorCode: string,
 *   description?: string
 * }} payload
 * @returns {Promise<{closet: object | null}>}
 */
export function createCloset(payload) {
  return closetCloudObject.createCloset(payload);
}

/**
 * 获取衣橱详情。
 *
 * @param {{closetId: string}} payload
 * @returns {Promise<{closet: object | null}>}
 */
export function getClosetDetail(payload) {
  return closetCloudObject.getClosetDetail(payload);
}

/**
 * 获取当前登录用户个人空间下的衣橱列表。
 *
 * @param {{page?: number, pageSize?: number}} [payload]
 * @returns {Promise<{list: object[], total: number, page: number, pageSize: number}>}
 */
export function getPersonalClosetList(payload) {
  return closetCloudObject.getPersonalClosetList(payload);
}

/**
 * 获取当前登录用户所在家庭空间下的衣橱列表。
 *
 * @param {{page?: number, pageSize?: number}} [payload]
 * @returns {Promise<{list: object[], total: number, page: number, pageSize: number, familyId?: string}>}
 */
export function getFamilyClosetList(payload) {
  return closetCloudObject.getFamilyClosetList(payload);
}

/**
 * 更新衣橱基础信息。
 *
 * @param {{
 *   closetId: string,
 *   name: string,
 *   roomName?: string,
 *   styleCode: string,
 *   colorCode: string,
 *   description?: string
 * }} payload
 * @returns {Promise<{closet: object | null}>}
 */
export function updateCloset(payload) {
  return closetCloudObject.updateCloset(payload);
}

/**
 * 删除衣橱。
 *
 * @param {{closetId: string}} payload
 * @returns {Promise<{success: boolean}>}
 */
export function deleteCloset(payload) {
  return closetCloudObject.deleteCloset(payload);
}

/**
 * 获取首页摘要统计。
 *
 * @param {{scopeType: "personal" | "family"}} payload
 * @returns {Promise<{closetCount: number, clothesCount: number, unassignedClothesCount: number}>}
 */
export function getHomeSummary(payload) {
  return closetCloudObject.getHomeSummary(payload);
}
