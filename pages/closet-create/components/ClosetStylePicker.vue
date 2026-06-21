<template>
  <view class="section">
    <view class="section-title">
      <text>样式</text>
      <text class="hint">选一个最接近的</text>
    </view>
    <view class="style-grid">
      <view
        v-for="item in options"
        :key="item.code"
        class="style-card"
        :class="{ active: modelValue === item.code }"
        @click="emit('update:modelValue', item.code)"
      >
        <text class="style-card-name">{{ item.name }}</text>
        <text class="style-card-desc">{{ item.desc }}</text>
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

.style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.style-card {
  padding: 28rpx 24rpx;
  border-radius: $radius-md;
  background: $color-bg-card-end;
  border: 2rpx solid transparent;
  transition: all 0.25s ease;
}

.style-card.active {
  background: $color-bg-card;
  border-color: $color-primary;
  box-shadow: $shadow-card-sm;
}

.style-card-name {
  display: block;
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-title;
}

.style-card-desc {
  display: block;
  margin-top: 10rpx;
  font-family: $font-sans;
  font-size: 22rpx;
  line-height: 1.6;
  color: $color-text-secondary;
}
</style>
