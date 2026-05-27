<template>
  <view class="page">
    <view v-if="step === 'editing'" class="hero">
      <text class="eyebrow">家庭协作</text>
      <text class="title">先创建一个家庭</text>
      <text class="desc">
        创建成功后，你会自动成为管理员。我们会先给你一个邀请码，方便你把家人邀请进来，再一起管理衣橱。
      </text>
    </view>

    <family-create-form
      v-if="step === 'editing'"
      v-model="familyName"
      :loading="submitting"
      :suggestions="nameSuggestions"
      :helper-text="helperText"
      @pick-suggestion="applySuggestion"
      @submit="handleSubmit"
    />

    <view v-else class="success-card">
      <text class="success-eyebrow">创建成功</text>
      <text class="success-title">{{ createdFamilyName }}</text>
      <text class="success-desc">
        你的家庭已经准备好了。现在可以先复制邀请码发给家人，之后再进入首页继续。
      </text>

      <view class="invite-card">
        <text class="invite-label">家庭邀请码</text>
        <text class="invite-code">{{ createdInviteCode }}</text>
        <text class="invite-hint">邀请码可用于家人在“加入家庭”流程中直接加入。</text>
      </view>

      <view class="next-card">
        <text class="next-title">接下来你可以</text>
        <text class="next-item">把邀请码发给家人，邀请他们加入同一个家庭空间</text>
        <text class="next-item">先进入首页，以管理员身份继续后续设置</text>
      </view>

      <button class="primary-action" type="primary" @click="copyInviteCode">复制邀请码</button>
      <button class="secondary-action" @click="enterHome">进入首页</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { getCurrentSession } from "@/common/services/auth.js";
import { createFamily } from "@/common/api/modules/family.js";
import { ROUTES } from "@/common/constants/routes.js";
import { clearFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import FamilyCreateForm from "./components/FamilyCreateForm.vue";

const NAME_SUGGESTIONS = ["温馨一家", "四季衣橱", "我们的家", "小家收纳站"];

const familyName = ref("");
const submitting = ref(false);
const step = ref("editing");
const createdFamilyName = ref("");
const createdInviteCode = ref("");
const nameSuggestions = ref(NAME_SUGGESTIONS);

const helperText = computed(() => {
  const normalizedName = familyName.value.trim();

  if (!normalizedName) {
    return "建议用一个全家人都容易识别的名称，比如家庭昵称、住处名或收纳主题。";
  }

  if (normalizedName.length < 2) {
    return "名称再具体一点会更好，方便家人快速识别。";
  }

  if (normalizedName.length > 24) {
    return "名称有点长，适当精简后在家庭列表里会更清晰。";
  }

  return "这个名称看起来不错，创建后你还会拿到一个可分享的邀请码。";
});

function applySuggestion(name) {
  familyName.value = name;
}

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
    const result = await createFamily({
      name: normalizedName,
    });

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
</script>

<style>
.page {
  min-height: 100vh;
  padding: 88rpx 32rpx 80rpx;
  background: linear-gradient(180deg, #f4f1e8 0%, #ffffff 55%, #f0ebe0 100%);
}

.hero {
  margin-bottom: 36rpx;
}

.eyebrow {
  display: block;
  font-size: 24rpx;
  letter-spacing: 4rpx;
  color: #7d876f;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #2a352b;
}

.desc {
  display: block;
  margin-top: 18rpx;
  font-size: 28rpx;
  line-height: 1.7;
  color: #627061;
}

.success-card {
  padding: 42rpx 34rpx 38rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20rpx 48rpx rgba(47, 56, 47, 0.1);
}

.success-eyebrow {
  display: block;
  font-size: 24rpx;
  letter-spacing: 4rpx;
  color: #7d876f;
}

.success-title {
  display: block;
  margin-top: 16rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #263225;
}

.success-desc {
  display: block;
  margin-top: 18rpx;
  font-size: 28rpx;
  line-height: 1.7;
  color: #5d695b;
}

.invite-card,
.next-card {
  margin-top: 30rpx;
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: #f7f5ef;
}

.invite-label,
.next-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #4b5648;
}

.invite-code {
  display: block;
  margin-top: 20rpx;
  font-size: 52rpx;
  font-weight: 700;
  letter-spacing: 6rpx;
  color: #2d3a2f;
}

.invite-hint,
.next-item {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #667062;
}

.primary-action,
.secondary-action {
  margin-top: 30rpx;
  border-radius: 999rpx;
}

.secondary-action {
  margin-top: 20rpx;
  background: #edf1ea;
  color: #314033;
}
</style>
