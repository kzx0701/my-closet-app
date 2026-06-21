<template>
  <view class="hero fade-up-delay-1">
    <ScopeBadge text="Family · 家庭引导" />
    <text class="title">开启家庭协作</text>
    <text class="desc">加入后可以和家人共享衣橱与衣物，按角色协作管理。也可以稍后再设置。</text>
  </view>
</template>

<script setup>
import ScopeBadge from "@/components/ScopeBadge.vue";
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  z-index: 2;
  padding: 0 28px 36px;
  color: $color-text-inverse;
}

.title {
  display: block;
  margin-top: 18rpx;
  margin-bottom: 20rpx;
  font-family: $font-serif;
  font-size: 68rpx;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -1rpx;
  color: $color-text-inverse;
}

.desc {
  display: block;
  font-family: $font-sans;
  font-size: 26rpx;
  line-height: 1.7;
  color: $inverse-50;
  max-width: 560rpx;
}
</style>
