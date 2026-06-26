<template>
  <view class="login-page">
    <LoginDesignA
      :statusBarHeight="statusBarHeight"
      :mode="loginMode"
      :agreed="agreed"
      :agreementShake="agreementShake"
      :wxLoading="wxLoading"
      :submitting="submitting"
      :username="username"
      :password="password"
      @back="goBack"
      @toggle-agree="toggleAgree"
      @wechat-login="loginByWeixin"
      @switch-mode="switchMode"
      @account-login="submitLogin"
      @go-register="goRegister"
      @go-forgot="goForgot"
      @update:username="username = $event"
      @update:password="password = $event"
    />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";
import { ROUTES } from "@/common/constants/routes.js";
import { login } from "@/common/api/modules/auth.js";
import LoginDesignA from "./components/LoginDesignA.vue";

// ===== 共享状态 =====
const username = ref("");
const password = ref("");
const submitting = ref(false);
const wxLoading = ref(false);
const uniIdRedirectUrl = ref("");
const statusBarHeight = ref(44);
const loginMode = ref("wechat");
const agreed = ref(false);
const agreementShake = ref(false);

onLoad((query) => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 44;
  } catch (e) {
    statusBarHeight.value = 44;
  }

  if (query?.uniIdRedirectUrl) {
    uniIdRedirectUrl.value = decodeURIComponent(query.uniIdRedirectUrl);
  }
});

// ===== 事件处理 =====
function toggleAgree() {
  agreed.value = !agreed.value;
}

function switchMode(mode) {
  loginMode.value = mode;
}

function checkAgreement() {
  if (!agreed.value) {
    uni.showToast({
      title: "请先同意用户协议和隐私政策",
      icon: "none",
    });
    agreementShake.value = true;
    setTimeout(() => {
      agreementShake.value = false;
    }, 500);
    return false;
  }
  return true;
}

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
    uni.showToast({ title: "请输入账号", icon: "none" });
    return;
  }

  if (!password.value) {
    uni.showToast({ title: "请输入密码", icon: "none" });
    return;
  }

  if (!checkAgreement()) return;

  if (submitting.value) return;
  submitting.value = true;

  try {
    const result = await login(buildLoginPayload());

    mutations.loginSuccess({
      ...result,
      autoBack: false,
      uniIdRedirectUrl: uniIdRedirectUrl.value,
    });

    if (uniIdRedirectUrl.value) {
      uni.reLaunch({ url: uniIdRedirectUrl.value });
    } else {
      uni.navigateBack({
        fail() {
          uni.switchTab({ url: ROUTES.home });
        },
      });
    }
  } catch (error) {
    console.error("custom login failed", error);
    uni.showToast({ title: error?.message || "登录失败，请重试", icon: "none" });
  } finally {
    submitting.value = false;
  }
}

// ===== 微信一键登录 =====
async function loginByWeixin() {
  if (!checkAgreement()) return;
  if (wxLoading.value) return;

  wxLoading.value = true;

  try {
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });

    const code = loginRes.code;
    if (!code) {
      throw new Error("获取微信授权码失败");
    }

    const uniIdCo = uniCloud.importObject("uni-id-co", { customUI: true });
    const result = await uniIdCo.loginByWeixin({ code });

    mutations.loginSuccess({
      ...result,
      autoBack: false,
      uniIdRedirectUrl: uniIdRedirectUrl.value,
    });

    // 微信小程序登录后，尝试获取用户头像昵称并更新到数据库
    // #ifdef MP-WEIXIN
    await tryUpdateWeixinUserProfile(result.uid);
    // #endif

    if (uniIdRedirectUrl.value) {
      uni.reLaunch({ url: uniIdRedirectUrl.value });
    } else {
      uni.navigateBack({
        fail() {
          uni.switchTab({ url: ROUTES.home });
        },
      });
    }
  } catch (error) {
    console.error("weixin login failed", error);

    if (error?.errMsg?.includes("cancel") || error?.errMsg?.includes("deny")) {
      uni.showToast({ title: "已取消授权", icon: "none" });
    } else {
      uni.showToast({
        title: error?.message || "微信登录失败，请重试",
        icon: "none",
        duration: 3000,
      });
    }
  } finally {
    wxLoading.value = false;
  }
}

/**
 * 微信小程序登录后，尝试获取用户头像和昵称并更新到数据库。
 * 优先使用 getUserProfile（基础库 < 2.27.1 可用），
 * 失败则静默跳过，用户后续可在个人资料页手动设置。
 */
async function tryUpdateWeixinUserProfile(uid) {
  if (!uid) return;

  try {
    // 尝试通过 getUserProfile 获取用户信息
    const profileRes = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: "用于完善个人资料",
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });

    const { nickName, avatarUrl } = profileRes.userInfo || {};
    if (nickName || avatarUrl) {
      const userCo = uniCloud.importObject("user-co", { customUI: true });
      await userCo.updateMyProfile({
        nickname: nickName || undefined,
        avatarUrl: avatarUrl || undefined,
      });
    }
  } catch (e) {
    // getUserProfile 已废弃或用户拒绝，静默跳过
    console.log("getUserProfile skipped:", e?.errMsg || e);
  }
}

function goRegister() {
  uni.navigateTo({ url: ROUTES.register });
}

function goForgot() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/retrieve/retrieve",
    fail: () => {
      uni.showToast({ title: "找回密码页面暂不可用", icon: "none" });
    },
  });
}

function goBack() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({ url: ROUTES.entry });
    },
  });
}
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}
</style>
