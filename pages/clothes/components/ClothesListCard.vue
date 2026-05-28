<template>
  <view class="card">
    <view class="badge-row">
      <text class="badge">{{ categoryName }}</text>
      <text class="badge">{{ seasonName }}</text>
      <text v-if="clothes.color" class="badge">{{ clothes.color }}</text>
    </view>
    <text class="title">{{ clothes.name }}</text>
    <text class="meta">{{ closetLabel }}</text>
    <text class="remark">{{ clothes.remark || "当前还没有补充衣物备注。" }}</text>
    <view class="action-row">
      <button class="action-btn" size="mini" @click="$emit('edit', clothes)">编辑</button>
      <button class="action-btn danger-btn" size="mini" @click="$emit('delete', clothes)">删除</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";

const props = defineProps({
  clothes: {
    type: Object,
    default() {
      return {};
    },
  },
});

defineEmits(["edit", "delete"]);

const categoryName = computed(() => {
  return CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === props.clothes.category)?.name || "未知分类";
});

const seasonName = computed(() => {
  return CLOTHES_SEASON_OPTIONS.find((item) => item.code === props.clothes.season)?.name || "未知季节";
});

const closetLabel = computed(() => {
  const closetName = String(props.clothes.closet_name || "").trim();
  return closetName ? `所属衣橱：${closetName}` : "当前未绑定衣橱";
});
</script>

<style>
.card {
  padding: 30rpx 26rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  color: #546251;
  background: #eef2eb;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #253026;
}

.meta {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #60705d;
}

.remark {
  display: block;
  margin-top: 16rpx;
  font-size: 23rpx;
  line-height: 1.7;
  color: #73806f;
}

.action-row {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.action-btn {
  min-width: 132rpx;
  height: 62rpx;
  line-height: 62rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #425040;
  background: #eef2eb;
  border: none;
}

.danger-btn {
  color: #8b4a45;
  background: #f7ebe8;
}
</style>
