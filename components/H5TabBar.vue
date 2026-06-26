<template>
  <view class="tabbar-wrap">
    <!-- 内容区占位 -->
    <view class="tabbar-safe"></view>
    <!-- TabBar 主体 -->
    <view class="tabbar">
      <view class="tabbar-inner">
        <!-- 滑动指示器：初始化阶段不动画，避免从位置0滑过来的视觉残留 -->
        <view class="tabbar-slider" :class="{ 'tabbar-slider-ready': sliderReady }" :style="sliderStyle"></view>
        <view
          v-for="(item, index) in items"
          :key="item.route"
          class="tabbar-item"
          :class="{ 'tabbar-item-active': item.route === currentRoute }"
          @click="switchRoute(item.route, index)"
        >
          <view class="tabbar-icon-area">
            <uni-icons
              :type="item.icon"
              :size="item.route === currentRoute ? 22 : 20"
              :color="item.route === currentRoute ? '#3a5443' : '#8a8a7e'"
            ></uni-icons>
          </view>
          <text class="tabbar-label">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ROUTES } from "@/common/constants/routes.js";

const props = defineProps({
  currentRoute: {
    type: String,
    default: "",
  },
});

const items = [
  { key: "home", route: ROUTES.home, label: "首页", icon: "home" },
  { key: "closets", route: ROUTES.closets, label: "衣橱", icon: "shop" },
  { key: "clothes", route: ROUTES.clothes, label: "衣物", icon: "star" },
  { key: "profile", route: ROUTES.profile, label: "我的", icon: "person" },
];

// 直接计算初始索引，避免从0开始再动画到正确位置
const initialIndex = items.findIndex((i) => i.route === props.currentRoute);
const activeIndex = ref(initialIndex >= 0 ? initialIndex : 0);

// 滑块是否就绪（就绪后才启用过渡动画）
const sliderReady = ref(false);

// 挂载后启用过渡动画
onMounted(() => {
  // 下一帧启用动画，确保初始位置已渲染完成
  setTimeout(() => {
    sliderReady.value = true;
  }, 30);
});

// 滑块位置：每个 tab 占 25%，滑块宽 16%，居中偏移 = index * 25% + 4.5%
const sliderStyle = computed(() => {
  const percent = activeIndex.value * 25 + 4.5;
  return {
    left: `${percent}%`,
  };
});

function switchRoute(route, index) {
  if (route === props.currentRoute) return;
  activeIndex.value = index;
  uni.switchTab({ url: route });
}
</script>

<style lang="scss" scoped>
.tabbar-wrap {
  display: block;
}

/* 占位高度，防止内容被 TabBar 遮挡 */
.tabbar-safe {
  height: 76px;
}

/* TabBar 主体 */
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  padding: 0 20px calc(8px + env(safe-area-inset-bottom));
  background: transparent;
}

.tabbar-inner {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(40px) saturate(1.6);
  -webkit-backdrop-filter: blur(40px) saturate(1.6);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 2px 6px rgba(45, 67, 52, 0.03),
    0 8px 28px rgba(45, 67, 52, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  padding: 4px 0;
  overflow: hidden;
}

/* ===== 滑动指示器 ===== */
.tabbar-slider {
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: 16%;
  border-radius: 16px;
  background: rgba(58, 84, 67, 0.07);
  pointer-events: none;
  z-index: 0;
  /* 初始不动画，通过 class 控制 */
  transition: none;
}

/* 就绪后启用过渡 */
.tabbar-slider-ready {
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 单个 Tab 项 ===== */
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0 6px;
  position: relative;
  z-index: 1;
}

.tabbar-item:active {
  opacity: 0.7;
}

/* 图标区域 */
.tabbar-icon-area {
  width: 40px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.tabbar-item-active .tabbar-icon-area {
  transform: translateY(-1px);
}

/* 文字标签 */
.tabbar-label {
  font-family: $font-sans;
  font-size: 10px;
  font-weight: 500;
  color: $color-text-placeholder;
  line-height: 1;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.tabbar-item-active .tabbar-label {
  color: $color-primary;
  font-weight: 600;
  opacity: 1;
}
</style>
