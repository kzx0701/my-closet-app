<template>
  <view class="page">
    <view class="bg-glow bg-glow-left"></view>
    <view class="bg-glow bg-glow-right"></view>

    <login-hero />

    <login-form-card
      v-model:username="username"
      v-model:password="password"
      :loading="submitting"
      @submit="submitLogin"
      @register="goRegister"
    />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";
import { ROUTES } from "@/common/constants/routes.js";
import LoginFormCard from "./components/LoginFormCard.vue";
import LoginHero from "./components/LoginHero.vue";

const uniIdCo = uniCloud.importObject("uni-id-co", {
  errorOptions: {
    type: "toast",
  },
});

const username = ref("");
const password = ref("");
const submitting = ref(false);
const uniIdRedirectUrl = ref("");

onLoad((query) => {
  if (query?.uniIdRedirectUrl) {
    uniIdRedirectUrl.value = decodeURIComponent(query.uniIdRedirectUrl);
  }
});

function buildLoginPayload() {
  const account = username.value.trim();
  const payload = {
    password: password.value,
  };

  if (/^1\d{10}$/.test(account)) {
    payload.mobile = account;
    return payload;
  }

  if (/@/.test(account)) {
    payload.email = account;
    return payload;
  }

  payload.username = account;
  return payload;
}

async function submitLogin() {
  if (!username.value.trim()) {
    uni.showToast({
      title: "请输入账号",
      icon: "none",
    });
    return;
  }

  if (!password.value) {
    uni.showToast({
      title: "请输入密码",
      icon: "none",
    });
    return;
  }

  if (submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    const result = await uniIdCo.login(buildLoginPayload());

    mutations.loginSuccess({
      ...result,
      autoBack: false,
      uniIdRedirectUrl: uniIdRedirectUrl.value,
    });

    const nextUrl = uniIdRedirectUrl.value || ROUTES.entry;
    uni.reLaunch({
      url: nextUrl,
    });
  } catch (error) {
    console.error("custom login failed", error);
  } finally {
    submitting.value = false;
  }
}

function goRegister() {
  uni.navigateTo({
    url: ROUTES.register,
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
    linear-gradient(180deg, #465741 0%, #60745a 34%, #eef1e7 34%, #f7f5ef 100%);
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
