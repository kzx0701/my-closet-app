<template>
  <view class="section">
    <text class="section-title">选择衣柜颜色</text>
    <view class="color-row">
      <view
        v-for="item in options"
        :key="item.code"
        class="color-chip"
        :class="{ active: modelValue === item.code }"
        @click="$emit('update:modelValue', item.code)"
      >
        <text class="color-name">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ClosetColorPicker",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style>
.section + .section {
  margin-top: 26rpx;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #2d392f;
}

.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.color-chip {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #f3f5ef;
  border: 2rpx solid transparent;
}

.color-chip.active {
  background: #edf4e7;
  border-color: #7b9571;
}

.color-name {
  font-size: 24rpx;
  color: #4f5e4d;
}
</style>
