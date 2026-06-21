<template>
  <view class="section">
    <text class="section-title">配色</text>
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
        ></view>
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

.swatch-row {
  display: flex;
  flex-wrap: wrap;
  gap: 36rpx;
}

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.swatch-dot {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 1px solid rgba(58, 84, 67, 0.08);
  transition: all 0.25s ease;
}

.swatch.active .swatch-dot {
  box-shadow: 0 0 0 4rpx $color-bg-page, 0 0 0 6rpx $color-primary;
}

.swatch-name {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
  transition: color 0.25s ease;
}

.swatch.active .swatch-name {
  color: $color-text-title;
  font-weight: 600;
}
</style>
