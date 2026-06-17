<template>
  <view class="empty-card">
    <u-empty mode="list" text="还没有衣物记录，先从最常穿的衣物开始整理" :iconSize="160">
      <template #bottom>
        <u-button
          type="primary"
          size="small"
          shape="circle"
          customStyle="background: #314033; border-color: #314033;"
          @click="$emit('create')"
        >
          新增第一件衣物
        </u-button>
      </template>
    </u-empty>
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
</style>
