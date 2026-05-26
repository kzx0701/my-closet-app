<template>
  <view class="page">
    <guide-hero />
    <view class="card">
      <guide-actions
        @create-family="handleCreateFamily"
        @join-family="handleJoinFamily"
        @skip="handleSkip"
      />
    </view>
  </view>
</template>

<script>
import { ROUTES } from "@/common/constants/routes.js";
import GuideActions from "./components/GuideActions.vue";
import GuideHero from "./components/GuideHero.vue";

export default {
  components: {
    GuideHero,
    GuideActions,
  },
  methods: {
    handleCreateFamily() {
      uni.navigateTo({
        url: ROUTES.familyCreate,
      });
    },
    handleJoinFamily() {
      uni.showToast({
        title: "加入家庭将在下一批实现",
        icon: "none",
      });
    },
    handleSkip() {
      uni.reLaunch({
        url: ROUTES.home,
      });
    },
  },
};
</script>

<style>
.page {
  min-height: 100vh;
  padding: 88rpx 36rpx 80rpx;
  background: linear-gradient(180deg, #f5f3ee 0%, #ffffff 50%, #f2eee6 100%);
}

.card {
  margin-top: 48rpx;
  padding: 40rpx 30rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20rpx 48rpx rgba(43, 49, 43, 0.08);
}
</style>
