<template>
  <view class="card">
    <view class="field">
      <text class="label">账号</text>
      <input
        class="input"
        :value="username"
        placeholder="请输入用户名 / 手机号 / 邮箱"
        @input="$emit('update:username', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <input
        class="input"
        :value="password"
        password
        placeholder="请输入密码"
        @input="$emit('update:password', $event.detail.value)"
      />
    </view>

    <button class="submit-btn" type="primary" :loading="loading" @click="$emit('submit')">
      登录
    </button>

    <view class="links">
      <text class="link" @click="$emit('register')">注册账号</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "LoginFormCard",
  props: {
    username: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:username", "update:password", "submit", "register"],
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
  margin-top: 26rpx;
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
