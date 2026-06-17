<template>
  <view class="form-card">
    <text class="label">家庭名称</text>
    <input
      class="input"
      :value="modelValue"
      maxlength="30"
      placeholder="例如：温馨一家"
      @input="handleInput"
    />

    <view class="meta-row">
      <text class="hint">{{ helperText }}</text>
      <text class="counter">{{ modelValue.length }}/30</text>
    </view>

    <view class="suggestion-block">
      <text class="suggestion-title">命名建议</text>
      <view class="suggestion-list">
        <view
          v-for="item in suggestions"
          :key="item"
          class="suggestion-chip"
          @click="emit('pick-suggestion', item)"
        >
          <text class="suggestion-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <view class="tips-card">
      <text class="tips-title">创建后会自动完成</text>
      <text class="tips-item">你会成为这个家庭的管理员</text>
      <text class="tips-item">系统会生成一个邀请码，方便邀请家人加入</text>
      <text class="tips-item">后续可以在家庭空间下共同管理衣橱</text>
    </view>

    <button class="submit" type="primary" :loading="loading" @click="emit('submit')">创建家庭</button>
  </view>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  suggestions: {
    type: Array,
    default() {
      return [];
    },
  },
  helperText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "submit", "pick-suggestion"]);

function handleInput(event) {
  emit("update:modelValue", event.detail.value);
}
</script>

<style lang="scss">
.form-card {
  padding: 40rpx 32rpx;
  border-radius: $radius-xl;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: $shadow-card-lg;
}

.label {
  display: block;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $color-primary;
}

.input {
  margin-top: 20rpx;
  height: 94rpx;
  padding: 0 $spacing-lg;
  border-radius: 22rpx;
  background: $color-bg-input;
  font-size: $font-size-xl;
  color: $color-text-title;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 18rpx;
  gap: $spacing-md;
}

.hint {
  flex: 1;
  font-size: $font-size-base;
  line-height: 1.7;
  color: $color-text-secondary;
}

.counter {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.suggestion-block {
  margin-top: 28rpx;
}

.suggestion-title {
  display: block;
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-primary;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.suggestion-chip {
  padding: 14rpx 22rpx;
  border-radius: $radius-pill;
  background: $color-bg-chip;
}

.suggestion-text {
  font-size: $font-size-base;
  color: $color-primary;
}

.tips-card {
  margin-top: 30rpx;
  padding: 26rpx $spacing-lg;
  border-radius: $radius-md;
  background: $gradient-tips;
}

.tips-title {
  display: block;
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-primary;
}

.tips-item {
  display: block;
  margin-top: 14rpx;
  font-size: $font-size-base;
  line-height: 1.65;
  color: $color-text-secondary;
}

.submit {
  margin-top: 36rpx;
  border-radius: $radius-pill;
}
</style>
