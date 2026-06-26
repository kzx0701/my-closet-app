<template>
  <view class="page">
    <!-- 背景层 -->
    <view class="page-bg noise-texture"></view>

    <!-- Hero 区（绿色背景上） -->
    <view class="hero-zone fade-up-delay-1">
      <ScopeBadge :text="scopeBadgeText" />
      <text class="scope-title">{{ pageTitle }}</text>
      <text class="scope-desc">{{ pageDesc }}</text>
      <view class="hero-meta">
        <text class="meta-key">Total</text>
        <text class="meta-val">{{ totalCount }}</text>
        <text class="meta-sep">·</text>
        <text class="meta-key">Unassigned</text>
        <text class="meta-val">{{ unassignedCount }}</text>
      </view>
    </view>

    <!-- 空间切换 -->
    <view class="scope-bar fade-up-delay-2">
      <view
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'personal' }"
        hover-class="scope-chip-hover"
        :hover-stay-time="100"
        @click="changeScope('personal')"
      >
        <text class="scope-chip-text">个人空间</text>
      </view>
      <view
        v-if="hasFamily"
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'family' }"
        hover-class="scope-chip-hover"
        :hover-stay-time="100"
        @click="changeScope('family')"
      >
        <text class="scope-chip-text">家庭空间 · {{ familyName }}</text>
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
          placeholder="搜索衣物名称…"
          placeholder-class="search-placeholder"
          @input="onSearchInput"
        />
        <view v-if="searchKeyword" class="search-clear" hover-class="search-clear-hover" :hover-stay-time="100" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </view>
      </view>
    </view>

    <!-- 筛选条（sticky） -->
    <view class="fade-up-delay-2">
      <ClothesFilterBar
        :active-category="activeCategory"
        :active-season="activeSeason"
        @update:activeCategory="onCategoryChange"
        @update:activeSeason="onSeasonChange"
      />
    </view>

    <!-- 区块标签 -->
    <view class="section-label fade-up-delay-3">
      <view class="section-label-left">
        <text class="section-count">{{ displayClothes.length }}</text>
        <text class="section-count-unit">件</text>
        <text class="section-sep">·</text>
        <text class="section-view">当前视图</text>
      </view>
      <view class="section-sort" hover-class="section-sort-hover" :hover-stay-time="100" @click="toggleSortMode">
        <text class="section-sort-text">{{ sortLabel }}</text>
        <svg class="section-sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </view>
    </view>

    <!-- 衣物网格 -->
    <view class="clothes-grid fade-up-delay-4">
      <!-- 加载骨架屏 -->
      <view v-if="loading && clothes.length === 0" class="skeleton-grid">
        <view v-for="n in 6" :key="n" class="skeleton-card">
          <view class="skeleton skeleton-img"></view>
          <view class="skeleton-info">
            <view class="skeleton skeleton-name"></view>
            <view class="skeleton skeleton-sub"></view>
          </view>
        </view>
      </view>

      <!-- 错误态 -->
      <view v-else-if="error" class="error-card">
        <svg class="err-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <view class="err-content">
          <text class="err-title">加载失败</text>
          <text class="err-desc">衣物列表加载失败，请检查网络后重试。</text>
          <text class="err-retry" @click="retryLoad">重新加载</text>
        </view>
      </view>

      <!-- 空状态 -->
      <ClothesEmptyState
        v-else-if="clothes.length === 0"
        :scope-type="scopeType"
        @create="goCreateClothes"
      />

      <!-- 搜索无结果 -->
      <view v-else-if="displayClothes.length === 0" class="search-empty">
        <text class="search-empty-text">未找到匹配「{{ searchKeyword }}」的衣物</text>
        <text class="search-clear-btn" @click="clearSearch">清除搜索</text>
      </view>

      <!-- 列表内容 -->
      <view v-else class="grid-inner">
        <view
          v-for="item in displayClothes"
          :key="item._id"
          class="grid-item"
        >
          <ClothesListCard :clothes="item" />
        </view>
      </view>

      <u-loadmore :status="loadMoreStatus" v-if="clothes.length > 0" />
    </view>

    <!-- FAB 浮动按钮 -->
    <view class="fab" hover-class="fab-hover" :hover-stay-time="100" @click="goCreateClothes">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </view>

    <!-- H5 TabBar -->
    <h5-tab-bar :current-route="ROUTES.clothes" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onUnload } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import ScopeBadge from "@/components/ScopeBadge.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getPersonalClothesList, getFamilyClothesList } from "@/common/api/modules/clothes.js";
import { getHomeSummary } from "@/common/api/modules/closet.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getClosetScopeState, setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import {
  getClothesListCache,
  setClothesListCache,
  getHomeSummaryCache,
  setHomeSummaryCache,
  getFamilyInfoCache,
} from "@/common/services/cache-service.js";
import ClothesFilterBar from "./components/ClothesFilterBar.vue";
import ClothesListCard from "./components/ClothesListCard.vue";
import ClothesEmptyState from "./components/ClothesEmptyState.vue";

const loading = ref(false);
const error = ref(false);
const clothes = ref([]);
const activeCategory = ref("all");
const activeSeason = ref("all");
const searchKeyword = ref("");
const scopeType = ref("personal");
const hasFamily = ref(false);
const familyName = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const totalCount = ref(0);
const unassignedCount = ref(0);
const hasInitialized = ref(false);
const needRefresh = ref(false);
const filterKeyword = ref("");
const sortMode = ref("time");

// 请求竞态保护
let currentRequestId = 0;
// 搜索防抖定时器
let searchTimer = null;

const loadMoreStatus = computed(() => {
  if (loading.value) return "loading";
  if (clothes.value.length >= total.value) return "nomore";
  return "loadmore";
});

const scopeBadgeText = computed(() =>
  scopeType.value === "family" ? "Family · 家庭衣物" : "Personal · 个人衣物"
);

const pageTitle = computed(() =>
  scopeType.value === "family" ? "家庭衣物" : "我的衣物"
);

const pageDesc = computed(() =>
  scopeType.value === "family"
    ? "管理家庭共享的衣物，按类别和季节快速查找。"
    : "管理你自己的衣物，按类别和季节快速查找。"
);

// 排序模式标签
const sortLabel = computed(() => {
  if (sortMode.value === "name") return "按名称";
  if (sortMode.value === "category") return "按分类";
  return "按添加时间";
});

// 前端搜索过滤（使用防抖后的 filterKeyword）+ 排序
const displayClothes = computed(() => {
  const keyword = filterKeyword.value.trim().toLowerCase();
  let result = keyword
    ? clothes.value.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const remark = (item.remark || "").toLowerCase();
        return name.includes(keyword) || remark.includes(keyword);
      })
    : [...clothes.value];

  // 在过滤之后排序
  if (sortMode.value === "name") {
    result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortMode.value === "category") {
    result.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
  } else {
    // time: 按创建时间倒序（默认）
    result.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  }

  return result;
});

// 筛选状态持久化（按 uid 维度区分）
function getFilterStorageKey() {
  const session = getCurrentSession();
  return `clothes_filter_${session?.uid || 'anonymous'}`;
}

function saveFilterState() {
  try {
    uni.setStorageSync(getFilterStorageKey(), {
      category: activeCategory.value,
      season: activeSeason.value,
      keyword: searchKeyword.value,
      sortMode: sortMode.value,
    });
  } catch (e) {
    console.error("saveFilterState failed", e);
  }
}

function restoreFilterState() {
  try {
    const saved = uni.getStorageSync(getFilterStorageKey());
    if (saved) {
      activeCategory.value = saved.category || 'all';
      activeSeason.value = saved.season || 'all';
      searchKeyword.value = saved.keyword || '';
      filterKeyword.value = searchKeyword.value;
      const savedSort = saved.sortMode;
      sortMode.value = savedSort === "name" || savedSort === "category" ? savedSort : "time";
    }
  } catch (e) {
    console.error("restoreFilterState failed", e);
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
  if (nextScopeType === scopeType.value) return;
  if (nextScopeType === "family" && !hasFamily.value) return;

  const session = getCurrentSession();
  scopeType.value = nextScopeType;
  setClosetScopeState(session?.uid, nextScopeType);
  currentPage.value = 1;
  searchKeyword.value = "";
  filterKeyword.value = "";
  if (searchTimer) clearTimeout(searchTimer);
  saveFilterState();
  loadClothes();
  loadSummary();
}

async function loadSummary() {
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;

  // 先读缓存
  const cached = uid ? getHomeSummaryCache(uid, scope) : null;
  if (cached) {
    totalCount.value = cached.clothesCount || 0;
    unassignedCount.value = cached.unassignedClothesCount || 0;
  }

  try {
    const summary = await getHomeSummary({ scopeType: scope });
    totalCount.value = summary?.clothesCount || 0;
    unassignedCount.value = summary?.unassignedClothesCount || 0;
    if (uid && summary) {
      setHomeSummaryCache(uid, scope, summary);
    }
  } catch (error) {
    console.error("loadSummary failed", error);
    if (!cached) {
      totalCount.value = 0;
      unassignedCount.value = 0;
    }
  }
}

async function loadClothes(append = false) {
  loading.value = true;
  if (!append) error.value = false;

  const requestId = ++currentRequestId;
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;

  // 非追加加载时，先读缓存
  if (!append && uid) {
    const cached = getClothesListCache(uid, scope);
    if (cached && cached.list) {
      clothes.value = cached.list;
      total.value = cached.total || 0;
      loading.value = false;
    }
  }

  try {
    const payload = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    if (activeCategory.value !== "all") {
      payload.category = activeCategory.value;
    }

    if (activeSeason.value !== "all") {
      payload.season = activeSeason.value;
    }

    const result = scope === "family"
      ? await getFamilyClothesList(payload)
      : await getPersonalClothesList(payload);

    // 竞态保护：过期请求丢弃
    if (requestId !== currentRequestId) return;

    const list = result?.list || [];
    if (append) {
      clothes.value = [...clothes.value, ...list];
    } else {
      clothes.value = list;
    }
    total.value = result?.total || 0;

    // 写入缓存（仅首页数据，且无筛选条件时）
    if (!append && uid && activeCategory.value === "all" && activeSeason.value === "all" && currentPage.value === 1) {
      setClothesListCache(uid, scope, { list, total: total.value });
    }
  } catch (err) {
    console.error("loadClothes failed", err);
    // 过期请求的错误也丢弃
    if (requestId !== currentRequestId) return;
    // 仅在无已有数据时才设置 error 并清空
    if (!append && clothes.value.length === 0) {
      error.value = true;
      total.value = 0;
    }
    // 已有数据时保留并仅显示 Toast
    uni.showToast({
      title: err?.message || "衣物列表加载失败",
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
  loadClothes();
  loadSummary();
}

function onCategoryChange(code) {
  activeCategory.value = code;
  currentPage.value = 1;
  saveFilterState();
  loadClothes();
}

function onSeasonChange(code) {
  activeSeason.value = code;
  currentPage.value = 1;
  saveFilterState();
  loadClothes();
}

function onSearchInput(e) {
  searchKeyword.value = e.detail.value;
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filterKeyword.value = searchKeyword.value;
    saveFilterState();
  }, 300);
}

function clearSearch() {
  searchKeyword.value = "";
  filterKeyword.value = "";
  if (searchTimer) clearTimeout(searchTimer);
  saveFilterState();
}

function toggleSortMode() {
  const modes = ["time", "name", "category"];
  const currentIndex = modes.indexOf(sortMode.value);
  sortMode.value = modes[(currentIndex + 1) % modes.length];
  saveFilterState();
}

function goCreateClothes() {
  uni.navigateTo({
    url: scopeType.value === "family"
      ? `${ROUTES.clothesCreate}?scopeType=family`
      : ROUTES.clothesCreate,
  });
}

// 监听创建/编辑页面返回时的刷新事件
uni.$on("clothes:need-refresh", () => {
  needRefresh.value = true;
});

onPullDownRefresh(async () => {
  currentPage.value = 1;
  await Promise.all([loadClothes(), loadSummary()]);
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (loading.value || clothes.value.length >= total.value) return;
  currentPage.value += 1;
  loadClothes(true);
});

onLoad(() => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif
});

onShow(async () => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif

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
    // 首次加载：恢复筛选状态并加载列表
    restoreFilterState();
    currentPage.value = 1;
    loadClothes();
    loadSummary();
    hasInitialized.value = true;
  } else {
    // 已初始化：总是刷新 summary，列表只在 needRefresh 时刷新
    loadSummary();
    if (needRefresh.value) {
      needRefresh.value = false;
      currentPage.value = 1;
      loadClothes();
    }
  }
});

onUnload(() => {
  uni.$off("clothes:need-refresh");
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

/* 背景层 */
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

/* 元信息行 */
.hero-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.meta-key {
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $inverse-55;
}

.meta-val {
  font-family: $font-serif;
  font-size: 18px;
  font-weight: 400;
  color: $inverse-85;
  letter-spacing: -0.3px;
}

.meta-sep {
  font-size: 13px;
  color: $inverse-25;
  margin: 0 2px;
}

/* 空间切换 */
.scope-bar {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  padding: 0 28px 16px;
}

.scope-chip {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: transparent;
  border: 1px solid $color-border;
  transition: all 0.2s ease;
}

.scope-chip-active {
  background: $color-primary;
  border-color: $color-primary;
}

.scope-chip-hover {
  opacity: 0.85;
}

.scope-chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 500;
  color: $color-text-secondary;
}

.scope-chip-active .scope-chip-text {
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

/* 区块标签 */
.section-label {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 20px 28px 12px;
}

.section-label-left {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.section-count {
  font-family: $font-serif;
  font-size: 20px;
  font-weight: 400;
  color: $color-terra;
  letter-spacing: -0.3px;
}

.section-count-unit {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-secondary;
}

.section-sep {
  font-size: 12px;
  color: $color-text-placeholder;
  margin: 0 4px;
}

.section-view {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-secondary;
}

.section-sort {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 14rpx;
  border-radius: $radius-sm;
  transition: all 0.2s ease;
}

.section-sort-hover {
  background: rgba(58, 84, 67, 0.06);
  opacity: 0.85;
}

.section-sort-text {
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: $color-text-placeholder;
}

.section-sort-icon {
  width: 24rpx;
  height: 24rpx;
  stroke: $color-text-placeholder;
  fill: none;
  flex-shrink: 0;
}

/* 衣物网格 */
.clothes-grid {
  position: relative;
  z-index: 2;
  padding: 0 28px 120px;
}

.grid-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.grid-item {
  min-width: 0;
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

.skeleton-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.skeleton-card {
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0;
}

.skeleton-info {
  padding: 20rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.skeleton-name {
  height: 26rpx;
  width: 60%;
  border-radius: 4rpx;
}

.skeleton-sub {
  height: 20rpx;
  width: 40%;
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
