<template>
  <view class="page">
    <!-- 背景层：随页面滚动 -->
    <view class="page-bg noise-texture"></view>

    <!-- Hero 区（绿色背景上） -->
    <view class="hero-zone fade-up-delay-1">
      <ScopeBadge :text="scopeBadgeText" />
      <text class="scope-title">{{ pageTitle }}</text>
      <text class="scope-desc">{{ pageDesc }}</text>
      <view class="hero-stats">
        <view class="stat-item">
          <text class="stat-value">{{ summaryData.closetCount }}</text>
          <text class="stat-label">衣橱</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value accent">{{ summaryData.clothesCount }}</text>
          <text class="stat-label">衣物</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ summaryData.unassignedCount }}</text>
          <text class="stat-label">未归类</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-bar fade-up-delay-2">
      <view class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          class="search-input"
          type="text"
          :value="searchKeyword"
          placeholder="搜索衣橱名称或房间…"
          placeholder-class="search-placeholder"
          @input="onSearchInput"
        />
        <view v-if="searchKeyword" class="search-clear" hover-class="search-clear-hover" :hover-stay-time="100" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </view>
      </view>
    </view>

    <!-- 筛选条（sticky） -->
    <view class="filter-bar fade-up-delay-2">
      <view
        class="filter-chip"
        :class="{ 'filter-chip-active': scopeType === 'personal' }"
        hover-class="filter-chip-hover"
        :hover-stay-time="100"
        @click="changeScope('personal')"
      >
        <text class="filter-chip-text">个人空间</text>
      </view>
      <view
        v-if="hasFamily"
        class="filter-chip"
        :class="{ 'filter-chip-active': scopeType === 'family' }"
        hover-class="filter-chip-hover"
        :hover-stay-time="100"
        @click="changeScope('family')"
      >
        <text class="filter-chip-text">家庭空间 · {{ familyName }}</text>
      </view>
    </view>

    <!-- 衣橱列表 -->
    <view class="closet-list fade-up-delay-3">
      <!-- 加载骨架屏 -->
      <view v-if="loading && closets.length === 0" class="skeleton-list">
        <view v-for="n in 4" :key="n" class="skeleton-card">
          <view class="skeleton skeleton-thumb"></view>
          <view class="skeleton-info">
            <view class="skeleton skeleton-name"></view>
            <view class="skeleton skeleton-meta"></view>
            <view class="skeleton skeleton-tag"></view>
          </view>
          <view class="skeleton-count-wrap">
            <view class="skeleton skeleton-count"></view>
            <view class="skeleton skeleton-count-unit"></view>
          </view>
        </view>
      </view>

      <!-- 错误态 -->
      <view v-else-if="error" class="error-card">
        <svg class="err-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <view class="err-content">
          <text class="err-title">加载失败</text>
          <text class="err-desc">衣橱列表加载失败，请检查网络后重试。</text>
          <text class="err-retry" @click="retryLoad">重新加载</text>
        </view>
      </view>

      <!-- 空状态 -->
      <closet-empty-state
        v-else-if="closets.length === 0"
        :scope-type="scopeType"
        :can-create="allowCreate"
        @create="goCreateCloset"
      />

      <!-- 搜索无结果 -->
      <view v-else-if="displayClosets.length === 0" class="search-empty">
        <text class="search-empty-text">未找到匹配的衣橱</text>
        <text class="search-clear-btn" @click="clearSearch">清除搜索</text>
      </view>

      <!-- 列表内容 -->
      <view v-else class="list-inner">
        <closet-list-card
          v-for="item in displayClosets"
          :key="item._id"
          :closet="item"
        />

        <!-- 新建衣橱入口 -->
        <view v-if="allowCreate && !filterKeyword" class="closet-card-add" hover-class="closet-card-add-hover" :hover-stay-time="100" @click="goCreateCloset">
          <view class="add-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </view>
          <view class="add-text">
            <text class="add-title">新建衣橱</text>
            <text class="add-sub">选样式、配色、所属房间</text>
          </view>
        </view>
      </view>

      <u-loadmore :status="loadMoreStatus" v-if="closets.length > 0 && !filterKeyword" />
    </view>

    <!-- FAB 浮动按钮 -->
    <view v-if="allowCreate" class="fab" hover-class="fab-hover" :hover-stay-time="100" @click="goCreateCloset">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </view>

    <!-- H5 TabBar -->
    <h5-tab-bar :current-route="ROUTES.closets" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow, onPullDownRefresh, onReachBottom, onUnload } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import ScopeBadge from "@/components/ScopeBadge.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getFamilyClosetList, getPersonalClosetList, getHomeSummary } from "@/common/api/modules/closet.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getClosetScopeState, setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import {
  getClosetListCache,
  setClosetListCache,
  getHomeSummaryCache,
  setHomeSummaryCache,
  getFamilyInfoCache,
} from "@/common/services/cache-service.js";
import ClosetEmptyState from "./components/ClosetEmptyState.vue";
import ClosetListCard from "./components/ClosetListCard.vue";

const loading = ref(false);
const refreshing = ref(false);
const error = ref(false);
const closets = ref([]);
const scopeType = ref("personal");
const hasFamily = ref(false);
const familyName = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const closetCount = ref(0);
const clothesCount = ref(0);
const unassignedCount = ref(0);
const hasInitialized = ref(false);
const needRefresh = ref(false);
const searchKeyword = ref("");
const filterKeyword = ref("");

// 请求竞态保护
let currentRequestId = 0;
// 搜索防抖定时器
let searchTimer = null;

const loadMoreStatus = computed(() => {
  if (loading.value) return "loading";
  if (closets.value.length >= total.value) return "nomore";
  return "loadmore";
});

const allowCreate = computed(() => scopeType.value === "personal" || hasFamily.value);
const scopeBadgeText = computed(() =>
  scopeType.value === "family" ? "Family · 家庭空间" : "Personal · 个人空间"
);
const pageTitle = computed(() => (scopeType.value === "family" ? "家庭衣橱" : "我的衣橱"));
const pageDesc = computed(() =>
  scopeType.value === "family"
    ? "管理家庭共享的衣橱，方便家庭成员协作管理。"
    : "管理你自己的衣橱与衣物"
);

const summaryData = computed(() => ({
  closetCount: String(closetCount.value),
  clothesCount: String(clothesCount.value),
  unassignedCount: String(unassignedCount.value),
}));

// 前端搜索过滤（使用防抖后的 filterKeyword）
const displayClosets = computed(() => {
  const keyword = filterKeyword.value.trim().toLowerCase();
  if (!keyword) return closets.value;
  return closets.value.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const roomName = (item.room_name || "").toLowerCase();
    return name.includes(keyword) || roomName.includes(keyword);
  });
});

// 搜索状态持久化（按 uid 维度区分）
function getSearchStorageKey() {
  const session = getCurrentSession();
  return `closets_search_${session?.uid || 'anonymous'}`;
}

function saveSearchState() {
  try {
    uni.setStorageSync(getSearchStorageKey(), {
      keyword: searchKeyword.value,
    });
  } catch (e) {
    console.error("saveSearchState failed", e);
  }
}

function restoreSearchState() {
  try {
    const saved = uni.getStorageSync(getSearchStorageKey());
    if (saved) {
      searchKeyword.value = saved.keyword || '';
      filterKeyword.value = searchKeyword.value;
    }
  } catch (e) {
    console.error("restoreSearchState failed", e);
  }
}

async function syncScopeType() {
  const session = getCurrentSession();

  if (!session?.uid) {
    hasFamily.value = false;
    scopeType.value = "personal";
    return;
  }

  const membership = await getFamilyMembership(session.uid);

  // 降级模式：家庭状态查询失败时，从缓存恢复
  if (membership.status !== "success") {
    const cachedFamily = getFamilyInfoCache(session.uid);
    hasFamily.value = cachedFamily?.hasFamily || false;
    familyName.value = cachedFamily?.familyRecord?.name || "未命名家庭";
    if (!hasFamily.value) {
      scopeType.value = "personal";
      setClosetScopeState(session.uid, "personal");
      return;
    }
    scopeType.value = getClosetScopeState(session.uid);
    return;
  }

  hasFamily.value = membership.hasFamily;

  if (hasFamily.value) {
    familyName.value = membership.familyRecord?.name || "未命名家庭";
  } else {
    familyName.value = "";
  }

  if (!hasFamily.value) {
    scopeType.value = "personal";
    setClosetScopeState(session.uid, "personal");
    return;
  }

  scopeType.value = getClosetScopeState(session.uid);
}

function changeScope(nextScopeType) {
  if (nextScopeType === scopeType.value) {
    return;
  }

  if (nextScopeType === "family" && !hasFamily.value) {
    return;
  }

  const session = getCurrentSession();
  scopeType.value = nextScopeType;
  setClosetScopeState(session?.uid, nextScopeType);
  currentPage.value = 1;
  // 切换空间时清除搜索
  searchKeyword.value = "";
  filterKeyword.value = "";
  if (searchTimer) clearTimeout(searchTimer);
  saveSearchState();
  loadClosets();
  loadSummary();
}

async function loadSummary() {
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;

  // 先读缓存
  const cached = uid ? getHomeSummaryCache(uid, scope) : null;
  if (cached) {
    closetCount.value = cached.closetCount || 0;
    clothesCount.value = cached.clothesCount || 0;
    unassignedCount.value = cached.unassignedClothesCount || 0;
  }

  try {
    const summary = await getHomeSummary({ scopeType: scope });
    closetCount.value = summary?.closetCount || 0;
    clothesCount.value = summary?.clothesCount || 0;
    unassignedCount.value = summary?.unassignedClothesCount || 0;
    if (uid && summary) {
      setHomeSummaryCache(uid, scope, summary);
    }
  } catch (error) {
    console.error("loadSummary failed", error);
    if (!cached) {
      closetCount.value = 0;
      clothesCount.value = 0;
      unassignedCount.value = 0;
    }
  }
}

async function loadClosets(append = false) {
  loading.value = true;
  if (!append) error.value = false;

  const requestId = ++currentRequestId;
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;

  // 非追加加载时，先读缓存
  if (!append && uid) {
    const cached = getClosetListCache(uid, scope);
    if (cached && cached.list) {
      closets.value = cached.list;
      total.value = cached.total || 0;
      loading.value = false;
    }
  }

  try {
    const payload = { page: currentPage.value, pageSize: pageSize.value };
    const result = scope === "family"
      ? await getFamilyClosetList(payload)
      : await getPersonalClosetList(payload);

    // 竞态保护：过期请求丢弃
    if (requestId !== currentRequestId) return;

    const list = result?.list || [];
    if (append) {
      closets.value = [...closets.value, ...list];
    } else {
      closets.value = list;
    }
    total.value = result?.total || 0;

    // 写入缓存（仅首页数据，且无搜索条件时）
    if (!append && uid && !searchKeyword.value && currentPage.value === 1) {
      setClosetListCache(uid, scope, { list, total: total.value });
    }
  } catch (err) {
    console.error("loadClosets failed", err);
    // 过期请求的错误也丢弃
    if (requestId !== currentRequestId) return;
    // 仅在无已有数据时才设置 error 并清空
    if (!append && closets.value.length === 0) {
      error.value = true;
      total.value = 0;
    }
    // 已有数据时保留并仅显示 Toast
    uni.showToast({
      title: err?.message || "衣橱列表加载失败",
      icon: "none",
    });
  } finally {
    if (requestId === currentRequestId) {
      loading.value = false;
    }
  }
}

function retryLoad() {
  currentPage.value = 1;
  loadClosets();
  loadSummary();
}

function goCreateCloset() {
  uni.navigateTo({
    url: scopeType.value === "family" ? `${ROUTES.closetCreate}?scopeType=family` : ROUTES.closetCreate,
  });
}

function onSearchInput(e) {
  searchKeyword.value = e.detail.value;
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filterKeyword.value = searchKeyword.value;
    saveSearchState();
  }, 300);
}

function clearSearch() {
  searchKeyword.value = "";
  filterKeyword.value = "";
  if (searchTimer) clearTimeout(searchTimer);
  saveSearchState();
}

// 监听创建/编辑页面返回时的刷新事件
uni.$on("closets:need-refresh", () => {
  needRefresh.value = true;
});

onPullDownRefresh(async () => {
  refreshing.value = true;
  currentPage.value = 1;
  await Promise.all([loadClosets(), loadSummary()]);
  refreshing.value = false;
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (loading.value || closets.value.length >= total.value) return;
  currentPage.value += 1;
  loadClosets(true);
});

onShow(async () => {
  const session = getCurrentSession();
  if (!session.hasLogin) {
    uni.showToast({ title: "请先登录", icon: "none", duration: 1500 });
    setTimeout(() => {
      uni.navigateTo({ url: ROUTES.login });
    }, 500);
    return;
  }

  await syncScopeType();
  if (!hasInitialized.value) {
    // 首次加载：恢复搜索状态并加载列表
    restoreSearchState();
    currentPage.value = 1;
    loadClosets();
    loadSummary();
    hasInitialized.value = true;
  } else {
    // 已初始化：总是刷新 summary，列表只在 needRefresh 时刷新
    loadSummary();
    if (needRefresh.value) {
      needRefresh.value = false;
      currentPage.value = 1;
      loadClosets();
    }
  }
});

onUnload(() => {
  uni.$off("closets:need-refresh");
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  position: relative;
  background: $color-bg-page;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page::-webkit-scrollbar {
  display: none;
}

/* 背景层：随内容滚动，高度自适应内容 */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  z-index: 0;
  background: $gradient-hero;
}

/* Hero 区 */
.hero-zone {
  position: relative;
  z-index: 2;
  padding: 0 28px 24px;
  color: $color-text-inverse;
}

.scope-title {
  display: block;
  font-family: $font-serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.8px;
  color: $color-text-inverse;
  margin-bottom: 10px;
}

.scope-desc {
  display: block;
  font-family: $font-sans;
  font-size: 13px;
  line-height: 1.7;
  color: $inverse-50;
  max-width: 280px;
  margin-bottom: 16px;
}

/* 统计区 */
.hero-stats {
  display: flex;
  gap: 24px;
  align-items: center;
}

.hero-stats .stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stats .stat-value {
  font-family: $font-serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 1;
  color: $inverse-85;
  letter-spacing: -0.5px;
}

.hero-stats .stat-value.accent {
  color: $color-terra-soft;
}

.hero-stats .stat-label {
  font-family: $font-sans;
  font-size: 11px;
  font-weight: 600;
  color: $inverse-55;
}

.stat-divider {
  width: 1px;
  align-self: stretch;
  background: $inverse-25;
}

/* 筛选条 */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 10px;
  padding: 16px 28px;
  background: rgba(244, 239, 230, 0.92);
  backdrop-filter: blur(12px);
}

.filter-chip {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: transparent;
  border: 1px solid $color-border;
  transition: all 0.2s ease;
}

.filter-chip-active {
  background: $color-primary;
  border-color: $color-primary;
}

.filter-chip-hover {
  opacity: 0.85;
}

.filter-chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 500;
  color: $color-text-secondary;
}

.filter-chip-active .filter-chip-text {
  color: $color-text-inverse;
}

/* 搜索框 */
.search-bar {
  position: relative;
  z-index: 2;
  padding: 0 28px 16px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  border-radius: $radius-btn;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  color: $color-text-placeholder;
  flex-shrink: 0;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 80rpx;
  font-family: $font-sans;
  font-size: 26rpx;
  color: $color-text-title;
  background: transparent;
}

.search-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

.search-clear {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 12rpx;
}

.search-clear svg {
  width: 28rpx;
  height: 28rpx;
  stroke: $color-text-placeholder;
  fill: none;
}

.search-clear-hover {
  opacity: 0.7;
}

/* 搜索无结果 */
.search-empty {
  padding: 60rpx 32rpx;
  text-align: center;
}

.search-empty-text {
  font-family: $font-sans;
  font-size: 26rpx;
  color: $color-text-placeholder;
}

.search-clear-btn {
  display: inline-block;
  margin-top: 24rpx;
  padding: 14rpx 40rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 500;
  color: $color-terra;
  border: 1px solid rgba(184, 92, 58, 0.3);
  border-radius: $radius-btn;
  background: rgba(184, 92, 58, 0.04);
}

/* 衣橱列表 */
.closet-list {
  position: relative;
  z-index: 2;
  padding: 8px 28px 120px;
}

.list-inner {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 新建衣橱卡片 */
.closet-card-add {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 44rpx 48rpx;
  border-radius: $radius-card;
  background: transparent;
  border: 1.5px dashed $color-border;
  transition: all 0.2s ease;
}

.closet-card-add:hover,
.closet-card-add:active {
  background: $color-bg-chip;
  border-color: $color-sage;
}

.closet-card-add-hover {
  background: $color-bg-chip;
  border-color: $color-sage;
}

.add-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: $color-bg-chip;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.closet-card-add:hover .add-icon,
.closet-card-add:active .add-icon {
  background: $color-primary;
}

.add-icon svg {
  width: 40rpx;
  height: 40rpx;
  stroke: $color-text-secondary;
  stroke-width: 1.5;
  fill: none;
  transition: stroke 0.2s ease;
}

.closet-card-add:hover .add-icon svg,
.closet-card-add:active .add-icon svg {
  stroke: $color-text-inverse;
}

.add-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.add-title {
  font-family: $font-serif;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-primary-dark;
  display: block;
}

.add-sub {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
  display: block;
}

/* FAB 浮动按钮 */
.fab {
  position: fixed;
  bottom: 220rpx;
  right: 48rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: $color-terra;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(184, 92, 58, 0.35);
  z-index: 40;
  transition: all 0.2s ease;
}

.fab:hover,
.fab:active {
  background: $color-terra-soft;
  transform: translateY(-4rpx);
}

.fab-hover {
  background: $color-terra-soft;
  transform: translateY(-4rpx);
}

.fab svg {
  width: 44rpx;
  height: 44rpx;
  stroke: $color-text-inverse;
  stroke-width: 1.5;
  fill: none;
}

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(58, 84, 67, 0.06) 0%,
    rgba(58, 84, 67, 0.12) 50%,
    rgba(58, 84, 67, 0.06) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.skeleton-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 24rpx;
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
}

.skeleton-thumb {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.skeleton-name {
  height: 28rpx;
  width: 50%;
  border-radius: 4rpx;
}

.skeleton-meta {
  height: 20rpx;
  width: 35%;
  border-radius: 4rpx;
}

.skeleton-tag {
  height: 24rpx;
  width: 80rpx;
  border-radius: $radius-sm;
  margin-top: 4rpx;
}

.skeleton-count-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
  flex-shrink: 0;
}

.skeleton-count {
  height: 36rpx;
  width: 48rpx;
  border-radius: 4rpx;
}

.skeleton-count-unit {
  height: 16rpx;
  width: 56rpx;
  border-radius: 4rpx;
}

/* ===== 错误态卡片 ===== */
.error-card {
  padding: 36rpx 40rpx;
  border-radius: $radius-card;
  background: rgba(184, 92, 58, 0.06);
  border: 1px solid rgba(184, 92, 58, 0.18);
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
}

.err-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
  stroke: $color-terra;
  margin-top: 2rpx;
}

.err-content {
  flex: 1;
  min-width: 0;
}

.err-title {
  font-family: $font-serif;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 6rpx;
  display: block;
}

.err-desc {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
}

.err-retry {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-terra;
  padding: 8rpx 0;
  display: inline-block;
}
</style>
