"use strict";
const common_vendor = require("../vendor.js");
const KEY_PREFIX = "cache:";
const DEFAULT_TTL = 30 * 60 * 1e3;
function buildKey(uid, scope) {
  return `${KEY_PREFIX}${uid || "guest"}:${scope}`;
}
function readCache(uid, scope) {
  try {
    const key = buildKey(uid, scope);
    const data = common_vendor.index.getStorageSync(key);
    if (!data || typeof data !== "object")
      return null;
    return data;
  } catch (e) {
    return null;
  }
}
function writeCache(uid, scope, value) {
  try {
    const key = buildKey(uid, scope);
    common_vendor.index.setStorageSync(key, {
      value,
      timestamp: Date.now()
    });
  } catch (e) {
  }
}
function isExpired(cacheEntry, ttl = DEFAULT_TTL) {
  if (!cacheEntry || !cacheEntry.timestamp)
    return true;
  return Date.now() - cacheEntry.timestamp > ttl;
}
const SCOPE_HOME_SUMMARY_PERSONAL = "homeSummary:personal";
const SCOPE_HOME_SUMMARY_FAMILY = "homeSummary:family";
function getHomeSummaryCache(uid, scopeType = "personal") {
  const scope = scopeType === "family" ? SCOPE_HOME_SUMMARY_FAMILY : SCOPE_HOME_SUMMARY_PERSONAL;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setHomeSummaryCache(uid, scopeType, summary) {
  const scope = scopeType === "family" ? SCOPE_HOME_SUMMARY_FAMILY : SCOPE_HOME_SUMMARY_PERSONAL;
  writeCache(uid, scope, summary);
}
const SCOPE_HOME_CLOTHES = "homeClothes";
function getHomeClothesCache(uid) {
  const entry = readCache(uid, SCOPE_HOME_CLOTHES);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setHomeClothesCache(uid, clothesList) {
  writeCache(uid, SCOPE_HOME_CLOTHES, clothesList);
}
const SCOPE_CLOTHES_LIST = "clothesList";
function getClothesListCache(uid, scopeType = "personal") {
  const scope = `${SCOPE_CLOTHES_LIST}:${scopeType}`;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setClothesListCache(uid, scopeType, data) {
  const scope = `${SCOPE_CLOTHES_LIST}:${scopeType}`;
  writeCache(uid, scope, data);
}
const SCOPE_CLOSET_LIST = "closetList";
function getClosetListCache(uid, scopeType = "personal") {
  const scope = `${SCOPE_CLOSET_LIST}:${scopeType}`;
  const entry = readCache(uid, scope);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setClosetListCache(uid, scopeType, data) {
  const scope = `${SCOPE_CLOSET_LIST}:${scopeType}`;
  writeCache(uid, scope, data);
}
const SCOPE_FAMILY_INFO = "familyInfo";
function getFamilyInfoCache(uid) {
  const entry = readCache(uid, SCOPE_FAMILY_INFO);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setFamilyInfoCache(uid, familyData) {
  writeCache(uid, SCOPE_FAMILY_INFO, familyData);
}
const SCOPE_USER_INFO = "userInfo";
function getUserInfoCache(uid) {
  const entry = readCache(uid, SCOPE_USER_INFO);
  if (!entry || isExpired(entry))
    return null;
  return entry.value;
}
function setUserInfoCache(uid, userInfo) {
  writeCache(uid, SCOPE_USER_INFO, userInfo);
}
function clearUserCache(uid) {
  if (!uid)
    return;
  try {
    const info = common_vendor.index.getStorageInfoSync();
    const prefix = `${KEY_PREFIX}${uid}:`;
    info.keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        common_vendor.index.removeStorageSync(key);
      }
    });
  } catch (e) {
  }
}
exports.clearUserCache = clearUserCache;
exports.getClosetListCache = getClosetListCache;
exports.getClothesListCache = getClothesListCache;
exports.getFamilyInfoCache = getFamilyInfoCache;
exports.getHomeClothesCache = getHomeClothesCache;
exports.getHomeSummaryCache = getHomeSummaryCache;
exports.getUserInfoCache = getUserInfoCache;
exports.setClosetListCache = setClosetListCache;
exports.setClothesListCache = setClothesListCache;
exports.setFamilyInfoCache = setFamilyInfoCache;
exports.setHomeClothesCache = setHomeClothesCache;
exports.setHomeSummaryCache = setHomeSummaryCache;
exports.setUserInfoCache = setUserInfoCache;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/services/cache-service.js.map
