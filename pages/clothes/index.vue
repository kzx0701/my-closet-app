<template>
  <view class="page">
    <view class="hero-card">
      <text class="eyebrow">CLOTHES</text>
      <text class="title">我的衣物</text>
      <text class="desc">这里会承接你最常用的衣物查看、筛选、搜索与新增动作，后续会优先完善。</text>
    </view>

    <view class="section">
      <text class="section-title">你会在这里完成</text>
      <view class="feature-list">
        <view class="feature-card" v-for="item in featureItems" :key="item.title">
          <text class="feature-title">{{ item.title }}</text>
          <text class="feature-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="placeholder-card">
        <text class="placeholder-title">衣物模块即将接入</text>
        <text class="placeholder-desc">建议下一步优先补“衣物列表”和“添加衣物”，这样底部导航就能形成完整使用闭环。</text>
      </view>
    </view>

    <h5-tab-bar :current-route="ROUTES.clothes" />
  </view>
</template>

<script setup>
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";

const featureItems = [
  {
    title: "快速找衣服",
    desc: "按衣橱、季节、分类来筛选，减少翻找成本。",
  },
  {
    title: "新增衣物记录",
    desc: "随手补充新买或新整理出的衣物，保持收纳信息同步。",
  },
  {
    title: "查看未归类衣物",
    desc: "先知道哪些衣物还没放进衣橱，再做后续整理。",
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
.feature-card,
.placeholder-card {
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

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.feature-title,
.placeholder-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #314033;
}

.feature-desc,
.placeholder-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 23rpx;
  line-height: 1.72;
  color: #6f7c6d;
}
</style>
