<template>
  <view class="picker-card">
    <text class="label">绑定衣橱</text>
    <text class="desc">可以先不绑定，后续整理时再放入具体衣橱。</text>

    <view class="option-list">
      <button
        class="option-btn"
        :class="{ 'option-btn-active': modelValue === '' }"
        @click="$emit('update:modelValue', '')"
      >
        暂不绑定衣橱
      </button>
      <button
        v-for="item in options"
        :key="item._id"
        class="option-btn"
        :class="{ 'option-btn-active': modelValue === item._id }"
        @click="$emit('update:modelValue', item._id)"
      >
        {{ item.name }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: "ClothesClosetPicker",
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
.picker-card {
  margin-top: 24rpx;
  padding: 30rpx 26rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.label {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #2d392f;
}

.desc {
  display: block;
  margin-top: 12rpx;
  font-size: 23rpx;
  line-height: 1.7;
  color: #6f7c6d;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  margin-top: 22rpx;
}

.option-btn {
  min-height: 78rpx;
  line-height: 1.4;
  padding: 18rpx 22rpx;
  border-radius: 20rpx;
  text-align: left;
  font-size: 24rpx;
  color: #556451;
  background: #eef2eb;
  border: none;
}

.option-btn-active {
  color: #243026;
  font-weight: 700;
  background: #dfe8d8;
}
</style>
