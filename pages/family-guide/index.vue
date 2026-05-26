<template>
  <view class="page">
    <guide-hero />
    <view class="card">
      <guide-actions
        @create-family="handleCreateFamily"
        @join-family="handleJoinFamily"
        @skip="handleSkip"
      />

      <view v-if="showJoinForm" class="join-card">
        <text class="join-label">家庭邀请码</text>
        <input
          class="join-input"
          :value="inviteCode"
          maxlength="8"
          placeholder="请输入邀请码"
          @input="handleInviteCodeInput"
        />
        <text class="join-hint">输入有效邀请码后，你会直接加入对应家庭。</text>
        <view class="join-actions">
          <button class="join-submit" type="primary" :loading="joining" @click="submitJoinFamily">
            确认加入
          </button>
          <button class="join-cancel" :disabled="joining" @click="cancelJoinFamily">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
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

  uni.reLaunch({
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
      uni.reLaunch({
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

<style>
.page {
  min-height: 100vh;
  padding: 88rpx 36rpx 80rpx;
  background: linear-gradient(180deg, #f5f3ee 0%, #ffffff 50%, #f2eee6 100%);
}

.card {
  margin-top: 48rpx;
  padding: 40rpx 30rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20rpx 48rpx rgba(43, 49, 43, 0.08);
}

.join-card {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 2rpx solid #edf0e8;
}

.join-label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #314033;
}

.join-input {
  margin-top: 18rpx;
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 20rpx;
  background: #f2f5ef;
  font-size: 30rpx;
  color: #243126;
}

.join-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #6d796d;
}

.join-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 28rpx;
}

.join-submit,
.join-cancel {
  flex: 1;
  border-radius: 999rpx;
}

.join-cancel {
  background: #edf1ea;
  color: #314033;
}
</style>
