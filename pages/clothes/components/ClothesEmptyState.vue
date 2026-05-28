<template>
  <view class="empty-card">
    <text class="title">还没有衣物记录</text>
    <text class="desc">
      先从最常穿、最需要整理的衣物开始。当前这一批先开放个人空间衣物管理，家庭衣物会在后续接入。
    </text>
    <button class="create-btn" @click="$emit('create')">新增第一件衣物</button>
  </view>
</template>

<script setup>
defineEmits(["create"]);
</script>

<style>
.empty-card {
  padding: 34rpx 30rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2d392f;
}

.desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #6f7c6d;
}

.create-btn {
  margin-top: 22rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: #425040;
  background: #eef2eb;
  border: none;
}
</style>
