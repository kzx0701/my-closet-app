<template>
  <view class="clothes-card" hover-class="clothes-card-hover" :hover-stay-time="100" @click="goDetail">
    <!-- 图片区 -->
    <view class="clothes-img-wrap">
      <image
        v-if="clothes.image_url && !imageError"
        class="clothes-img"
        :src="clothes.image_url"
        mode="aspectFill"
        lazy-load
        @error="onImageError"
      />
      <view v-else class="clothes-img-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
      </view>
      <!-- 季节标记：左侧4px竖线 -->
      <view class="season-mark" :class="seasonClass"></view>
    </view>

    <!-- 信息区 -->
    <view class="clothes-info">
      <text class="clothes-name">{{ clothes.name }}</text>
      <view class="clothes-sub-row">
        <view
          v-if="colorHex"
          class="color-indicator"
          :class="{ 'color-indicator-multicolor': isMulticolor }"
          :style="colorDotStyle"
        ></view>
        <text class="clothes-sub">{{ subtitle }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_COLOR_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";

const props = defineProps({
  clothes: {
    type: Object,
    default() {
      return {};
    },
  },
});

const imageError = ref(false);

// 当图片地址变化时重置错误状态
watch(
  () => props.clothes.image_url,
  () => {
    imageError.value = false;
  }
);

function onImageError() {
  imageError.value = true;
}

const categoryName = computed(() => {
  return CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === props.clothes.category)?.name || "未分类";
});

const seasonName = computed(() => {
  const codes = String(props.clothes.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!codes.length) return "";
  return codes
    .map((code) => CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)?.name || code)
    .join("/");
});

const seasonClass = computed(() => {
  const codes = String(props.clothes.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const code = codes[0] || "all-season";
  return `season-${code}`;
});

// 颜色指示器
const colorOption = computed(() => {
  const code = props.clothes.color;
  if (!code) return null;
  return CLOTHES_COLOR_OPTIONS.find((item) => item.code === code) || null;
});

const colorHex = computed(() => colorOption.value?.hex || "");

const isMulticolor = computed(() => colorOption.value?.code === "multicolor");

const colorDotStyle = computed(() => {
  if (!colorHex.value) return {};
  // 渐变值直接用于 background
  return { background: colorHex.value };
});

const subtitle = computed(() => {
  const parts = [categoryName.value];
  if (seasonName.value) parts.push(seasonName.value);
  return parts.join(" · ");
});

function goDetail() {
  const targetId = props.clothes?._id;
  if (!targetId) return;
  uni.navigateTo({
    url: `${ROUTES.clothesDetail}?clothesId=${targetId}`,
  });
}
</script>

<style lang="scss" scoped>
.clothes-card {
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.clothes-card:hover,
.clothes-card:active {
  transform: translateY(-3px);
  box-shadow: $shadow-card;
}

.clothes-card-hover {
  transform: translateY(-2px);
  box-shadow: $shadow-card;
  opacity: 0.92;
}

/* 图片区 */
.clothes-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.clothes-img {
  width: 100%;
  height: 100%;
  display: block;
}

.clothes-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg-chip;
}

.clothes-img-placeholder svg {
  width: 56rpx;
  height: 56rpx;
  stroke: $color-text-placeholder;
  opacity: 0.4;
}

/* 季节标记：左侧4px竖线 */
.season-mark {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.season-spring {
  background: $color-sage;
}

.season-summer {
  background: #5b8fb0;
}

.season-autumn {
  background: $color-terra;
}

.season-winter {
  background: #8b7355;
}

.season-all-season {
  background: $color-sage-light;
}

/* 信息区 */
.clothes-info {
  padding: 20rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.clothes-name {
  font-family: $font-serif;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-title;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clothes-sub {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
  line-height: 1.4;
}

.clothes-sub-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.color-indicator {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  flex-shrink: 0;
}

.color-indicator-multicolor {
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
