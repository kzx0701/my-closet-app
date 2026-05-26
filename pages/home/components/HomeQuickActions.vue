<template>
  <view class="actions">
    <view class="action-card" v-for="item in items" :key="item.title" @click="emit('select', item)">
      <view class="action-main">
        <text class="action-title">{{ item.title }}</text>
        <text class="action-desc">{{ item.desc }}</text>
      </view>
      <view class="action-foot">
        <text class="action-tag">{{ item.tag || "待接入" }}</text>
        <text class="action-arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(["select"]);
</script>

<style>
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22rpx;
}

.action-card {
  min-height: 216rpx;
  padding: 28rpx 24rpx 24rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 34rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-main {
  display: block;
}

.action-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #243026;
}

.action-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.65;
  color: #72806f;
}

.action-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18rpx;
}

.action-tag {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #eef2eb;
  font-size: 20rpx;
  color: #51604f;
}

.action-arrow {
  font-size: 30rpx;
  color: #7b8a78;
}
</style>
