<template>
  <view class="scope-badge" :class="{ 'scope-badge-dark': dark }">
    <view class="scope-badge-dot"></view>
    <text class="scope-badge-text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "Personal · 个人空间",
  },
  dark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.scope-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.scope-badge-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $color-terra-soft;
  animation: pulseDot 2s ease-in-out infinite;
  flex-shrink: 0;
}

.scope-badge-text {
  font-family: $font-mono;
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $inverse-55;
}

.scope-badge-dark .scope-badge-text {
  color: rgba(58, 84, 67, 0.55);
}
</style>
