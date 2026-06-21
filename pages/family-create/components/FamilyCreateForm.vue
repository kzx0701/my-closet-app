<template>
  <view class="form fade-up-delay-2">
    <text class="section-title">家庭名称</text>
    <input
      class="form-input"
      :value="modelValue"
      maxlength="30"
      placeholder="例如：林家小院"
      @input="handleNameInput"
    />

    <view class="section-title-row">
      <text class="section-title">家庭简介</text>
      <text class="section-hint">选填</text>
    </view>
    <textarea
      class="form-textarea"
      :value="description"
      maxlength="80"
      placeholder="一句话描述你的家庭"
      @input="handleDescInput"
    />

    <view class="section-title-row section-title-row-preview">
      <text class="section-title">预览</text>
      <text class="section-hint">创建后生效</text>
    </view>
    <view class="preview-card">
      <text class="preview-label">Preview · 家庭预览</text>
      <text class="preview-name">{{ previewName }}</text>

      <view class="preview-row">
        <text class="preview-key">Creator</text>
        <text class="preview-val">{{ creatorText }}</text>
      </view>
      <view class="preview-row">
        <text class="preview-key">Invite Code</text>
        <text class="preview-val code">创建后生成</text>
      </view>
      <view class="preview-row">
        <text class="preview-key">Members</text>
        <text class="preview-val">1 人（创建后可邀请）</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { getCurrentSession } from "@/common/services/auth.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:description", "submit"]);

const creatorText = ref("我 · Admin");

// 异步加载当前用户昵称用于预览
async function loadCreator() {
  try {
    const session = getCurrentSession();
    if (!session.uid) return;
    const info = await getCurrentUserInfo(session.uid);
    if (info?.nickname || info?.username) {
      creatorText.value = `${info.nickname || info.username} · Admin`;
    }
  } catch (e) {
    // 静默失败，保留默认值
  }
}

loadCreator();

const previewName = computed(() => {
  const name = props.modelValue.trim();
  return name || "未命名家庭";
});

function handleNameInput(event) {
  emit("update:modelValue", event.detail.value);
}

function handleDescInput(event) {
  emit("update:description", event.detail.value);
}
</script>

<style lang="scss" scoped>
.form {
  position: relative;
  z-index: 2;
}

.section-title {
  display: block;
  font-family: $font-mono;
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 24rpx;
  margin-top: 36rpx;
}

.form .section-title:first-child {
  margin-top: 0;
}

.section-title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 36rpx;
  margin-bottom: 24rpx;
}

.section-title-row-preview {
  margin-top: 48rpx;
}

.section-title-row .section-title {
  margin: 0;
}

.section-hint {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
}

.form-input {
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-input;
  font-family: $font-serif;
  font-size: 30rpx;
  color: $color-text-title;
}

.form-textarea {
  width: 100%;
  min-height: 140rpx;
  padding: 22rpx 28rpx;
  border-radius: $radius-md;
  background: $color-bg-input;
  font-family: $font-sans;
  font-size: 26rpx;
  line-height: 1.6;
  color: $color-text-title;
  box-sizing: border-box;
}

.preview-card {
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  padding: 44rpx;
}

.preview-label {
  display: block;
  font-family: $font-mono;
  font-size: 18rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-terra;
  margin-bottom: 16rpx;
}

.preview-name {
  display: block;
  font-family: $font-serif;
  font-size: 40rpx;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 28rpx;
  letter-spacing: -0.6rpx;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 20rpx 0;
  border-top: 1px solid $color-border-soft;
}

.preview-key {
  font-family: $font-mono;
  font-size: 18rpx;
  letter-spacing: 3rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.preview-val {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 500;
  color: $color-primary-dark;
}

.preview-val.code {
  font-family: $font-mono;
  font-size: 26rpx;
  letter-spacing: 4rpx;
  color: $color-terra;
}
</style>
