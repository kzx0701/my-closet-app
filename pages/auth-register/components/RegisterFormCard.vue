<template>
  <view class="card">
    <view class="field">
      <text class="label">用户名</text>
      <input
        class="input"
        :value="username"
        maxlength="32"
        placeholder="3-32 位，不能是纯数字/手机号/邮箱"
        @input="$emit('update:username', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">昵称</text>
      <input
        class="input"
        :value="nickname"
        maxlength="32"
        placeholder="选填，建议填写你的昵称"
        @input="$emit('update:nickname', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <input
        class="input"
        :value="password"
        password
        maxlength="20"
        placeholder="请输入 8-16 位密码"
        @input="$emit('update:password', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">确认密码</text>
      <input
        class="input"
        :value="passwordConfirm"
        password
        maxlength="20"
        placeholder="请再次输入密码"
        @input="$emit('update:passwordConfirm', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">验证码</text>
      <uni-captcha ref="captchaRef" scene="register" :modelValue="captcha" @update:modelValue="handleCaptchaUpdate" />
    </view>

    <button class="submit-btn" type="primary" :loading="loading" @click="$emit('submit')">
      注册并进入
    </button>

    <view class="links">
      <text class="link" @click="$emit('login')">已有账号，去登录</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "RegisterFormCard",
  props: {
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
  },
  emits: [
    "update:username",
    "update:nickname",
    "update:password",
    "update:passwordConfirm",
    "update:captcha",
    "submit",
    "login",
  ],
  methods: {
    handleCaptchaUpdate(value) {
      this.$emit("update:captcha", value);
    },
    refreshCaptcha() {
      this.$refs.captchaRef?.getImageCaptcha();
    },
  },
};
</script>

<style>
.card {
  padding: 38rpx 30rpx 34rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 22rpx 54rpx rgba(35, 43, 34, 0.12);
}

.field + .field {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 25rpx;
  font-weight: 600;
  color: #354236;
}

.input {
  height: 94rpx;
  padding: 0 24rpx;
  border-radius: 20rpx;
  background: #f2f5ef;
  font-size: 28rpx;
  color: #233024;
}

.submit-btn {
  margin-top: 34rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #5a7351 0%, #738c67 100%);
}

.links {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;
}

.link {
  font-size: 24rpx;
  color: #6a7868;
}
</style>
