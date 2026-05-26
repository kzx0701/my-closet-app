/**
 * 统一获取 uniCloud 云对象实例。
 * 业务接口模块通过这里访问云对象，避免在多个文件里重复书写 importObject 配置。
 *
 * @param {string} name 云对象名称
 * @returns {object} 云对象实例
 */
export function getCloudObject(name) {
  return uniCloud.importObject(name, {
    customUI: true,
  });
}
