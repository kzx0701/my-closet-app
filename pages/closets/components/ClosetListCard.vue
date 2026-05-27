<template>
  <view class="card">
    <view class="badge-row">
      <text class="style-badge">{{ styleName }}</text>
      <text class="color-badge">{{ colorName }}</text>
    </view>
    <text class="title">{{ closet.name }}</text>
    <text class="room">{{ closet.room_name || "未填写房间" }}</text>
    <text v-if="creatorText" class="creator">{{ creatorText }}</text>
    <text class="desc">{{ closet.description || "当前还没有补充衣橱描述。" }}</text>
    <view class="action-row">
      <button class="action-btn" size="mini" @click="$emit('edit', closet)">编辑</button>
      <button class="action-btn danger-btn" size="mini" @click="$emit('delete', closet)">删除</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";

const props = defineProps({
  closet: {
    type: Object,
    default() {
      return {};
    },
  },
});

defineEmits(["edit", "delete"]);

const styleName = computed(() => {
  return CLOSET_STYLE_OPTIONS.find((item) => item.code === props.closet.style_code)?.name || "未知样式";
});

const colorName = computed(() => {
  return CLOSET_COLOR_OPTIONS.find((item) => item.code === props.closet.color_code)?.name || "未知颜色";
});

const creatorText = computed(() => {
  if (props.closet.scope_type !== "family") {
    return "";
  }

  const creatorName = String(props.closet.creator_name || "").trim();

  if (!creatorName) {
    return "";
  }

  return `创建者：${creatorName}`;
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
  gap: 14rpx;
}

.style-badge,
.color-badge {
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

.room {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #60705d;
}

.creator {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #7a8678;
}

.desc {
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
