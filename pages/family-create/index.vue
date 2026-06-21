<template>
  <view class="page">
    <view class="page-bg noise-texture"></view>

    <!-- 导航栏（绿色 Hero 上） -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">
        <svg viewBox="0 0 24 24" class="nav-back-icon">
          <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
      <text class="nav-title">创建家庭</text>
      <view class="nav-placeholder"></view>
    </view>

    <template v-if="step === 'editing'">
      <!-- Hero 区 -->
      <view class="hero fade-up-delay-1">
        <ScopeBadge text="Family · 创建" />
        <text class="hero-title">创建家庭</text>
        <text class="hero-desc">为家庭起一个名字。创建成功后将自动生成邀请码。</text>
      </view>

      <!-- 表单区 -->
      <view class="form-body">
        <family-create-form
          v-model="familyName"
          v-model:description="familyDescription"
          :loading="submitting"
          @submit="handleSubmit"
        />
      </view>

      <!-- 底部固定栏 -->
      <view class="bottom-bar">
        <button class="submit-btn" :loading="submitting" @click="handleSubmit">
          创建家庭
        </button>
      </view>
    </template>

    <!-- 成功态 -->
    <view v-else class="success-wrap fade-up-delay-1">
      <view class="success-card">
        <text class="success-label">Preview · 家庭预览</text>
        <text class="success-name">{{ createdFamilyName }}</text>

        <view class="success-row">
          <text class="success-key">Creator</text>
          <text class="success-val">{{ creatorText }}</text>
        </view>
        <view class="success-row">
          <text class="success-key">Invite Code</text>
          <text class="success-val code" @click="copyInviteCode">{{ createdInviteCode || '—' }}</text>
        </view>
        <view class="success-row">
          <text class="success-key">Members</text>
          <text class="success-val">1 人（创建后可邀请）</text>
        </view>
      </view>

      <view class="success-actions">
        <button class="primary-action" @click="copyInviteCode">复制邀请码</button>
        <button class="secondary-action" @click="enterHome">进入首页</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { getCurrentSession } from "@/common/services/auth.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { createFamily } from "@/common/api/modules/family.js";
import { ROUTES } from "@/common/constants/routes.js";
import { clearFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import ScopeBadge from "@/components/ScopeBadge.vue";
import FamilyCreateForm from "./components/FamilyCreateForm.vue";

const familyName = ref("");
const familyDescription = ref("");
const submitting = ref(false);
const step = ref("editing");
const createdFamilyName = ref("");
const createdInviteCode = ref("");
const creatorText = ref("我 · Admin");

async function loadCreator() {
  try {
    const session = getCurrentSession();
    if (!session.uid) return;
    const info = await getCurrentUserInfo(session.uid);
    if (info?.nickname || info?.username) {
      creatorText.value = `${info.nickname || info.username} · Admin`;
    }
  } catch (e) {
    // 静默失败
  }
}

loadCreator();

async function handleSubmit() {
  const normalizedName = familyName.value.trim();

  if (!normalizedName) {
    uni.showToast({
      title: "请输入家庭名称",
      icon: "none",
    });
    return;
  }

  if (normalizedName.length < 2) {
    uni.showToast({
      title: "家庭名称至少 2 个字",
      icon: "none",
    });
    return;
  }

  if (submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    const payload = { name: normalizedName };
    if (familyDescription.value.trim()) {
      payload.description = familyDescription.value.trim();
    }

    const result = await createFamily(payload);

    const session = getCurrentSession();
    if (session.uid) {
      clearFamilyGuideSkipState(session.uid);
    }

    createdFamilyName.value = result?.family?.name || normalizedName;
    createdInviteCode.value = result?.family?.invite_code || "";
    step.value = "success";
  } catch (error) {
    console.error("createFamily failed", error);
    uni.showToast({
      title: error?.message || "创建家庭失败",
      icon: "none",
    });
  } finally {
    submitting.value = false;
  }
}

function copyInviteCode() {
  if (!createdInviteCode.value) {
    uni.showToast({
      title: "邀请码暂不可用",
      icon: "none",
    });
    return;
  }

  uni.setClipboardData({
    data: createdInviteCode.value,
    success: () => {
      uni.showToast({
        title: "邀请码已复制",
        icon: "success",
      });
    },
  });
}

function enterHome() {
  uni.switchTab({
    url: ROUTES.home,
  });
}

function goBack() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({
        url: ROUTES.familyGuide,
      });
    },
  });
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  padding-top: 96px;
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

/* 导航栏 */
.navbar {
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 32px;
}

.nav-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: $color-text-inverse;
  transition: all 0.25s ease;
}

.nav-back:hover,
.nav-back:active {
  background: rgba(255, 255, 255, 0.2);
}

.nav-back-icon {
  width: 18px;
  height: 18px;
}

.nav-title {
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 600;
  color: $color-text-inverse;
}

.nav-placeholder {
  width: 32px;
}

/* Hero 区 */
.hero {
  position: relative;
  z-index: 2;
  padding: 0 28px 24px;
  color: $color-text-inverse;
}

.hero-title {
  display: block;
  margin-top: 18rpx;
  margin-bottom: 20rpx;
  font-family: $font-serif;
  font-size: 56rpx;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -1rpx;
  color: $color-text-inverse;
}

.hero-desc {
  display: block;
  font-family: $font-sans;
  font-size: 26rpx;
  line-height: 1.7;
  color: $inverse-50;
  max-width: 560rpx;
}

/* 表单区 */
.form-body {
  position: relative;
  z-index: 2;
  padding: 24px 28px 130px;
}

/* 底部固定栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 28px 36px;
  background: $gradient-bottom-bar;
  z-index: 30;
}

.submit-btn {
  width: 100%;
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

/* 成功态 */
.success-wrap {
  position: relative;
  z-index: 2;
  padding: 24px 28px 60px;
}

.success-card {
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  padding: 44rpx;
}

.success-label {
  display: block;
  font-family: $font-mono;
  font-size: 18rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-terra;
  margin-bottom: 16rpx;
}

.success-name {
  display: block;
  font-family: $font-serif;
  font-size: 40rpx;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 28rpx;
  letter-spacing: -0.6rpx;
}

.success-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 20rpx 0;
  border-top: 1px solid $color-border-soft;
}

.success-key {
  font-family: $font-mono;
  font-size: 18rpx;
  letter-spacing: 3rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.success-val {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 500;
  color: $color-primary-dark;
}

.success-val.code {
  font-family: $font-mono;
  font-size: 26rpx;
  letter-spacing: 4rpx;
  color: $color-terra;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 36rpx;
}

.primary-action,
.secondary-action {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: $radius-btn;
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.primary-action::after,
.secondary-action::after {
  border: none;
}

.primary-action {
  background: $color-primary;
  color: $color-text-inverse;
}

.secondary-action {
  background: $color-bg-chip;
  color: $color-primary-dark;
}
</style>
