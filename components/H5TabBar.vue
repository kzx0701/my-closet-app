<template>
  <view v-if="isH5" class="h5-tabbar-wrap">
    <view class="h5-tabbar-safe"></view>
    <view class="h5-tabbar">
      <view
        v-for="item in items"
        :key="item.route"
        class="h5-tabbar-item"
        :class="{ 'h5-tabbar-item-active': item.route === currentRoute }"
        @click="switchRoute(item.route)"
      >
        <image
          class="h5-tabbar-icon"
          :src="item.route === currentRoute ? item.selectedIcon : item.icon"
          mode="aspectFit"
        />
        <text class="h5-tabbar-text">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { ROUTES } from "@/common/constants/routes.js";

defineProps({
  currentRoute: {
    type: String,
    default: "",
  },
});

const isH5 = computed(() => typeof window !== "undefined");

const items = [
  {
    route: ROUTES.home,
    label: "首页",
    icon: "/static/icons/tab-home.svg",
    selectedIcon: "/static/icons/tab-home-active.svg",
  },
  {
    route: ROUTES.closets,
    label: "衣橱",
    icon: "/static/icons/tab-closet.svg",
    selectedIcon: "/static/icons/tab-closet-active.svg",
  },
  {
    route: ROUTES.clothes,
    label: "衣物",
    icon: "/static/icons/tab-clothes.svg",
    selectedIcon: "/static/icons/tab-clothes-active.svg",
  },
  {
    route: ROUTES.profile,
    label: "我的",
    icon: "/static/icons/tab-profile.svg",
    selectedIcon: "/static/icons/tab-profile-active.svg",
  },
];

function switchRoute(route) {
  uni.switchTab({
    url: route,
  });
}
</script>

<style lang="scss" scoped>
.h5-tabbar-wrap {
  display: block;
}

.h5-tabbar-safe {
  height: 132rpx;
}

.h5-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  padding: 14rpx 18rpx calc(14rpx + env(safe-area-inset-bottom));
  background: rgba(248, 244, 236, 0.95);
  backdrop-filter: blur(18rpx);
  box-shadow: 0 -10rpx 30rpx rgba(73, 81, 69, 0.08);
  border-top: 1rpx solid rgba(107, 126, 99, 0.12);
}

.h5-tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 8rpx 0;
  transition: background 0.2s ease;
}

.h5-tabbar-item-active .h5-tabbar-text {
  // 对应 $color-primary (#3a5443)
  color: $color-primary;
  font-weight: 600;
}

.h5-tabbar-icon {
  width: 44rpx;
  height: 44rpx;
  transition: color 0.2s ease;
}

.h5-tabbar-text {
  font-family: "Manrope", "PingFang SC", "PingFangSC", "Microsoft YaHei", -apple-system, sans-serif;
  font-size: 20rpx;
  // #7a8678 为未激活态文字色，介于 sage 与 placeholder 之间的中性灰绿
  color: #7a8678;
  line-height: 1;
  transition: color 0.2s ease, font-weight 0.2s ease;
}
</style>
