<template>
  <view class="section">
    <text class="section-title">选择衣柜颜色</text>
    <view class="color-row">
      <view
        v-for="item in options"
        :key="item.code"
        class="color-chip"
        :class="{ active: modelValue === item.code }"
        @click="emit('update:modelValue', item.code)"
      >
        <text class="color-name">{{ item.name }}</text>
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

<style lang="scss">
.section + .section {
  margin-top: 26rpx;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  font-size: $font-size-lg;
  font-weight: 700;
  color: $color-text-title;
}

.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.color-chip {
  padding: 14rpx 22rpx;
  border-radius: $radius-pill;
  background: #f3f5ef;
  border: 2rpx solid transparent;
}

.color-chip.active {
  background: $color-primary-light;
  border-color: $color-primary;
}

.color-name {
  font-size: $font-size-base;
  color: $color-text-primary;
}
</style>
