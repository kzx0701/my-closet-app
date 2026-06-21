<template>
  <view class="section">
    <view class="section-title">
      <text>归属衣橱</text>
      <text class="hint">可不选</text>
    </view>
    <view class="chip-row">
      <view
        v-for="item in options"
        :key="item._id"
        class="chip"
        :class="{ active: modelValue === item._id }"
        @click="emit('update:modelValue', item._id)"
      >
        <text class="chip-text">{{ item.name }}</text>
      </view>
      <view
        class="chip"
        :class="{ active: modelValue === '' }"
        @click="emit('update:modelValue', '')"
      >
        <text class="chip-text">暂不归类</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
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
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.section {
  margin-top: 48rpx;
}

.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.hint {
  font-family: $font-sans;
  font-size: 22rpx;
  letter-spacing: 0;
  text-transform: none;
  color: $color-text-placeholder;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip {
  padding: 14rpx 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-chip;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.chip.active {
  background: $color-primary;
  border-color: $color-primary;
}

.chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.chip.active .chip-text {
  color: $color-text-inverse;
  font-weight: 600;
}
</style>
