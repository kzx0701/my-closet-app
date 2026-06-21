<template>
  <view class="page noise-texture">
    <!-- 图片区 -->
    <view class="image-area fade-up-delay-1">
      <!-- 加载骨架 -->
      <view v-if="loading" class="skeleton skeleton-image"></view>
      <!-- 图片 -->
      <image
        v-else-if="!error && clothes.image_url && !imageLoadError"
        class="clothes-image"
        :src="clothes.image_url"
        mode="aspectFill"
        @click="previewImage"
        @error="onImageError"
      />
      <!-- 占位图 -->
      <view v-else-if="!error" class="image-placeholder">
        <view class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </view>
      </view>

      <!-- season-mark -->
      <view
        v-if="!loading && !error && seasonMarkColor"
        class="season-mark"
        :style="{ background: seasonMarkColor }"
      ></view>

      <!-- 导航栏（绝对定位在图片上） -->
      <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="nav-back" @click="goBack">
          <view class="nav-back-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </view>
        </view>
        <view v-if="!loading && !error" class="nav-actions">
          <button class="nav-share-btn" open-type="share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <view class="nav-action" @click="handleEdit">
            <text class="nav-action-text">编辑</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载骨架屏 -->
    <view v-if="loading" class="info-area">
      <view class="skeleton skeleton-title"></view>
      <view class="skeleton skeleton-meta-block"></view>
      <view class="detail-section">
        <view class="skeleton skeleton-label"></view>
        <view class="skeleton skeleton-row"></view>
        <view class="skeleton skeleton-row"></view>
        <view class="skeleton skeleton-row"></view>
      </view>
    </view>

    <!-- 错误态 -->
    <view v-else-if="error" class="state-area">
      <view class="error-card">
        <svg class="err-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <view class="err-content">
          <text class="err-title">加载失败</text>
          <text class="err-desc">衣物详情加载失败，请检查网络后重试。</text>
          <text class="err-retry" @click="retryLoad">重新加载</text>
        </view>
      </view>
    </view>

    <!-- 信息区 -->
    <view v-else class="info-area fade-up-delay-1">
      <text class="clothes-title">{{ clothes.name || "未命名衣物" }}</text>
      <text class="meta-row">{{ metaText }}</text>

      <!-- 详细信息 -->
      <view class="detail-section">
        <text class="detail-label">Details · 详细信息</text>
        <view class="detail-row">
          <text class="detail-key">分类</text>
          <text class="detail-value">{{ categoryName }}</text>
        </view>
        <view v-if="colorOption" class="detail-row">
          <text class="detail-key">颜色</text>
          <view class="color-value">
            <view
              class="color-value-dot"
              :class="{ 'color-value-dot-multicolor': colorOption.code === 'multicolor' }"
              :style="colorDotStyle"
            ></view>
            <text class="detail-value">{{ colorOption.label }}</text>
          </view>
        </view>
        <view class="detail-row">
          <text class="detail-key">适合季节</text>
          <text class="detail-value">{{ seasonName }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-key">归属衣橱</text>
          <text
            class="detail-value"
            :class="{ 'detail-value-link': clothes.closet_id && closetExists }"
            @click="goClosetDetail"
          >{{ closetName }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-key">归属空间</text>
          <text class="detail-value">{{ clothes.scope_type === 'family' ? '家庭空间' : '个人空间' }}</text>
        </view>
      </view>

      <!-- 穿着记录 -->
      <view class="detail-section">
        <text class="detail-label">Wear History · 穿着记录</text>
        <view class="wear-card">
          <view class="wear-info">
            <view class="wear-stat">
              <text class="wear-count">{{ wearRecord.count }}</text>
              <text class="wear-count-label">次穿着</text>
            </view>
            <text class="wear-last">{{ wearLastText }}</text>
          </view>
          <button class="btn-wear" @click="recordWear">记录穿着</button>
        </view>
      </view>

      <!-- 备注 -->
      <view v-if="clothes.remark" class="detail-section">
        <text class="detail-label">Notes · 备注</text>
        <text class="notes-text">{{ clothes.remark }}</text>
      </view>

      <!-- 元信息 -->
      <view class="detail-section">
        <text class="detail-label">Meta · 元信息</text>
        <view class="detail-row">
          <text class="detail-key">创建时间</text>
          <text class="detail-value">{{ createdDateText }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-key">衣物ID</text>
          <text class="detail-value detail-value-mono">{{ clothesIdShort }}</text>
        </view>
      </view>
    </view>

    <!-- 底部 CTA -->
    <view v-if="!loading && !error" class="bottom-cta fade-up-delay-2">
      <button class="btn-edit" @click="handleEdit">编辑衣物</button>
      <button class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { deleteClothes, getClothesDetail } from "@/common/api/modules/clothes.js";
import { getPersonalClosetList, getFamilyClosetList } from "@/common/api/modules/closet.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_COLOR_OPTIONS, CLOTHES_SEASON_OPTIONS, SEASON_COLOR_MAP } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";
import { safeNavigateTo, safeNavigateBack } from "@/common/utils/nav-helper.js";
import { getCurrentSession } from "@/common/services/auth.js";

const clothes = ref({});
const closetList = ref([]);
const statusBarHeight = ref(20);
const loading = ref(false);
const error = ref(false);
const currentClothesId = ref("");
const hasInitialized = ref(false);
const imageLoadError = ref(false);
const wearRecord = ref({ count: 0, lastWorn: null });

const clothesId = computed(() => clothes.value._id || "");
const clothesIdShort = computed(() => {
  const id = clothesId.value;
  if (!id) return "—";
  return id.length > 12 ? `${id.slice(0, 12)}…` : id;
});

const categoryName = computed(() => {
  const code = clothes.value.category;
  return CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === code)?.name || "未分类";
});

const colorOption = computed(() => {
  const code = clothes.value.color;
  if (!code) return null;
  return CLOTHES_COLOR_OPTIONS.find((item) => item.code === code) || null;
});

const colorDotStyle = computed(() => {
  if (!colorOption.value) return {};
  const hex = colorOption.value.hex || "";
  if (hex.startsWith("linear-gradient")) {
    return { background: hex };
  }
  return { background: hex };
});

const seasonName = computed(() => {
  const codes = String(clothes.value.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!codes.length) return "—";
  return codes
    .map((code) => CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)?.name || code)
    .join(" · ");
});

const seasonMarkColor = computed(() => {
  const firstSeason = String(clothes.value.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)[0];
  return SEASON_COLOR_MAP[firstSeason] || "";
});

const closetName = computed(() => {
  const closetId = clothes.value.closet_id;
  if (!closetId) return "暂未归类";
  return closetList.value.find((item) => item._id === closetId)?.name || "已删除衣橱";
});

const closetExists = computed(() => {
  const closetId = clothes.value.closet_id;
  if (!closetId) return false;
  return closetList.value.some((item) => item._id === closetId);
});

const metaText = computed(() => {
  const parts = [categoryName.value];
  const seasonCodes = String(clothes.value.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const seasonNames = seasonCodes
    .map((code) => CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)?.name)
    .filter(Boolean)
    .join("·");
  if (seasonNames) parts.push(seasonNames);

  let text = parts.join("·");
  if (clothes.value.closet_id) {
    text += ` / ${closetName.value}`;
  }
  return text;
});

const createdDateText = computed(() => {
  const timestamp = clothes.value.created_at;
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
});

// 穿着记录：最后穿着时间文案
const wearLastText = computed(() => {
  const last = wearRecord.value?.lastWorn;
  if (!last) return "暂无记录";
  const diff = Date.now() - last;
  if (diff < 0) return "刚刚";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 1) return `最后穿着：${days}天前`;
  if (hours >= 1) return `最后穿着：${hours}小时前`;
  if (minutes >= 1) return `最后穿着：${minutes}分钟前`;
  return "最后穿着：刚刚";
});

// ===== 穿着记录本地存储 =====
function getWearStorageKey(targetClothesId) {
  const session = getCurrentSession();
  return `clothes_wear_${session?.uid || "anonymous"}_${targetClothesId}`;
}

function loadWearRecord(targetClothesId) {
  if (!targetClothesId) return { count: 0, lastWorn: null };
  const key = getWearStorageKey(targetClothesId);
  const data = uni.getStorageSync(key);
  return data || { count: 0, lastWorn: null };
}

function saveWearRecord(targetClothesId, record) {
  if (!targetClothesId) return;
  const key = getWearStorageKey(targetClothesId);
  uni.setStorageSync(key, record);
}

function recordWear() {
  if (!clothesId.value) return;
  const record = loadWearRecord(clothesId.value);
  record.count = (record.count || 0) + 1;
  record.lastWorn = Date.now();
  saveWearRecord(clothesId.value, record);
  wearRecord.value = { ...record };
  uni.showToast({ title: "已记录穿着", icon: "success" });
}

async function loadClosetList() {
  const scopeType = clothes.value.scope_type === "family" ? "family" : "personal";
  try {
    const result =
      scopeType === "family"
        ? await getFamilyClosetList({ pageSize: 100 })
        : await getPersonalClosetList({ pageSize: 100 });
    closetList.value = result?.list || [];
  } catch (error) {
    console.error("loadClosetList failed", error);
    closetList.value = [];
  }
}

async function loadClothesDetail(targetClothesId) {
  const result = await getClothesDetail({ clothesId: targetClothesId });
  clothes.value = result?.clothes || {};
}

async function loadDetailData(targetId) {
  loading.value = true;
  error.value = false;
  imageLoadError.value = false;
  try {
    await loadClothesDetail(targetId);
    await loadClosetList();
    // 加载本地穿着记录
    wearRecord.value = loadWearRecord(targetId);
  } catch (err) {
    console.error("loadDetailData failed", err);
    error.value = true;
    uni.showToast({
      title: err?.message || "衣物详情加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

function retryLoad() {
  if (currentClothesId.value) {
    loadDetailData(currentClothesId.value);
  }
}

function handleEdit() {
  if (!clothesId.value) return;
  uni.navigateTo({
    url: `${ROUTES.clothesEdit}?clothesId=${clothesId.value}&scopeType=${clothes.value.scope_type || "personal"}`,
  });
}

function goClosetDetail() {
  const targetClosetId = clothes.value.closet_id;
  if (!targetClosetId) return;

  if (!closetExists.value) {
    uni.showToast({
      title: "该衣橱已被删除",
      icon: "none",
    });
    return;
  }

  const targetScopeType = clothes.value.scope_type === "family" ? "family" : "personal";
  safeNavigateTo(`${ROUTES.closetDetail}?closetId=${targetClosetId}&scopeType=${targetScopeType}`);
}

function handleDelete() {
  uni.showModal({
    title: "删除衣物",
    content: "确定要删除这件衣物吗？删除后无法恢复。",
    confirmColor: "#b85c3a",
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await deleteClothes({ clothesId: clothesId.value });
        uni.showToast({ title: "衣物已删除", icon: "success" });
        // 通知列表页需要刷新
        uni.$emit("clothes:need-refresh");
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      } catch (error) {
        console.error("deleteClothes failed", error);
        uni.showToast({
          title: error?.message || "删除失败",
          icon: "none",
        });
      }
    },
  });
}

function previewImage() {
  if (clothes.value.image_url) {
    uni.previewImage({
      urls: [clothes.value.image_url],
      current: clothes.value.image_url,
    });
  }
}

function onImageError() {
  imageLoadError.value = true;
}

function goBack() {
  safeNavigateBack(ROUTES.home);
}

// 微信分享
onShareAppMessage(() => {
  return {
    title: `看看这件：${clothes.value?.name || "我的衣物"}`,
    path: `/pages/clothes-detail/index?clothesId=${clothesId.value}`,
    imageUrl: clothes.value?.image_url,
  };
});

onLoad(async (options) => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  const targetClothesId = String(options?.clothesId || "").trim();

  if (!targetClothesId) {
    uni.showToast({ title: "衣物不存在", icon: "none" });
    setTimeout(() => uni.navigateBack(), 500);
    return;
  }

  currentClothesId.value = targetClothesId;
  await loadDetailData(targetClothesId);
  hasInitialized.value = true;
});

onShow(() => {
  if (currentClothesId.value && hasInitialized.value) {
    loadDetailData(currentClothesId.value);
  }
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 200rpx;
}

/* 图片区 */
.image-area {
  position: relative;
  width: 100%;
  height: 840rpx;
  background: linear-gradient(135deg, #ebe4d6 0%, #d4b896 100%);
  overflow: hidden;
}

.clothes-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 200rpx;
  height: 200rpx;
  color: $color-sage;
  opacity: 0.5;
}

.placeholder-icon svg {
  width: 100%;
  height: 100%;
}

.season-mark {
  position: absolute;
  top: 200rpx;
  left: 0;
  width: 8rpx;
  height: 56rpx;
  border-radius: 0 4rpx 4rpx 0;
  z-index: 3;
}

/* 导航栏 */
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-primary-dark;
  backdrop-filter: blur(8px);
}

.nav-back-icon svg {
  width: 32rpx;
  height: 32rpx;
}

.nav-action {
  padding: 12rpx 24rpx;
  border-radius: $radius-btn;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid $color-border;
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
  color: $color-text-title;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.nav-share-btn {
  width: 64rpx;
  height: 64rpx;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid $color-border;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-primary-dark;
  line-height: 1;
  transition: all 0.2s ease;
}

.nav-share-btn::after {
  border: none;
}

.nav-share-btn:active {
  opacity: 0.7;
  transform: scale(0.95);
}

.nav-share-btn svg {
  width: 32rpx;
  height: 32rpx;
}

/* 信息区 */
.info-area {
  position: relative;
  z-index: 2;
  padding: 48rpx 56rpx 0;
}

.clothes-title {
  display: block;
  margin-bottom: 16rpx;
  font-family: $font-serif;
  font-size: 48rpx;
  font-weight: 600;
  line-height: 1.2;
  color: $color-text-title;
}

.meta-row {
  display: block;
  margin-bottom: 56rpx;
  font-family: $font-sans;
  font-size: 26rpx;
  color: $color-text-secondary;
}

.detail-section {
  margin-bottom: 56rpx;
}

.detail-label {
  display: block;
  margin-bottom: 28rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.detail-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid $color-border-soft;
}

.detail-key {
  font-family: $font-mono;
  font-size: 24rpx;
  letter-spacing: 1px;
  color: $color-text-placeholder;
}

.detail-value {
  font-family: $font-serif;
  font-size: 28rpx;
  color: $color-text-title;
  text-align: right;
  max-width: 60%;
}

.detail-value-mono {
  font-family: $font-mono;
  font-size: 24rpx;
  letter-spacing: 1px;
}

.detail-value-link {
  color: $color-terra;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.detail-value-link:active {
  opacity: 0.7;
}

.notes-text {
  display: block;
  font-family: $font-serif;
  font-size: 28rpx;
  line-height: 1.7;
  color: $color-text-secondary;
}

/* 颜色值显示 */
.color-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.color-value-dot {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  flex-shrink: 0;
}

.color-value-dot-multicolor {
  border: 1px solid rgba(0, 0, 0, 0.15);
}

/* 穿着记录卡片 */
.wear-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  border-radius: $radius-card;
  background: rgba(58, 84, 67, 0.04);
  border: 1px solid $color-border-soft;
}

.wear-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
  min-width: 0;
}

.wear-stat {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.wear-count {
  font-family: $font-serif;
  font-size: 48rpx;
  font-weight: 600;
  line-height: 1;
  color: $color-primary-dark;
}

.wear-count-label {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.wear-last {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
}

.btn-wear {
  flex-shrink: 0;
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 32rpx;
  margin: 0;
  border-radius: $radius-btn;
  background: $color-primary;
  border: none;
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-inverse;
  transition: all 0.2s ease;
}

.btn-wear::after {
  border: none;
}

.btn-wear:active {
  transform: scale(0.96);
  opacity: 0.9;
}

/* 底部 CTA */
.bottom-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  gap: 20rpx;
  padding: 32rpx 56rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: $gradient-bottom-bar;
}

.btn-edit {
  flex: 2;
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

.btn-edit:hover {
  opacity: 0.9;
}

.btn-edit:active {
  transform: scale(0.98);
}

.btn-edit::after {
  border: none;
}

.btn-delete {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: $radius-btn;
  background: transparent;
  border: 1px solid rgba(184, 92, 58, 0.3);
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-terra;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: rgba(184, 92, 58, 0.06);
}

.btn-delete:active {
  transform: scale(0.98);
}

.btn-delete::after {
  border: none;
}

/* ===== 加载/错误状态区 ===== */
.state-area {
  position: relative;
  z-index: 2;
  padding: 80rpx 56rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 3px solid rgba(58, 84, 67, 0.12);
  border-top-color: $color-primary;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 24rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
}

/* ===== 错误态卡片 ===== */
.error-card {
  width: 100%;
  padding: 40rpx 44rpx;
  border-radius: $radius-card;
  background: rgba(184, 92, 58, 0.06);
  border: 1px solid rgba(184, 92, 58, 0.18);
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
}

.err-icon {
  width: 44rpx;
  height: 44rpx;
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
  font-size: 32rpx;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 8rpx;
  display: block;
}

.err-desc {
  font-family: $font-sans;
  font-size: 26rpx;
  color: $color-text-secondary;
  line-height: 1.5;
  display: block;
  margin-bottom: 20rpx;
}

.err-retry {
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 600;
  color: $color-terra;
  padding: 10rpx 0;
  display: inline-block;
}

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(58, 84, 67, 0.06) 0%,
    rgba(58, 84, 67, 0.12) 50%,
    rgba(58, 84, 67, 0.06) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 8rpx;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.skeleton-title {
  height: 48rpx;
  width: 60%;
  margin-bottom: 16rpx;
}

.skeleton-meta-block {
  height: 26rpx;
  width: 40%;
  margin-bottom: 56rpx;
}

.skeleton-label {
  height: 20rpx;
  width: 200rpx;
  margin-bottom: 28rpx;
}

.skeleton-row {
  height: 28rpx;
  width: 100%;
  margin-bottom: 20rpx;
}
</style>
