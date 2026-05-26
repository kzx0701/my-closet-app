let dbInstance = null;

/**
 * 获取 uniCloud 数据库实例。
 * 统一在这里维护 clientDB 实例，避免业务侧重复创建。
 *
 * @returns {object} uniCloud database instance
 */
export function getDatabase() {
  if (!dbInstance) {
    dbInstance = uniCloud.database();
  }

  return dbInstance;
}

/**
 * 按集合名称获取 clientDB collection。
 * 接口模块统一通过这里拿集合对象，页面层不直接操作数据库实例。
 *
 * @param {string} name 集合名称
 * @returns {object} collection instance
 */
export function getCollection(name) {
  return getDatabase().collection(name);
}
