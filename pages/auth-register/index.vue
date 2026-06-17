<template>
  <view class="page">
    <view class="bg-glow bg-glow-left"></view>
    <view class="bg-glow bg-glow-right"></view>

    <register-hero />

    <register-form-card
      ref="registerFormCardRef"
      v-model:username="username"
      v-model:nickname="nickname"
      v-model:password="password"
      v-model:passwordConfirm="passwordConfirm"
      v-model:captcha="captcha"
      :loading="submitting"
      @submit="submitRegister"
      @login="goLogin"
    />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";
import { ROUTES } from "@/common/constants/routes.js";
import { registerUser } from "@/common/api/modules/auth.js";
import RegisterFormCard from "./components/RegisterFormCard.vue";
import RegisterHero from "./components/RegisterHero.vue";

const registerFormCardRef = ref(null);
const username = ref("");
const nickname = ref("");
const password = ref("");
const passwordConfirm = ref("");
const captcha = ref("");
const submitting = ref(false);

function isEmail(value) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
}

function validateRegisterForm() {
  const normalizedUsername = username.value.trim();
  const normalizedNickname = nickname.value.trim();

  if (!normalizedUsername) {
    return "请输入用户名";
  }

  if (normalizedUsername.length < 3 || normalizedUsername.length > 32) {
    return "用户名长度需为 3-32 位";
  }

  if (/^1\d{10}$/.test(normalizedUsername) || isEmail(normalizedUsername)) {
    return "用户名不能是手机号或邮箱";
  }

  if (/^\d+$/.test(normalizedUsername)) {
    return "用户名不能为纯数字";
  }

  if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(normalizedUsername)) {
    return "用户名不能包含中文";
  }

  if (normalizedNickname) {
    if (normalizedNickname.length < 3 || normalizedNickname.length > 32) {
      return "昵称长度需为 3-32 位";
    }

    if (/^1\d{10}$/.test(normalizedNickname) || isEmail(normalizedNickname)) {
      return "昵称不能是手机号或邮箱";
    }

    if (/^\d+$/.test(normalizedNickname)) {
      return "昵称不能为纯数字";
    }

    if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(normalizedNickname)) {
      return "昵称不能包含中文";
    }
  }

  if (!password.value) {
    return "请输入密码";
  }

  if (password.value.length < 8 || password.value.length > 16) {
    return "密码长度需为 8-16 位";
  }

  if (passwordConfirm.value !== password.value) {
    return "两次输入的密码不一致";
  }

  if (!captcha.value || captcha.value.length !== 4) {
    return "请输入 4 位验证码";
  }

  return "";
}

async function submitRegister() {
  const errorMessage = validateRegisterForm();

  if (errorMessage) {
    uni.showToast({
      title: errorMessage,
      icon: "none",
    });
    return;
  }

  if (submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    const result = await registerUser({
      username: username.value.trim(),
      nickname: nickname.value.trim(),
      password: password.value,
      password2: passwordConfirm.value,
      captcha: captcha.value,
    });

    mutations.loginSuccess({
      ...result,
      autoBack: false,
    });

    uni.reLaunch({
      url: ROUTES.entry,
    });
  } catch (error) {
    console.error("custom register failed", error);
    registerFormCardRef.value?.refreshCaptcha();
  } finally {
    submitting.value = false;
  }
}

function goLogin() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({
        url: ROUTES.login,
      });
    },
  });
}
</script>

<style>
.page {
  position: relative;
  min-height: 100vh;
  padding: 112rpx 34rpx 80rpx;
  overflow: hidden;
  background:
    linear-gradient(180deg, #4b5c45 0%, #677b61 34%, #eef1e7 34%, #f7f5ef 100%);
}

.bg-glow {
  position: absolute;
  width: 360rpx;
  height: 360rpx;
  border-radius: 50%;
  filter: blur(18rpx);
  opacity: 0.22;
}

.bg-glow-left {
  top: 30rpx;
  left: -80rpx;
  background: #d5e2b9;
}

.bg-glow-right {
  top: 180rpx;
  right: -110rpx;
  background: #f6dca8;
}
</style>
