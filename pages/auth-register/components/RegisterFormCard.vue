<template>
  <view class="card">
    <view class="field">
      <text class="label">用户名</text>
      <u-input
        :modelValue="username"
        maxlength="32"
        placeholder="3-32 位，不能是纯数字/手机号/邮箱"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:username', $event)"
      />
    </view>

    <view class="field">
      <text class="label">昵称</text>
      <u-input
        :modelValue="nickname"
        maxlength="32"
        placeholder="选填，建议填写你的昵称"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:nickname', $event)"
      />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <u-input
        :modelValue="password"
        type="password"
        maxlength="20"
        placeholder="请输入 8-16 位密码"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:password', $event)"
      />
    </view>

    <view class="field">
      <text class="label">确认密码</text>
      <u-input
        :modelValue="passwordConfirm"
        type="password"
        maxlength="20"
        placeholder="请再次输入密码"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:passwordConfirm', $event)"
      />
    </view>

    <view class="field">
      <text class="label">验证码</text>
      <uni-captcha ref="captchaRef" scene="register" :modelValue="captcha" @update:modelValue="handleCaptchaUpdate" />
    </view>

    <u-button
      type="primary"
      shape="circle"
      :loading="loading"
      customStyle="margin-top: 34rpx; background: $gradient-button; border: none;"
      @click="emit('submit')"
    >
      注册并进入
    </u-button>

    <view class="links">
      <text class="link" @click="emit('login')">已有账号，去登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

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
  captcha: {
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
  "update:captcha",
  "submit",
  "login",
]);

const captchaRef = ref(null);

function handleCaptchaUpdate(value) {
  emit("update:captcha", value);
}

function refreshCaptcha() {
  captchaRef.value?.getImageCaptcha();
}

defineExpose({ refreshCaptcha });
</script>

<style lang="scss">
.card {
  padding: 38rpx 30rpx 34rpx;
  border-radius: $radius-xl;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 22rpx 54rpx rgba(35, 43, 34, 0.12);
}

.field + .field {
  margin-top: $spacing-lg;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 25rpx;
  font-weight: 600;
  color: $color-text-title;
}

.links {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;
}

.link {
  font-size: $font-size-base;
  color: $color-text-secondary;
}
</style>
