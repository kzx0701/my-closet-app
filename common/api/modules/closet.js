import { getCloudObject } from "@/common/api/clients/cloud-object.js";

const closetCloudObject = getCloudObject("closet-co");

/**
 * 创建个人空间衣橱。
 * 当前一期仅先开放个人空间的预设样式衣橱创建。
 *
 * @param {{
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
 * 获取当前登录用户个人空间下的衣橱列表。
 *
 * @returns {Promise<{list: object[]}>}
 */
export function getPersonalClosetList() {
  return closetCloudObject.getPersonalClosetList();
}
