<template>
  <view class="page">
    <view class="page-bg noise-texture"></view>

    <!-- 顶部导航 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-back" @click="goBack">
        <view class="nav-back-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </view>
      </view>
      <text class="nav-title">家庭引导</text>
      <view class="nav-placeholder"></view>
    </view>

    <guide-hero />

    <guide-actions
      @create-family="handleCreateFamily"
      @join-family="handleJoinFamily"
      @skip="handleSkip"
    />

    <!-- 加入家庭邀请码弹层 -->
    <view v-if="showJoinForm" class="join-mask" @click="cancelJoinFamily">
      <view class="join-sheet" @click.stop>
        <view class="join-header">
          <text class="join-label">家庭邀请码</text>
          <text class="join-close" @click="cancelJoinFamily">×</text>
        </view>
        <input
          class="join-input"
          :value="inviteCode"
          maxlength="8"
          placeholder="请输入邀请码"
          @input="handleInviteCodeInput"
        />
        <text class="join-hint">输入有效邀请码后，你会直接加入对应家庭。</text>
        <view class="join-actions">
          <button class="join-cancel" :disabled="joining" @click="cancelJoinFamily">取消</button>
          <button class="join-submit" :loading="joining" @click="submitJoinFamily">
            确认加入
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getCurrentSession } from "@/common/services/auth.js";
import { joinFamilyByInviteCode } from "@/common/api/modules/family.js";
import { ROUTES } from "@/common/constants/routes.js";
import {
  clearFamilyGuideSkipState,
  setFamilyGuideSkipState,
} from "@/common/services/family-guide-state.js";
import GuideActions from "./components/GuideActions.vue";
import GuideHero from "./components/GuideHero.vue";

const showJoinForm = ref(false);
const inviteCode = ref("");
const joining = ref(false);
const statusBarHeight = ref(20);

function goBack() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({ url: ROUTES.home });
    },
  });
}

onLoad(() => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }
});

function handleCreateFamily() {
  uni.navigateTo({
    url: ROUTES.familyCreate,
  });
}

function handleJoinFamily() {
  showJoinForm.value = true;
}

function handleSkip() {
  const session = getCurrentSession();

  if (session.uid) {
    setFamilyGuideSkipState(session.uid, true);
  }

  uni.switchTab({
    url: ROUTES.home,
  });
}

function handleInviteCodeInput(event) {
  inviteCode.value = String(event.detail.value || "").toUpperCase();
}

function cancelJoinFamily() {
  if (joining.value) {
    return;
  }

  showJoinForm.value = false;
  inviteCode.value = "";
}

async function submitJoinFamily() {
  const normalizedInviteCode = inviteCode.value.trim().toUpperCase();

  if (!normalizedInviteCode) {
    uni.showToast({
      title: "请输入邀请码",
      icon: "none",
    });
    return;
  }

  if (joining.value) {
    return;
  }

  joining.value = true;

  try {
    await joinFamilyByInviteCode({
      inviteCode: normalizedInviteCode,
    });

    const session = getCurrentSession();
    if (session.uid) {
      clearFamilyGuideSkipState(session.uid);
    }

    uni.showToast({
      title: "加入家庭成功",
      icon: "success",
    });

    setTimeout(() => {
      uni.switchTab({
        url: ROUTES.home,
      });
    }, 300);
  } catch (error) {
    console.error("joinFamilyByInviteCode failed", error);
    uni.showToast({
      title: error?.message || "加入家庭失败",
      icon: "none",
    });
  } finally {
    joining.value = false;
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: $color-bg-page;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  z-index: 0;
  background: $gradient-hero;
}

/* 自定义导航栏 */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 28rpx;
  padding-right: 28rpx;
  padding-bottom: 16rpx;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-inverse;
}

.nav-back-icon svg {
  width: 32rpx;
  height: 32rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
}

.nav-placeholder {
  width: 64rpx;
}

/* 加入家庭弹层 */
.join-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.join-sheet {
  width: 100%;
  padding: 32rpx 36rpx 72rpx;
  background: $color-bg-card-end;
  border-radius: 36rpx 36rpx 0 0;
  animation: fadeUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.join-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.join-label {
  font-family: $font-serif;
  font-size: 34rpx;
  font-weight: 600;
  color: $color-primary-dark;
}

.join-close {
  font-size: 44rpx;
  color: $color-text-placeholder;
  line-height: 1;
  padding: 0 12rpx;
}

.join-input {
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-input;
  font-family: $font-mono;
  font-size: 32rpx;
  letter-spacing: 4rpx;
  color: $color-text-title;
}

.join-hint {
  display: block;
  margin-top: 18rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  line-height: 1.7;
  color: $color-text-secondary;
}

.join-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 36rpx;
}

.join-submit,
.join-cancel {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: $radius-btn;
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.join-submit {
  background: $color-primary;
  color: $color-text-inverse;
}

.join-submit::after,
.join-cancel::after {
  border: none;
}

.join-cancel {
  background: $color-bg-chip;
  color: $color-primary-dark;
}
</style>
