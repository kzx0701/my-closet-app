<template>
  <view class="page">
    <view class="hero-card">
      <text class="eyebrow">PROFILE</text>
      <text class="title">我的</text>
      <text class="desc">把账户、家庭、邀请码和设置放在这里，方便用户在低频时集中处理，不干扰主操作流。</text>
    </view>

    <view class="section">
      <text class="section-title">这里更适合放</text>
      <view class="entry-list">
        <view class="entry-card" v-for="item in entryItems" :key="item.title">
          <text class="entry-title">{{ item.title }}</text>
          <text class="entry-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <h5-tab-bar :current-route="ROUTES.profile" />
  </view>
</template>

<script setup>
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";

const entryItems = [
  {
    title: "账号信息",
    desc: "查看头像、昵称、登录账号等个人资料。",
  },
  {
    title: "家庭与邀请码",
    desc: "管理当前家庭关系、查看邀请码、处理协作信息。",
  },
  {
    title: "设置与退出",
    desc: "承接低频但重要的系统设置和登录态管理。",
  },
];
</script>

<style>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 0;
  background:
    radial-gradient(circle at top, rgba(214, 223, 205, 0.42), transparent 34%),
    linear-gradient(180deg, #f7f4ee 0%, #fcfbf8 38%, #f3efe6 100%);
}

.hero-card,
.entry-card {
  padding: 30rpx 26rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.eyebrow {
  display: block;
  font-size: 22rpx;
  letter-spacing: 4rpx;
  color: #7c8979;
}

.title {
  display: block;
  margin-top: 10rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: #2b362d;
}

.desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #687466;
}

.section {
  margin-top: 28rpx;
}

.section-title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #314033;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.entry-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #314033;
}

.entry-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 23rpx;
  line-height: 1.72;
  color: #6f7c6d;
}
</style>
