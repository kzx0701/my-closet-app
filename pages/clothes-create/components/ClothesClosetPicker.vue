<template>
  <view class="picker-card">
    <text class="label">绑定衣橱</text>
    <text class="desc">可以先不绑定，后续整理时再放入具体衣橱。</text>

    <u-cell-group :border="false" customStyle="margin-top: 22rpx;">
      <u-cell
        title="暂不绑定衣橱"
        :border="false"
        :customStyle="modelValue === '' ? 'background: $color-bg-chip-active; border-radius: $radius-sm;' : ''"
        @click="emit('update:modelValue', '')"
      >
        <template #right-icon>
          <u-icon v-if="modelValue === ''" name="checkmark-circle-fill" color="$color-primary" size="40" />
        </template>
      </u-cell>
      <u-cell
        v-for="item in options"
        :key="item._id"
        :title="item.name"
        :border="false"
        :customStyle="modelValue === item._id ? 'background: $color-bg-chip-active; border-radius: $radius-sm;' : ''"
        @click="emit('update:modelValue', item._id)"
      >
        <template #right-icon>
          <u-icon v-if="modelValue === item._id" name="checkmark-circle-fill" color="$color-primary" size="40" />
        </template>
      </u-cell>
    </u-cell-group>
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
.picker-card {
  margin-top: $spacing-lg;
  padding: 30rpx 26rpx;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.label {
  display: block;
  font-size: $font-size-md;
  font-weight: 700;
  color: $color-text-title;
}

.desc {
  display: block;
  margin-top: $spacing-sm;
  font-size: 23rpx;
  line-height: 1.7;
  color: $color-text-secondary;
}
</style>
