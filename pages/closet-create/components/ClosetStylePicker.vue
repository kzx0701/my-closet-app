<template>
  <view class="section">
    <text class="section-title">选择衣柜样式</text>
    <view class="option-grid">
      <view
        v-for="item in options"
        :key="item.code"
        class="option-card"
        :class="{ active: modelValue === item.code }"
        @click="emit('update:modelValue', item.code)"
      >
        <text class="option-name">{{ item.name }}</text>
        <text class="option-desc">{{ item.desc }}</text>
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

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
}

.option-card {
  padding: $spacing-lg 22rpx;
  border-radius: 22rpx;
  background: #f5f6f1;
  border: 2rpx solid transparent;
}

.option-card.active {
  background: $color-primary-light;
  border-color: $color-primary;
}

.option-name {
  display: block;
  font-size: $font-size-lg;
  font-weight: 700;
  color: $color-text-title;
}

.option-desc {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  line-height: 1.65;
  color: $color-text-secondary;
}
</style>
