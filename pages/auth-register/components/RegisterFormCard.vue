<template>
  <view class="form fade-up-delay-2">
    <view class="field">
      <text class="label">用户名</text>
      <u-input
        :modelValue="username"
        maxlength="20"
        placeholder="字母 / 数字 4-20 位"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx', borderRadius: '40rpx' }"
        @update:modelValue="emit('update:username', $event)"
      />
    </view>

    <view class="field">
      <text class="label">昵称</text>
      <u-input
        :modelValue="nickname"
        maxlength="32"
        placeholder="例如：林屿"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx', borderRadius: '40rpx' }"
        @update:modelValue="emit('update:nickname', $event)"
      />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <u-input
        :modelValue="password"
        type="password"
        maxlength="20"
        placeholder="至少 6 位"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx', borderRadius: '40rpx' }"
        @update:modelValue="emit('update:password', $event)"
      />
    </view>

    <view class="field">
      <text class="label">确认密码</text>
      <u-input
        :modelValue="passwordConfirm"
        type="password"
        maxlength="20"
        placeholder="再次输入密码"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx', borderRadius: '40rpx' }"
        @update:modelValue="emit('update:passwordConfirm', $event)"
      />
    </view>

    <button
      class="submit-btn"
      :loading="loading"
      @click="emit('submit')"
    >
      注册并登录
    </button>

    <view class="links">
      <text class="link-static">已有账号？</text>
      <text class="link" @click="emit('login')">去登录</text>
    </view>

    <view class="footer">
      注册即代表同意《用户协议》和《隐私政策》
    </view>
  </view>
</template>

<script setup>
defineProps({
  username: {
    type: String,
    default: "",
  },
  nickname: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  passwordConfirm: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:username",
  "update:nickname",
  "update:password",
  "update:passwordConfirm",
  "submit",
  "login",
]);
</script>

<style lang="scss" scoped>
.form {
  position: relative;
  z-index: 2;
}

.field + .field {
  margin-top: 26rpx;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-title;
}

.submit-btn {
  margin-top: 36rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: $radius-btn;
  background: $color-primary;
  color: $color-text-inverse;
  border: none;
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s ease;
}

.submit-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.submit-btn::after {
  border: none;
}

.links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;
  margin-top: 24rpx;
}

.link-static {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $inverse-55;
}

.link {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 500;
  color: $color-terra-soft;
  transition: opacity 0.2s ease;
}

.link:active {
  opacity: 0.7;
}

.footer {
  margin-top: 48rpx;
  text-align: center;
  font-family: $font-sans;
  font-size: 22rpx;
  line-height: 1.6;
  color: $color-text-placeholder;
}
</style>
