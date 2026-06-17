<template>
  <view class="card">
    <view class="field">
      <text class="label">账号</text>
      <u-input
        :modelValue="username"
        placeholder="请输入用户名 / 手机号 / 邮箱"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:username', $event)"
      />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <u-input
        :modelValue="password"
        type="password"
        placeholder="请输入密码"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @update:modelValue="emit('update:password', $event)"
      />
    </view>

    <u-button
      type="primary"
      shape="circle"
      :loading="loading"
      customStyle="margin-top: 34rpx; background: $gradient-button; border: none;"
      @click="emit('submit')"
    >
      登录
    </u-button>

    <view class="links">
      <text class="link" @click="emit('register')">注册账号</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
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
});

const emit = defineEmits(["update:username", "update:password", "submit", "register"]);
</script>

<style lang="scss">
.card {
  padding: 38rpx 30rpx 34rpx;
  border-radius: $radius-xl;
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
