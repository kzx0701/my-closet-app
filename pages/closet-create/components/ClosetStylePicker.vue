<template>
  <view class="section">
    <text class="section-title">选择衣柜样式</text>
    <view class="option-grid">
      <view
        v-for="item in options"
        :key="item.code"
        class="option-card"
        :class="{ active: modelValue === item.code }"
        @click="$emit('update:modelValue', item.code)"
      >
        <text class="option-name">{{ item.name }}</text>
        <text class="option-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ClosetStylePicker",
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

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
}

.option-card {
  padding: 24rpx 22rpx;
  border-radius: 22rpx;
  background: #f5f6f1;
  border: 2rpx solid transparent;
}

.option-card.active {
  background: #edf4e7;
  border-color: #7b9571;
}

.option-name {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #253026;
}

.option-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.65;
  color: #6f7b6d;
}
</style>
