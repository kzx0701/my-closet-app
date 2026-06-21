<template>
  <view class="closet-card" hover-class="closet-card-hover" :hover-stay-time="100" @click="goDetail">
    <!-- 缩略图区 -->
    <view class="closet-thumb" :class="thumbStyleClass">
      <svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="closet.style_code === 'arched-vintage'">
          <path d="M3 21V10a9 9 0 0 1 18 0v11"/><line x1="3" y1="21" x2="21" y2="21"/><line x1="12" y1="10" x2="12" y2="21"/>
        </template>
        <template v-else-if="closet.style_code === 'open-rack'">
          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
        </template>
        <template v-else-if="closet.style_code === 'drawer-mix'">
          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="3" y1="18" x2="21" y2="18"/>
        </template>
        <template v-else>
          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>
        </template>
      </svg>
    </view>

    <!-- 信息区 -->
    <view class="closet-info">
      <text class="closet-name">{{ closet.name }}</text>
      <view class="closet-meta">
        <text class="meta-style">{{ styleName }}</text>
        <text class="meta-dot">·</text>
        <text class="meta-color">{{ colorName }}</text>
      </view>
      <view v-if="closet.room_name" class="closet-room-tag">
        <text class="room-tag-text">{{ closet.room_name }}</text>
      </view>
    </view>

    <!-- 计数区 -->
    <view class="closet-count-wrap">
      <text class="closet-count">{{ clothesCount }}</text>
      <text class="closet-count-unit">件衣物</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { ROUTES } from "@/common/constants/routes.js";

const props = defineProps({
  closet: {
    type: Object,
    default() {
      return {};
    },
  },
});

const styleName = computed(() => {
  return CLOSET_STYLE_OPTIONS.find((item) => item.code === props.closet.style_code)?.name || "未知样式";
});

const colorName = computed(() => {
  return CLOSET_COLOR_OPTIONS.find((item) => item.code === props.closet.color_code)?.name || "未知颜色";
});

const clothesCount = computed(() => {
  return props.closet.clothes_count || 0;
});

// 根据样式码返回缩略图背景色 class
const thumbStyleClass = computed(() => {
  const code = props.closet.style_code || "modern-flat";
  return `thumb-style-${code}`;
});

function goDetail() {
  const targetClosetId = props.closet?._id;
  if (!targetClosetId) return;
  const targetScopeType = props.closet?.scope_type === "family" ? "family" : "personal";
  uni.navigateTo({
    url: `${ROUTES.closetDetail}?closetId=${targetClosetId}&scopeType=${targetScopeType}`,
  });
}
</script>

<style lang="scss" scoped>
.closet-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 24rpx;
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.closet-card:hover,
.closet-card:active {
  transform: translateY(-3px);
  box-shadow: $shadow-card;
}

.closet-card-hover {
  transform: translateY(-2px);
  box-shadow: $shadow-card;
  opacity: 0.92;
}

/* 缩略图区 */
.closet-thumb {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumb-style-modern-flat {
  background: #e8dcc4;
}

.thumb-style-arched-vintage {
  background: #d4c4b0;
}

.thumb-style-open-rack {
  background: $color-bg-chip-active;
}

.thumb-style-drawer-mix {
  background: #e0d6c0;
}

.thumb-icon {
  width: 36rpx;
  height: 36rpx;
  stroke: $color-primary-dark;
  opacity: 0.5;
}

/* 信息区 */
.closet-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.closet-name {
  font-family: $font-serif;
  font-size: 34rpx;
  font-weight: 600;
  color: $color-text-title;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.closet-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-style,
.meta-color {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
}

.meta-dot {
  font-size: 22rpx;
  color: $color-text-placeholder;
  opacity: 0.5;
}

.closet-room-tag {
  display: inline-flex;
  align-items: center;
  margin-top: 4rpx;
}

.room-tag-text {
  font-family: $font-mono;
  font-size: 18rpx;
  letter-spacing: 1rpx;
  text-transform: uppercase;
  color: $color-text-secondary;
  background: $color-bg-chip;
  padding: 4rpx 14rpx;
  border-radius: $radius-sm;
}

/* 计数区 */
.closet-count-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rpx;
  flex-shrink: 0;
}

.closet-count {
  font-family: $font-serif;
  font-size: 44rpx;
  font-weight: 400;
  line-height: 1;
  color: $color-primary-dark;
  letter-spacing: -1rpx;
}

.closet-count-unit {
  font-family: $font-sans;
  font-size: 18rpx;
  color: $color-text-placeholder;
}
</style>
