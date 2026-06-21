<template>
  <view class="actions">
    <view class="option fade-up-delay-2" @click="emit('create-family')">
      <text class="option-num">01</text>
      <view class="option-content">
        <text class="option-title">创建家庭</text>
        <text class="option-desc">新建一个家庭，自动生成邀请码，邀请家人加入。</text>
      </view>
      <view class="option-arrow">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
    </view>

    <view class="option fade-up-delay-3" @click="emit('join-family')">
      <text class="option-num">02</text>
      <view class="option-content">
        <text class="option-title">加入家庭</text>
        <text class="option-desc">输入家人分享的邀请码，加入已存在的家庭。</text>
      </view>
      <view class="option-arrow">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
    </view>

    <view class="skip fade-up-delay-4">
      <text class="skip-link" @click="emit('skip')">先跳过，使用个人模式</text>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(["create-family", "join-family", "skip"]);
</script>

<style lang="scss" scoped>
.actions {
  position: relative;
  z-index: 2;
  padding: 0 28px 60px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: all 0.25s ease;
}

.option:hover,
.option:active {
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: $shadow-card;
}

.option-num {
  font-family: $font-serif;
  font-size: 36px;
  font-weight: 300;
  color: $color-terra;
  line-height: 1;
  letter-spacing: -1px;
  flex-shrink: 0;
  width: 44px;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.option-title {
  font-family: $font-serif;
  font-size: 17px;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 4px;
}

.option-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
  line-height: 1.5;
}

.option-arrow {
  width: 16px;
  height: 16px;
  color: $color-text-placeholder;
  opacity: 0.4;
  flex-shrink: 0;
}

.option-arrow svg {
  width: 100%;
  height: 100%;
  display: block;
}

.skip {
  text-align: center;
  padding: 16px 0 0;
}

.skip-link {
  display: inline-block;
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 500;
  color: $color-text-placeholder;
  padding: 12px 24px;
  border-bottom: 1px solid $color-border;
  transition: color 0.2s ease;
}

.skip-link:active {
  opacity: 0.7;
}
</style>
