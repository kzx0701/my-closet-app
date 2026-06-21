<template>
  <view class="hero fade-up-delay-1">
    <ScopeBadge text="Auth · 注册" />
    <text class="brand-mark">Season Closet · 四季衣橱</text>
    <text class="title">建立你的衣橱</text>
  </view>
</template>

<script setup>
import ScopeBadge from "@/components/ScopeBadge.vue";
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  z-index: 2;
  margin-bottom: 36rpx;
  color: $color-text-inverse;
}

.brand-mark {
  display: block;
  margin-top: 8rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $inverse-55;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-family: $font-serif;
  font-size: 68rpx;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -1rpx;
  color: $color-text-inverse;
}
</style>
