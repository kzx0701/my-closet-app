<template>
  <view class="page noise-texture">
    <view class="back-btn" @click="goBack">
      <svg viewBox="0 0 24 24" class="back-icon">
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </view>

    <register-hero />

    <register-form-card
      v-model:username="username"
      v-model:nickname="nickname"
      v-model:password="password"
      v-model:passwordConfirm="passwordConfirm"
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

const username = ref("");
const nickname = ref("");
const password = ref("");
const passwordConfirm = ref("");
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

  if (normalizedUsername.length < 4 || normalizedUsername.length > 20) {
    return "用户名长度需为 4-20 位";
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
    if (normalizedNickname.length < 2 || normalizedNickname.length > 32) {
      return "昵称长度需为 2-32 位";
    }
  }

  if (!password.value) {
    return "请输入密码";
  }

  if (password.value.length < 6) {
    return "密码长度至少 6 位";
  }

  if (passwordConfirm.value !== password.value) {
    return "两次输入的密码不一致";
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
    uni.showToast({ title: error?.message || "注册失败，请重试", icon: "none" });
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

function goBack() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({
        url: ROUTES.entry,
      });
    },
  });
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  padding: 112rpx 56rpx 80rpx;
  overflow: hidden;
  background: $gradient-hero;
}

.back-btn {
  position: absolute;
  top: 112rpx;
  left: 28rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: $color-text-inverse;
  z-index: 10;
  transition: all 0.25s ease;
}

.back-btn:hover,
.back-btn:active {
  background: rgba(255, 255, 255, 0.2);
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
  opacity: 0.85;
}
</style>
