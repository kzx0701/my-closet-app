<template>
  <view class="page">
    <!-- 渐变背景层 -->
    <view class="page-bg"></view>

    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-back" hover-class="nav-btn-hover" :hover-stay-time="100" @click="goBack">
        <view class="nav-btn-round">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </view>
      </view>
      <text class="nav-title">衣橱详情</text>
      <view v-if="!loading && !error" class="nav-more" hover-class="nav-btn-hover" :hover-stay-time="100" @click="handleEdit">
        <view class="nav-btn-round">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </view>
      </view>
      <view v-else class="nav-placeholder"></view>
    </view>

    <!-- Hero 区 -->
    <view class="hero" :style="{ paddingTop: '12px' }">
      <!-- 装饰曲线 SVG -->
      <svg class="hero-deco" viewBox="0 0 375 200" preserveAspectRatio="none">
        <path d="M 0 40 Q 187 15 375 40" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
        <path d="M 0 100 Q 187 75 375 100" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
        <path d="M 0 160 Q 187 135 375 160" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
      </svg>

      <!-- 顶部标记 -->
      <view class="hero-top fade-up-delay-1">
        <ScopeBadge :text="scopeBadgeText" />
      </view>

      <!-- 衣橱名称 -->
      <view class="hero-body fade-up-delay-2">
        <text class="hero-name">{{ closet.name || "未命名衣橱" }}</text>
      </view>

      <!-- 标签行：样式 · 配色 · 房间 -->
      <view class="hero-tags fade-up-delay-3">
        <view class="hero-tag" :style="tagPillStyle">
          <text class="hero-tag-text">{{ styleName }}</text>
        </view>
        <view class="hero-dot"></view>
        <view class="hero-tag" :style="tagPillStyle">
          <text class="hero-tag-text">{{ colorName }}</text>
        </view>
        <template v-if="closet.room_name">
          <view class="hero-dot"></view>
          <view class="hero-tag" :style="tagPillStyle">
            <text class="hero-tag-text">{{ closet.room_name }}</text>
          </view>
        </template>
      </view>

      <!-- 衣物计数 -->
      <view class="hero-count fade-up-delay-4">
        <text class="hero-count-num">{{ clothes.length }}</text>
        <text class="hero-count-unit">件衣物</text>
      </view>
    </view>

    <!-- 内容卡片区 -->
    <view class="content-area fade-up-delay-3">
      <!-- 骨架屏 -->
      <view v-if="loading && clothes.length === 0" class="grid-wrap">
        <view v-for="n in 6" :key="n" class="grid-card skeleton-card-wrap">
          <view class="skeleton skeleton-img"></view>
          <view class="skeleton-info">
            <view class="skeleton skeleton-name"></view>
            <view class="skeleton skeleton-sub"></view>
          </view>
        </view>
      </view>

      <!-- 错误态 -->
      <view v-else-if="error" class="error-card">
        <view class="error-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </view>
        <view class="error-body">
          <text class="error-title">加载失败</text>
          <text class="error-desc">衣橱详情加载失败，请检查网络后重试。</text>
          <view class="error-retry" hover-class="error-retry-hover" :hover-stay-time="100" @click="retryLoad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <text class="error-retry-text">重新加载</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="clothes.length === 0" class="empty-state">
        <view class="empty-illustration">
          <svg viewBox="0 0 80 80" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <!-- 衣架 -->
            <path d="M40 10 C40 10 28 10 28 18 C28 22 34 24 40 24 C46 24 52 22 52 18 C52 10 40 10 40 10Z" stroke="#c8cebf" stroke-width="1.5" fill="none"/>
            <line x1="40" y1="10" x2="40" y2="4" stroke="#c8cebf" stroke-width="1.5"/>
            <circle cx="40" cy="3" r="2" stroke="#c8cebf" stroke-width="1.5" fill="none"/>
            <!-- 挂钩 -->
            <line x1="40" y1="24" x2="40" y2="56" stroke="#c8cebf" stroke-width="1.5"/>
            <line x1="28" y1="56" x2="52" y2="56" stroke="#c8cebf" stroke-width="1.5"/>
            <!-- 短横线装饰 -->
            <line x1="32" y1="24" x2="32" y2="40" stroke="#dce0d4" stroke-width="1" stroke-dasharray="3 3"/>
            <line x1="48" y1="24" x2="48" y2="40" stroke="#dce0d4" stroke-width="1" stroke-dasharray="3 3"/>
          </svg>
        </view>
        <text class="empty-title">暂无衣物</text>
        <text class="empty-desc">这个衣橱还空空如也，快添加第一件衣物吧。</text>
        <button class="empty-btn" hover-class="empty-btn-hover" :hover-stay-time="100" @click="goAddClothes">
          添加衣物
        </button>
      </view>

      <!-- 衣物网格 -->
      <view v-else class="grid-wrap">
        <view
          v-for="item in clothes"
          :key="item._id"
          class="grid-card"
          hover-class="grid-card-hover"
          :hover-stay-time="100"
          @click="goClothesDetail(item)"
        >
          <!-- 图片区 -->
          <view class="card-img-wrap">
            <image
              v-if="item.image_url"
              class="card-img"
              :src="item.image_url"
              mode="aspectFill"
              lazy-load
            />
            <view v-else class="card-img-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
              </svg>
            </view>
          </view>
          <!-- 信息区 -->
          <view class="card-info">
            <text class="card-name">{{ item.name }}</text>
            <view class="card-meta">
              <view class="card-color-dot" :style="{ background: itemColorHex(item) }"></view>
              <text class="card-style">{{ itemStyleName(item) }}</text>
            </view>
          </view>
        </view>

        <u-loadmore :status="loadMoreStatus" v-if="clothes.length > 0" />
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="!loading && !error && clothes.length >= 0" class="bottom-bar">
      <view class="bottom-mask"></view>
      <view class="bottom-inner">
        <button class="btn-add" hover-class="btn-add-hover" :hover-stay-time="100" @click="goAddClothes">
          <svg class="btn-add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          添加衣物
        </button>
      </view>
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
import { CLOTHES_COLOR_OPTIONS, CLOTHES_CATEGORY_OPTIONS } from "@/common/constants/clothes-options.js";
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

const tagPillStyle = computed(() => {
  const colorOption = CLOSET_COLOR_OPTIONS.find((item) => item.code === closet.value.color_code);
  const bg = colorOption?.color || "#a8bcae";
  return {
    background: bg + "22",
    borderColor: bg + "44",
  };
});

function itemColorHex(item) {
  const code = item.color;
  if (!code) return "#ccc";
  const opt = CLOTHES_COLOR_OPTIONS.find((o) => o.code === code);
  return opt?.hex || "#ccc";
}

function itemStyleName(item) {
  return CLOTHES_CATEGORY_OPTIONS.find((o) => o.code === item.category)?.name || "未分类";
}

function goClothesDetail(item) {
  const targetId = item?._id;
  if (!targetId) return;
  safeNavigateTo(`${ROUTES.clothesDetail}?clothesId=${targetId}`);
}

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

  refreshWearCountMap();
}

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

/* ===== 渐变背景 ===== */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(180deg,
    $color-primary-dark 0%,
    $color-primary 12%,
    $color-primary-soft 20%,
    $color-sage 28%,
    $color-sage-light 34%,
    #c8cebf 38%,
    $color-bg-page 42%,
    $color-bg-page 100%
  );
}

/* ===== 导航栏 ===== */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 28rpx;
  padding-right: 28rpx;
  padding-bottom: 12rpx;
}

.nav-back,
.nav-more {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn-round {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.nav-btn-round svg {
  width: 32rpx;
  height: 32rpx;
  color: $color-text-inverse;
}

.nav-btn-hover .nav-btn-round {
  background: rgba(255, 255, 255, 0.18);
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-serif;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  letter-spacing: 0.5px;
}

.nav-placeholder {
  width: 68rpx;
}

/* ===== Hero 区 ===== */
.hero {
  position: relative;
  z-index: 2;
  padding: 0 28px 36px;
  color: $color-text-inverse;
  overflow: hidden;
}

.hero-deco {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.hero-top {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.hero-body {
  position: relative;
  z-index: 2;
  margin-bottom: 14px;
}

.hero-name {
  display: block;
  font-family: $font-serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.15;
  color: $color-text-inverse;
  letter-spacing: -0.5px;
}

/* ===== 标签行 ===== */
.hero-tags {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999rpx;
  border: 1px solid rgba(244, 239, 230, 0.2);
  backdrop-filter: blur(8px);
}

.hero-tag-text {
  font-family: $font-serif;
  font-size: 12px;
  font-weight: 500;
  color: $inverse-85;
  letter-spacing: 0.3px;
}

.hero-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $inverse-55;
  flex-shrink: 0;
}

/* ===== 衣物计数 ===== */
.hero-count {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.hero-count-num {
  font-family: $font-serif;
  font-size: 36px;
  font-weight: 300;
  line-height: 1;
  color: $color-text-inverse;
  letter-spacing: -1.5px;
}

.hero-count-unit {
  font-family: $font-sans;
  font-size: 13px;
  color: $inverse-55;
}

/* ===== 内容卡片区 ===== */
.content-area {
  position: relative;
  z-index: 2;
  margin: 0 20px;
  padding: 24px 20px 32px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 28px;
}

/* ===== 网格 ===== */
.grid-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.grid-card-hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.grid-card-hover .card-img {
  transform: scale(1.03);
}

/* 图片区 */
.card-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #ebe4d6 0%, #dfe8d8 100%);
}

.card-img {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.35s ease;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-placeholder svg {
  width: 48rpx;
  height: 48rpx;
  stroke: $color-text-placeholder;
  opacity: 0.35;
}

/* 信息区 */
.card-info {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-name {
  font-family: $font-serif;
  font-size: 13px;
  font-weight: 600;
  color: $color-text-title;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.card-style {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 错误态 ===== */
.error-card {
  padding: 24px 20px;
  border-radius: 20px;
  background: rgba(184, 92, 58, 0.04);
  border: 1px solid rgba(184, 92, 58, 0.12);
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.error-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(184, 92, 58, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-icon-wrap svg {
  width: 20px;
  height: 20px;
  stroke: $color-terra;
}

.error-body {
  flex: 1;
  min-width: 0;
}

.error-title {
  font-family: $font-serif;
  font-size: 15px;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 4px;
  display: block;
}

.error-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-secondary;
  line-height: 1.5;
  display: block;
  margin-bottom: 14px;
}

.error-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 14px;
  background: rgba(58, 84, 67, 0.06);
  transition: all 0.2s ease;
}

.error-retry svg {
  width: 14px;
  height: 14px;
  stroke: $color-primary;
}

.error-retry-text {
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 500;
  color: $color-primary;
}

.error-retry-hover {
  background: rgba(58, 84, 67, 0.12);
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px;
}

.empty-illustration {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-illustration svg {
  width: 80px;
  height: 80px;
}

.empty-title {
  font-family: $font-serif;
  font-size: 18px;
  font-weight: 600;
  color: $color-text-title;
  margin-bottom: 6px;
  display: block;
}

.empty-desc {
  font-family: $font-sans;
  font-size: 13px;
  color: $color-text-placeholder;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 24px;
  display: block;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 40px;
  border-radius: $radius-pill;
  background: $color-terra;
  border: none;
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 600;
  color: $color-text-inverse;
  transition: all 0.25s ease;
}

.empty-btn::after {
  border: none;
}

.empty-btn:active,
.empty-btn-hover {
  background: $color-terra-soft;
  transform: scale(0.97);
}

/* ===== 底部操作栏 ===== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  pointer-events: none;
}

.bottom-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, rgba(244, 239, 230, 0) 0%, #f4efe6 40%);
  pointer-events: none;
}

.bottom-inner {
  position: relative;
  z-index: 2;
  padding: 24rpx 56rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  pointer-events: auto;
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 96rpx;
  border-radius: $radius-pill;
  background: $color-terra;
  border: none;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  box-shadow: 0 8px 24px rgba(184, 92, 58, 0.25);
  transition: all 0.25s ease;
}

.btn-add::after {
  border: none;
}

.btn-add-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.btn-add:active,
.btn-add-hover {
  background: $color-terra-soft;
  transform: scale(0.98);
  box-shadow: 0 6px 18px rgba(184, 92, 58, 0.2);
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

.skeleton-card-wrap {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0;
}

.skeleton-info {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-name {
  height: 14px;
  width: 55%;
  border-radius: 4px;
}

.skeleton-sub {
  height: 10px;
  width: 35%;
  border-radius: 4px;
}
</style>
