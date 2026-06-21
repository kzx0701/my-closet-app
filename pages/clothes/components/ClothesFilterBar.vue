<template>
  <view class="filter-bar">
    <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
      <view class="filter-chips">
        <view
          v-for="item in categoryOptions"
          :key="item.code"
          class="filter-chip"
          :class="{ 'filter-chip-active': activeCategory === item.code }"
          hover-class="filter-chip-hover"
          :hover-stay-time="100"
          @click="selectCategory(item.code)"
        >
          <text class="filter-chip-text">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 季节筛选 -->
    <scroll-view class="filter-scroll season-scroll" scroll-x :show-scrollbar="false">
      <view class="filter-chips">
        <view
          v-for="item in seasonOptions"
          :key="item.code"
          class="filter-chip"
          :class="{ 'filter-chip-active': activeSeason === item.code }"
          hover-class="filter-chip-hover"
          :hover-stay-time="100"
          @click="selectSeason(item.code)"
        >
          <text class="filter-chip-text">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";

const props = defineProps({
  activeCategory: {
    type: String,
    default: "all",
  },
  activeSeason: {
    type: String,
    default: "all",
  },
});

const emit = defineEmits(["update:activeCategory", "update:activeSeason"]);

const categoryOptions = [
  { code: "all", name: "全部" },
  ...CLOTHES_CATEGORY_OPTIONS,
];

const seasonOptions = [
  { code: "all", name: "全部季节" },
  ...CLOTHES_SEASON_OPTIONS,
];

function selectCategory(code) {
  if (code === props.activeCategory) return;
  emit("update:activeCategory", code);
}

function selectSeason(code) {
  if (code === props.activeSeason) return;
  emit("update:activeSeason", code);
}
</script>

<style lang="scss" scoped>
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(244, 239, 230, 0.92);
  backdrop-filter: blur(12px);
  padding: 16px 28px;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.season-scroll {
  margin-top: 12px;
}

.filter-chips {
  display: inline-flex;
  gap: 10px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: transparent;
  border: 1px solid $color-border;
  transition: all 0.2s ease;
  flex-shrink: 0;
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
  white-space: nowrap;
}

.filter-chip-active .filter-chip-text {
  color: $color-text-inverse;
}
</style>
