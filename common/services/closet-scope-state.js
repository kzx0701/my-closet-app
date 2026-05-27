const STORAGE_KEY_PREFIX = "closetScope:";

function buildStorageKey(uid) {
  return `${STORAGE_KEY_PREFIX}${uid || "guest"}`;
}

export function getClosetScopeState(uid) {
  const scopeType = uni.getStorageSync(buildStorageKey(uid));
  return scopeType === "family" ? "family" : "personal";
}

export function setClosetScopeState(uid, scopeType) {
  uni.setStorageSync(buildStorageKey(uid), scopeType === "family" ? "family" : "personal");
}
