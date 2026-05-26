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
    <text class="hint">创建后你会自动成为家庭管理员，后续可邀请家人加入。</text>
    <button class="submit" type="primary" :loading="loading" @click="$emit('submit')">
      创建家庭
    </button>
  </view>
</template>

<script>
export default {
  name: "FamilyCreateForm",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "submit"],
  methods: {
    handleInput(event) {
      this.$emit("update:modelValue", event.detail.value);
    },
  },
};
</script>

<style>
.form-card {
  padding: 40rpx 32rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.94);
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

.hint {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #6d796d;
}

.submit {
  margin-top: 36rpx;
  border-radius: 999rpx;
}
</style>
