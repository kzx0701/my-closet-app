<template>
  <view class="form-section">
    <view class="section-header">
      <text class="form-label">样式</text>
      <text class="section-hint">选一个最接近的</text>
    </view>
    <view class="style-grid">
      <view
        v-for="item in options"
        :key="item.code"
        class="style-card"
        :class="{ active: modelValue === item.code }"
        @click="emit('update:modelValue', item.code)"
      >
        <view class="style-card-indicator" :class="{ active: modelValue === item.code }"></view>
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
.form-section {
  margin-bottom: 48rpx;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.form-label {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-secondary;
  letter-spacing: 2rpx;
}

.section-hint {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
}

.style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.style-card {
  position: relative;
  padding: 28rpx 24rpx;
  border-radius: $radius-card;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  overflow: hidden;
}

.style-card.active {
  border-color: $color-primary;
  box-shadow: 0 4px 12px rgba(58, 84, 67, 0.12);
  transform: translateY(-2rpx);
}

.style-card-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: transparent;
  transition: background 0.3s ease;
}

.style-card-indicator.active {
  background: $color-primary;
}

.style-card-name {
  display: block;
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-title;
  line-height: 1.35;
}

.style-card.active .style-card-name {
  color: $color-primary-dark;
}

.style-card-desc {
  display: block;
  margin-top: 12rpx;
  font-family: $font-sans;
  font-size: 22rpx;
  line-height: 1.6;
  color: $color-text-secondary;
}
</style>
