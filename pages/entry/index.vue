<template>
  <view class="entry-page">
    <view class="entry-card">
      <view class="spinner"></view>
      <text class="title">正在检查登录状态</text>
      <text class="desc">{{ statusText }}</text>
    </view>
  </view>
</template>

<script>
import { ROUTE_TARGETS } from "@/common/constants/routes.js";
import { resolveLaunchTarget } from "@/common/services/session-router.js";

export default {
  data() {
    return {
      statusText: "即将进入应用",
      isRouting: false,
    };
  },
  onShow() {
    this.routeBySession();
  },
  methods: {
    async routeBySession() {
      if (this.isRouting) {
        return;
      }

      this.isRouting = true;
      this.statusText = "正在准备页面";

      try {
        const result = await resolveLaunchTarget();

        if (result.target === ROUTE_TARGETS.login) {
          this.statusText = "未登录，前往登录页";
          return uni.redirectTo({
            url: result.url,
          });
        }

        if (result.target === ROUTE_TARGETS.home) {
          this.statusText = "检测到家庭身份，进入首页";
        } else {
          this.statusText = "尚未加入家庭，进入家庭引导";
        }

        return uni.reLaunch({
          url: result.url,
        });
      } catch (error) {
        console.error("routeBySession failed", error);
        this.statusText = "状态检测失败，准备重新登录";
        return uni.redirectTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withpwd",
        });
      } finally {
        this.isRouting = false;
      }
    },
  },
};
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
