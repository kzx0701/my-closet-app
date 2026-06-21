<!--
  登录页 - 极简留白型
  参考产品：喜茶GO（纯直角设计语言、微圆角按钮、不对称版式、时尚极致）
  设计特点：纵向渐变背景 + 左对齐品牌区 + 插画 + 底部操作区
-->
<template>
  <view class="design-a">
    <view class="a-bg"></view>
    <view class="a-bg-noise noise-texture"></view>

    <view class="a-back" :style="{ top: statusBarHeight + 16 + 'px' }" @click="$emit('back')">
      <view class="a-back-arrow"></view>
    </view>

    <view class="a-header" :style="{ paddingTop: statusBarHeight + 40 + 'px' }">
      <view class="a-brand-mark">
        <view class="a-brand-dot"></view>
        <text class="a-brand-mark-text">SEASON · CLOSET</text>
      </view>
      <text class="a-title-en">Season Closet</text>
      <view class="a-title-cn-row">
        <text class="a-title-cn">四季</text>
        <text class="a-title-cn em">衣橱</text>
      </view>
      <view class="a-divider"></view>
    </view>

    <!-- 中部插画区 -->
    <view class="a-illustration">
      <view class="a-quote-area">
        <text class="a-quote-mark">"</text>
        <text class="a-quote-text">为每一件衣物，找到归属</text>
        <text class="a-quote-mark closing">"</text>
      </view>

      <image class="a-illust-img" :src="seasonImage" mode="aspectFit" />
    </view>

    <view class="a-action">
      <view class="a-mode-tabs">
        <view
          class="a-mode-tab"
          :class="{ active: mode === 'wechat' }"
          @click="$emit('switch-mode', 'wechat')"
        >
          <uni-icons class="a-tab-icon" type="weixin" :color="mode === 'wechat' ? '#f4efe6' : 'rgba(244,239,230,0.55)'" size="16" />
          <text class="a-tab-text">微信登录</text>
        </view>
        <view
          class="a-mode-tab"
          :class="{ active: mode === 'account' }"
          @click="$emit('switch-mode', 'account')"
        >
          <uni-icons class="a-tab-icon" type="person" :color="mode === 'account' ? '#f4efe6' : 'rgba(244,239,230,0.55)'" size="16" />
          <text class="a-tab-text">账号登录</text>
        </view>
        <view class="a-tab-indicator" :style="{ transform: mode === 'wechat' ? 'translateX(0)' : 'translateX(100%)' }"></view>
      </view>

      <view class="a-panel-wrap">
        <view class="a-login-panel" :class="{ 'panel-active': mode === 'wechat' }">
          <view class="a-wechat-group">
            <button class="a-wx-btn" :loading="wxLoading" :disabled="wxLoading" @click="$emit('wechat-login')">
              <uni-icons class="a-wx-icon" type="weixin" color="#fff" size="22" />
              微信登录
            </button>

            <view class="a-agreement" :class="{ shake: agreementShake }">
              <view class="a-check" :class="{ checked: agreed }" @click="$emit('toggle-agree')">
                <view v-if="agreed" class="a-check-mark"></view>
              </view>
              <text class="a-agreement-text">我已阅读并同意<text class="a-link">《用户协议》</text>和<text class="a-link">《隐私政策》</text></text>
            </view>
          </view>
        </view>

        <view class="a-login-panel" :class="{ 'panel-active': mode === 'account' }">
          <view class="a-form-card">
            <view class="a-input-row" :class="{ focused: usernameFocused }">
              <view class="a-input-icon a-icon-user"></view>
              <input
                :value="username"
                class="a-card-input"
                type="text"
                placeholder="用户名 / 手机号 / 邮箱"
                placeholder-style="color: rgba(244,239,230,0.35); font-size: 28rpx; font-weight: 400;"
                @focus="usernameFocused = true"
                @blur="usernameFocused = false"
                @input="$emit('update:username', $event.detail.value)"
              />
            </view>

            <view class="a-input-row" :class="{ focused: passwordFocused }">
              <view class="a-input-icon a-icon-lock"></view>
              <input
                :value="password"
                class="a-card-input"
                :password="true"
                placeholder="请输入密码"
                placeholder-style="color: rgba(244,239,230,0.35); font-size: 28rpx; font-weight: 400;"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
                @input="$emit('update:password', $event.detail.value)"
              />
            </view>

            <button class="a-login-btn" :loading="submitting" :disabled="submitting" @click="$emit('account-login')">
              登录
            </button>

            <view class="a-form-links">
              <text class="a-link-btn" @click="$emit('go-register')">注册新账号</text>
              <view class="a-link-divider"></view>
              <text class="a-link-btn" @click="$emit('go-forgot')">忘记密码</text>
            </view>
          </view>

          <view class="a-agreement" :class="{ shake: agreementShake }">
            <view class="a-check" :class="{ checked: agreed }" @click="$emit('toggle-agree')">
              <view v-if="agreed" class="a-check-mark"></view>
            </view>
            <text class="a-agreement-text">我已阅读并同意<text class="a-link">《用户协议》</text>和<text class="a-link">《隐私政策》</text></text>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const SEASON_IMAGES = {
  spring: "/static/images/weather/spring.png",
  summer: "/static/images/weather/summer.png",
  autumn: "/static/images/weather/autumn.png",
  winter: "/static/images/weather/winter.png",
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

const seasonImage = computed(() => SEASON_IMAGES[getCurrentSeason()]);

defineProps({
  statusBarHeight: { type: Number, default: 44 },
  mode: { type: String, default: "wechat" },
  agreed: { type: Boolean, default: false },
  agreementShake: { type: Boolean, default: false },
  wxLoading: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
});

defineEmits([
  "back", "toggle-agree", "wechat-login", "switch-mode",
  "account-login", "go-register", "go-forgot",
  "update:username", "update:password",
]);

const usernameFocused = ref(false);
const passwordFocused = ref(false);
</script>

<style lang="scss" scoped>
.design-a {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $color-primary-dark;
}

.a-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(180deg,
    $color-primary-dark 0%,
    $color-primary 35%,
    $color-primary-soft 60%,
    $color-sage 80%,
    $color-sage-light 100%
  );
}

.a-bg-noise {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  opacity: 0.04;
  pointer-events: none;
}

.a-back {
  position: absolute;
  left: 28rpx;
  width: 64rpx; height: 64rpx;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: rgba(244,239,230,0.1);
  border: 1px solid rgba(244,239,230,0.15);
  z-index: 10;
  transition: all 0.25s ease;
}
.a-back:active { background: rgba(244,239,230,0.2); transform: scale(0.95); }
.a-back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 3rpx solid rgba(244,239,230,0.85);
  border-bottom: 3rpx solid rgba(244,239,230,0.85);
  transform: rotate(45deg);
  margin-left: 6rpx;
}

.a-header {
  position: relative;
  z-index: 2;
  padding-left: 56rpx;
  padding-right: 56rpx;
  animation: fadeUp 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.1s both;
}

.a-brand-mark {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28rpx;
}
.a-brand-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: $color-terra-soft;
  animation: pulseDot 2.5s ease-in-out infinite;
}
.a-brand-mark-text {
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 3px;
  color: $inverse-55;
  font-weight: 500;
}

.a-title-en {
  display: block;
  font-family: $font-serif;
  font-size: 56rpx;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1rpx;
  color: $color-text-inverse;
  margin-bottom: 8rpx;
}

.a-title-cn-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  margin-bottom: 24rpx;
}
.a-title-cn {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 400;
  letter-spacing: 2rpx;
  color: $inverse-85;
}
.a-title-cn.em {
  transform: skewX(-8deg);
  transform-origin: left center;
  font-weight: 300;
  color: $color-sage-light;
}

.a-divider {
  width: 60rpx;
  height: 1px;
  background: rgba(244,239,230,0.25);
  margin-bottom: 20rpx;
}

.a-welcome {
  display: block;
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 500;
  color: $inverse-85;
  letter-spacing: 1rpx;
}

/* 中部插画区 + 登录方式切换 Tabs */
.a-illustration { padding-bottom: 20rpx; }
.a-illustration {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24rpx 56rpx 0;
  animation: fadeIn 1s ease 0.4s both;
}

.a-quote-area {
  display: flex;
  align-items: flex-start;
  gap: 4rpx;
  margin-bottom: 20rpx;
  animation: fadeUp 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.5s both;
}

.a-illust-img {
  width: 100%;
  display: block;
  animation: fadeUp 1s cubic-bezier(0.2,0.8,0.2,1) 0.6s both;
}
.a-quote-mark {
  font-family: $font-serif;
  font-size: 48rpx;
  font-weight: 300;
  color: rgba(212,128,95,0.4);
  line-height: 1;
  margin-top: -8rpx;
}
.a-quote-mark.closing {
  margin-top: 0;
  align-self: flex-end;
}
.a-quote-text {
  font-family: $font-serif;
  font-size: 32rpx;
  font-weight: 300;
  color: $inverse-85;
  letter-spacing: 2rpx;
  line-height: 1.5;
}

.a-mode-tabs {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380rpx;
  height: 68rpx;
  margin: 16rpx auto 0;
  background: rgba(244,239,230,0.08);
  border: 1px solid rgba(244,239,230,0.14);
  border-radius: $radius-pill;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
  animation: fadeUp 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.7s both;
}
.a-mode-tab {
  position: relative;
  z-index: 2;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  transition: color 0.25s ease;
}
.a-mode-tab.active .a-tab-text { color: $color-text-inverse; font-weight: 600; }
.a-mode-tab.active .a-tab-icon {
  color: $color-text-inverse;
}

.a-tab-text {
  font-family: $font-sans;
  font-size: 26rpx;
  color: $inverse-55;
  transition: color 0.25s ease;
}

.a-tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28rpx;
  height: 28rpx;
}

.a-tab-indicator {
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  width: calc(50% - 4rpx);
  height: calc(100% - 8rpx);
  background: $color-terra-soft;
  border-radius: $radius-pill;
  box-shadow: 0 4px 12px rgba(212,128,95,0.35);
  transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1);
  z-index: 1;
}

.a-action {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20rpx;
  position: relative;
  z-index: 2;
  padding: 0 56rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  animation: fadeUp 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.3s both;
}
.a-panel-wrap {
  position: relative;
  flex: 1;
  min-height: 260rpx;
}
.a-login-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transform: translateY(16rpx) scale(0.98);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.2,0.8,0.2,1);
}
.a-login-panel.panel-active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
  z-index: 2;
}
.a-wechat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220rpx;
}
.a-wx-btn,
.a-login-btn {
  width: 100%;
}

.a-agreement {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12rpx;
  margin-top: 24rpx;
  margin-bottom: 0;
}
.a-agreement.shake { animation: shake 0.4s ease; }
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8rpx); }
  40% { transform: translateX(8rpx); }
  60% { transform: translateX(-6rpx); }
  80% { transform: translateX(6rpx); }
}

.a-check {
  width: 32rpx; height: 32rpx;
  border-radius: 50%;
  border: 2px solid rgba(244,239,230,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 2rpx;
  transition: all 0.2s ease;
}
.a-check.checked { background: $color-terra-soft; border-color: $color-terra-soft; }
.a-check-mark {
  width: 12rpx;
  height: 7rpx;
  border-left: 3rpx solid $color-text-inverse;
  border-bottom: 3rpx solid $color-text-inverse;
  transform: rotate(-45deg);
  margin-top: -2rpx;
}

.a-agreement-text {
  font-family: $font-sans;
  font-size: 22rpx;
  line-height: 1.6;
  color: $inverse-55;
}
.a-link { color: $color-terra-soft; }

.a-wx-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: $radius-btn;
  background: rgba(7,193,96,0.9);
  color: $color-text-inverse;
  border: none;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  box-shadow: 0 6px 18px rgba(7,193,96,0.22);
  transition: all 0.2s ease;
}
.a-wx-btn:active { transform: scale(0.98); opacity: 0.9; }
.a-wx-btn::after { border: none; }
.a-wx-btn[disabled] { opacity: 0.5; }
.a-wx-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  flex-shrink: 0;
}

/* 账号密码登录 — 卡片化表单 */
.a-form-card {
  background: rgba(244,239,230,0.06);
  border: 1px solid rgba(244,239,230,0.12);
  border-radius: 24rpx;
  padding: 40rpx 36rpx 36rpx;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  backdrop-filter: blur(6rpx);
}

.a-input-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  height: 88rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  background: rgba(244,239,230,0.05);
  border: 1px solid rgba(244,239,230,0.12);
  border-radius: 16rpx;
  transition: all 0.25s cubic-bezier(0.2,0.8,0.2,1);
}
.a-input-row:last-of-type { margin-bottom: 32rpx; }
.a-input-row.focused {
  background: rgba(244,239,230,0.1);
  border-color: rgba(212,128,95,0.55);
  box-shadow: 0 0 0 3rpx rgba(212,128,95,0.12);
}

.a-input-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
  position: relative;
}
.a-icon-user::before {
  content: '';
  position: absolute;
  top: 2rpx;
  left: 8rpx;
  width: 16rpx;
  height: 16rpx;
  border: 2rpx solid rgba(244,239,230,0.5);
  border-radius: 50%;
}
.a-icon-user::after {
  content: '';
  position: absolute;
  bottom: 2rpx;
  left: 4rpx;
  width: 24rpx;
  height: 12rpx;
  border: 2rpx solid rgba(244,239,230,0.5);
  border-radius: 12rpx 12rpx 0 0;
  border-bottom: none;
}
.a-icon-lock::before {
  content: '';
  position: absolute;
  top: 8rpx;
  left: 6rpx;
  width: 20rpx;
  height: 16rpx;
  border: 2rpx solid rgba(244,239,230,0.5);
  border-radius: 4rpx;
  background: transparent;
}
.a-icon-lock::after {
  content: '';
  position: absolute;
  top: 0;
  left: 12rpx;
  width: 8rpx;
  height: 12rpx;
  border: 2rpx solid rgba(244,239,230,0.5);
  border-bottom: none;
  border-radius: 6rpx 6rpx 0 0;
}

.a-card-input {
  flex: 1;
  height: 100%;
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 500;
  color: rgba(244,239,230,0.95);
  background: transparent;
  border: none;
}

.a-form-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-top: 28rpx;
}
.a-link-btn {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 500;
  color: rgba(244,239,230,0.65);
  transition: all 0.2s ease;
}
.a-link-btn:active { color: $color-terra-soft; }
.a-link-divider {
  width: 1px;
  height: 20rpx;
  background: rgba(244,239,230,0.2);
}

.a-login-btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: $radius-btn;
  background: $color-terra-soft;
  color: $color-text-inverse;
  border: none;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  letter-spacing: 3rpx;
  box-shadow: 0 6px 18px rgba(212,128,95,0.26);
  transition: all 0.2s ease;
}
.a-login-btn:active { transform: scale(0.98); opacity: 0.9; }
.a-login-btn::after { border: none; }
.a-login-btn[disabled] { opacity: 0.5; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>