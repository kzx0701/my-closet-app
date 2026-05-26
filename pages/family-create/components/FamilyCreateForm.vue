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

<style>
.form-card {
  padding: 40rpx 32rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18rpx 44rpx rgba(47, 56, 47, 0.08);
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #314033;
}

.input {
  margin-top: 20rpx;
  height: 94rpx;
  padding: 0 24rpx;
  border-radius: 22rpx;
  background: #f2f5ef;
  font-size: 30rpx;
  color: #243126;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 18rpx;
  gap: 16rpx;
}

.hint {
  flex: 1;
  font-size: 24rpx;
  line-height: 1.7;
  color: #6d796d;
}

.counter {
  font-size: 22rpx;
  color: #8c9586;
}

.suggestion-block {
  margin-top: 28rpx;
}

.suggestion-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #51604f;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.suggestion-chip {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #eef2eb;
}

.suggestion-text {
  font-size: 24rpx;
  color: #314033;
}

.tips-card {
  margin-top: 30rpx;
  padding: 26rpx 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #f6f4ee 0%, #fbfaf7 100%);
}

.tips-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #465244;
}

.tips-item {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.65;
  color: #667062;
}

.submit {
  margin-top: 36rpx;
  border-radius: 999rpx;
}
</style>
