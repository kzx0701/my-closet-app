let dbInstance = null;

/**
 * 获取 uniCloud 数据库实例。
 * 当页面侧存在只读查询等轻量场景时，可以复用这里的单例，避免重复创建数据库连接对象。
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
 * 根据集合名称获取 clientDB collection。
 * 接口模块统一通过这里拿 collection，页面层不直接操作数据库实例。
 *
 * @param {string} name 集合名称
 * @returns {object} collection instance
 */
export function getCollection(name) {
  return getDatabase().collection(name);
}
