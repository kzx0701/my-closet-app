<template>
  <view class="entry-page">
    <view class="entry-card">
      <view class="spinner"></view>
      <text class="title">正在检查登录状态</text>
      <text class="desc">{{ statusText }}</text>
      <button v-if="showRetry" class="retry-btn" @click="routeBySession">重新检查</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { ROUTE_TARGETS } from "@/common/constants/routes.js";
import { resolveLaunchTarget } from "@/common/services/session-router.js";

const statusText = ref("即将进入应用");
const isRouting = ref(false);
const showRetry = ref(false);

async function routeBySession() {
  if (isRouting.value) {
    return;
  }

  isRouting.value = true;
  showRetry.value = false;
  statusText.value = "正在准备页面";

  try {
    const result = await resolveLaunchTarget();

    if (result.target === ROUTE_TARGETS.login) {
      statusText.value = "未登录，前往登录页";
      return uni.redirectTo({
        url: result.url,
      });
    }

    if (result.target === ROUTE_TARGETS.error) {
      statusText.value = result.membership?.errorMessage || "状态检查失败，请稍后重试";
      showRetry.value = true;
      return;
    }

    if (result.target === ROUTE_TARGETS.home) {
      statusText.value = result.hasSkippedFamilyGuide
        ? "已按个人模式进入首页"
        : "检测到可直接进入首页";
    } else {
      statusText.value = "尚未加入家庭，进入家庭引导";
    }

    return uni.reLaunch({
      url: result.url,
    });
  } catch (error) {
    console.error("routeBySession failed", error);
    statusText.value = "状态检查失败，请重新尝试";
    showRetry.value = true;
  } finally {
    isRouting.value = false;
  }
}

onShow(() => {
  routeBySession();
});
</script>

<style>
.entry-page {
  min-height: 100vh;
  padding: 200rpx 40rpx 80rpx;
  background: linear-gradient(180deg, #f7f6f2 0%, #ffffff 58%, #eeece5 100%);
}

.entry-card {
  padding: 72rpx 40rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18rpx 48rpx rgba(46, 52, 46, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 8rpx solid #d7ddd3;
  border-top-color: #5d7454;
  animation: spin 1s linear infinite;
}

.title {
  margin-top: 28rpx;
  font-size: 38rpx;
  font-weight: 600;
  color: #314033;
}

.desc {
  margin-top: 18rpx;
  font-size: 26rpx;
  color: #697267;
  text-align: center;
}

.retry-btn {
  margin-top: 28rpx;
  border-radius: 999rpx;
  background: #edf1ea;
  color: #314033;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
