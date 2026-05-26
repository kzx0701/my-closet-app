<template>
  <view class="actions">
    <view class="action-card" v-for="item in items" :key="item.title">
      <text class="action-title">{{ item.title }}</text>
      <text class="action-desc">{{ item.desc }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "HomeQuickActions",
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style>
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.action-card {
  min-height: 180rpx;
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 16rpx 36rpx rgba(61, 69, 60, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #2d3a2f;
}

.action-desc {
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #72806f;
}
</style>
