<template>
  <view class="page">
    <!-- 背景层 -->
    <view class="page-bg noise-texture"></view>

    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-back" @click="goBack">
        <view class="nav-back-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </view>
      </view>
      <text class="nav-title">衣橱详情</text>
      <view v-if="!loading && !error" class="nav-action" @click="handleEdit">
        <text class="nav-action-text">编辑</text>
      </view>
      <view v-else class="nav-placeholder"></view>
    </view>

    <!-- Hero 区 -->
    <view class="hero-zone fade-up-delay-1">
      <ScopeBadge :text="scopeBadgeText" />
      <text class="hero-title">{{ closet.name || "未命名衣橱" }}</text>
      <text class="hero-desc">{{ heroDesc }}</text>
      <view class="hero-stats">
        <view class="stat-item">
          <text class="stat-value accent">{{ clothes.length }}</text>
          <text class="stat-label">件衣物</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ styleName }}</text>
          <text class="stat-label">样式</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ colorName }}</text>
          <text class="stat-label">配色</text>
        </view>
      </view>
    </view>

    <!-- 区块标签 -->
    <view v-if="!loading && !error" class="section-label fade-up-delay-2">
      <view class="section-label-left">
        <text class="section-count">{{ clothes.length }}</text>
        <text class="section-count-unit">件</text>
        <text class="section-sep">·</text>
        <text class="section-view">本衣橱衣物</text>
      </view>
      <text class="section-sort">按添加时间</text>
    </view>

    <!-- 衣物网格 -->
    <view class="clothes-grid fade-up-delay-2">
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
          <text class="err-desc">衣橱详情加载失败，请检查网络后重试。</text>
          <text class="err-retry" @click="retryLoad">重新加载</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="clothes.length === 0" class="empty-card">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
        <text class="empty-title">衣橱里还没有衣物</text>
        <text class="empty-desc">把衣物归类到本衣橱，方便日后整理查找。</text>
        <button class="empty-btn" @click="goAddClothes">添加第一件衣物</button>
      </view>

      <!-- 列表内容 -->
      <view v-else class="grid-inner">
        <view
          v-for="item in clothes"
          :key="item._id"
          class="grid-item"
        >
          <ClothesListCard :clothes="item" />
          <view v-if="wearCountMap[item._id] > 0" class="wear-count">
            <text class="wear-count-text">已穿{{ wearCountMap[item._id] }}次</text>
          </view>
        </view>
      </view>

      <u-loadmore :status="loadMoreStatus" v-if="clothes.length > 0" />
    </view>

    <!-- 底部固定栏 -->
    <view v-if="!loading && !error" class="bottom-bar fade-up-delay-3">
      <button class="btn-add" @click="goAddClothes">
        添加衣物到本衣橱
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow, onReachBottom } from "@dcloudio/uni-app";
import ScopeBadge from "@/components/ScopeBadge.vue";
import ClothesListCard from "@/pages/clothes/components/ClothesListCard.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getClosetDetail } from "@/common/api/modules/closet.js";
import { getPersonalClothesList, getFamilyClothesList } from "@/common/api/modules/clothes.js";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { safeNavigateTo, safeNavigateBack } from "@/common/utils/nav-helper.js";
import { getClothesWearCountMap } from "@/common/services/clothes-wear-record.js";
import { getCurrentSession } from "@/common/services/auth.js";

const closet = ref({});
const clothes = ref([]);
const statusBarHeight = ref(20);
const loading = ref(false);
const error = ref(false);
const currentClosetId = ref("");
const scopeType = ref("personal");
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const hasInitialized = ref(false);
const wearCountMap = ref({});

const closetId = computed(() => closet.value._id || currentClosetId.value || "");

const scopeBadgeText = computed(() =>
  scopeType.value === "family" ? "Family · 家庭空间" : "Personal · 个人空间"
);

const styleName = computed(() => {
  return CLOSET_STYLE_OPTIONS.find((item) => item.code === closet.value.style_code)?.name || "—";
});

const colorName = computed(() => {
  return CLOSET_COLOR_OPTIONS.find((item) => item.code === closet.value.color_code)?.name || "—";
});

const heroDesc = computed(() => {
  const parts = [styleName.value, colorName.value];
  if (closet.value.room_name) {
    parts.push(closet.value.room_name);
  }
  return parts.join(" · ");
});

const loadMoreStatus = computed(() => {
  if (loading.value) return "loading";
  if (clothes.value.length >= total.value) return "nomore";
  return "loadmore";
});

async function loadClosetDetail(targetClosetId) {
  const result = await getClosetDetail({ closetId: targetClosetId });
  const closetData = result?.closet;
  if (!closetData) {
    throw new Error("衣橱详情不存在");
  }
  closet.value = closetData;
  scopeType.value = closetData.scope_type === "family" ? "family" : "personal";
}

async function loadClothes(append = false) {
  if (!currentClosetId.value) return;

  try {
    const payload = {
      closetId: currentClosetId.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    const result =
      scopeType.value === "family"
        ? await getFamilyClothesList(payload)
        : await getPersonalClothesList(payload);

    if (append) {
      clothes.value = [...clothes.value, ...(result?.list || [])];
    } else {
      clothes.value = result?.list || [];
    }
    total.value = result?.total || 0;
  } catch (err) {
    console.error("loadClothes failed", err);
    if (!append) {
      clothes.value = [];
    }
    total.value = 0;
    uni.showToast({
      title: err?.message || "衣物列表加载失败",
      icon: "none",
    });
  }

  // 刷新穿着次数映射（基于本地存储）
  refreshWearCountMap();
}

// 从本地存储读取当前衣橱内所有衣物的穿着次数
function refreshWearCountMap() {
  const session = getCurrentSession();
  const uid = session?.uid || "guest";
  const ids = clothes.value.map((item) => item._id).filter(Boolean);
  wearCountMap.value = getClothesWearCountMap(uid, ids);
}

async function loadDetailData(targetId) {
  loading.value = true;
  error.value = false;
  try {
    await loadClosetDetail(targetId);
    currentPage.value = 1;
    await loadClothes();
  } catch (err) {
    console.error("loadDetailData failed", err);
    error.value = true;
    uni.showToast({
      title: err?.message || "衣橱详情加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

function retryLoad() {
  if (currentClosetId.value) {
    loadDetailData(currentClosetId.value);
  }
}

function handleEdit() {
  if (!closetId.value) return;
  safeNavigateTo(`${ROUTES.closetCreate}?closetId=${closetId.value}`);
}

function goAddClothes() {
  if (!closetId.value) return;
  safeNavigateTo(`${ROUTES.clothesCreate}?closetId=${closetId.value}&scopeType=${scopeType.value}`);
}

function goBack() {
  safeNavigateBack(ROUTES.closets);
}

onReachBottom(() => {
  if (loading.value || clothes.value.length >= total.value) return;
  currentPage.value += 1;
  loadClothes(true);
});

onLoad(async (options) => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  const targetClosetId = String(options?.closetId || "").trim();
  scopeType.value = options?.scopeType === "family" ? "family" : "personal";

  if (!targetClosetId) {
    uni.showToast({ title: "衣橱不存在", icon: "none" });
    setTimeout(() => uni.navigateBack(), 500);
    return;
  }

  currentClosetId.value = targetClosetId;
  await loadDetailData(targetClosetId);
  hasInitialized.value = true;
});

onShow(() => {
  if (currentClosetId.value && hasInitialized.value) {
    loadDetailData(currentClosetId.value);
  }
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  position: relative;
  background: $color-bg-page;
  padding-bottom: 200rpx;
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
  height: 600rpx;
  z-index: 0;
  background: $gradient-hero;
}

/* 自定义导航栏 */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 28rpx;
  padding-right: 28rpx;
  padding-bottom: 16rpx;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-back:active {
  opacity: 0.7;
}

.nav-back-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-inverse;
  backdrop-filter: blur(8px);
}

.nav-back-icon svg {
  width: 32rpx;
  height: 32rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
}

.nav-action {
  padding: 12rpx 24rpx;
  border-radius: $radius-btn;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.nav-action:active {
  opacity: 0.7;
}

.nav-action-text {
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-inverse;
}

.nav-placeholder {
  width: 64rpx;
}

/* Hero 区 */
.hero-zone {
  position: relative;
  z-index: 2;
  padding: 0 28px 24px;
  color: $color-text-inverse;
}

.hero-title {
  display: block;
  font-family: $font-serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.8px;
  color: $color-text-inverse;
  margin-bottom: 10px;
}

.hero-desc {
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
  font-size: 22px;
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
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: $color-text-placeholder;
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

/* 穿着次数 */
.wear-count {
  margin-top: 10rpx;
  text-align: right;
  padding-right: 8rpx;
}

.wear-count-text {
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 0.5px;
  color: $color-text-placeholder;
}

/* 底部固定栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  padding: 32rpx 56rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: $gradient-bottom-bar;
}

.btn-add {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: $radius-btn;
  background: $color-primary;
  border: none;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  transition: all 0.2s ease;
}

.btn-add:hover {
  opacity: 0.9;
}

.btn-add:active {
  transform: scale(0.98);
}

.btn-add::after {
  border: none;
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

/* ===== 空状态 ===== */
.empty-card {
  padding: 44rpx 32rpx;
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px dashed $color-border;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 72rpx;
  height: 72rpx;
  stroke: $color-text-placeholder;
  opacity: 0.5;
  margin-bottom: 20rpx;
}

.empty-title {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-secondary;
  margin-bottom: 8rpx;
  display: block;
}

.empty-desc {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
  line-height: 1.5;
  display: block;
}

.empty-btn {
  margin-top: 32rpx;
  padding: 20rpx 56rpx;
  border-radius: $radius-btn;
  background: $color-primary;
  border: none;
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-inverse;
  transition: all 0.2s ease;
}

.empty-btn::after {
  border: none;
}

.empty-btn:active {
  transform: scale(0.98);
}
</style>
