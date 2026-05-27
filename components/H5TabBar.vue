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
    icon: "/static/tabbar/yun.png",
    selectedIcon: "/static/tabbar/yun1.png",
  },
  {
    route: ROUTES.closets,
    label: "衣橱",
    icon: "/static/tabbar/storage.png",
    selectedIcon: "/static/tabbar/storage1.png",
  },
  {
    route: ROUTES.clothes,
    label: "衣物",
    icon: "/static/tabbar/obj.png",
    selectedIcon: "/static/tabbar/obj1.png",
  },
  {
    route: ROUTES.profile,
    label: "我的",
    icon: "/static/tabbar/fn.png",
    selectedIcon: "/static/tabbar/fn1.png",
  },
];

function switchRoute(route) {
  uni.switchTab({
    url: route,
  });
}
</script>

<style>
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
  background: rgba(251, 250, 247, 0.96);
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
}

.h5-tabbar-item-active .h5-tabbar-text {
  color: #314033;
  font-weight: 600;
}

.h5-tabbar-icon {
  width: 44rpx;
  height: 44rpx;
}

.h5-tabbar-text {
  font-size: 20rpx;
  color: #7a8678;
  line-height: 1;
}
</style>
