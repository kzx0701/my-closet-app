<template>
  <view class="form-section">
    <text class="form-label">配色</text>
    <view class="swatch-row">
      <view
        v-for="item in options"
        :key="item.code"
        class="swatch"
        :class="{ active: modelValue === item.code }"
        @click="emit('update:modelValue', item.code)"
      >
        <view
          class="swatch-dot"
          :style="{ background: item.color }"
        >
          <view v-if="modelValue === item.code" class="swatch-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </view>
        </view>
        <text class="swatch-name">{{ item.name }}</text>
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

.form-label {
  display: block;
  margin-bottom: 24rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-secondary;
  letter-spacing: 2rpx;
}

.swatch-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  padding: 8rpx;
  border-radius: $radius-md;
  transition: all 0.25s ease;
}

.swatch-dot {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.swatch.active .swatch-dot {
  border-color: $color-primary;
  box-shadow: 0 0 0 4rpx rgba(58, 84, 67, 0.12);
  transform: scale(1.08);
}

.swatch-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch-check svg {
  width: 22rpx;
  height: 22rpx;
}

.swatch-name {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.swatch.active .swatch-name {
  color: $color-text-title;
  font-weight: 600;
}
</style>
