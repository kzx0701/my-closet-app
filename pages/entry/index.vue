<template>
  <view class="entry-page">
    <!-- 背景层 -->
    <view class="entry-bg"></view>
    <view class="entry-bg-noise noise-texture"></view>

    <!-- 装饰性 SVG 线条 -->
    <view class="entry-deco">
      <svg viewBox="0 0 375 812" preserveAspectRatio="none" class="entry-deco-svg">
        <path d="M 0 160 Q 187 110 375 160" fill="none" stroke="rgba(244,239,230,0.06)" stroke-width="1"/>
        <path d="M 0 220 Q 187 170 375 220" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
        <path d="M 0 580 Q 187 530 375 580" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
        <path d="M 0 640 Q 187 590 375 640" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
      </svg>
    </view>

    <!-- 顶部品牌标记 -->
    <view class="entry-topbar" :style="{ paddingTop: statusBarHeight + 20 + 'px' }">
      <view class="entry-mark">
        <view class="entry-mark-dot"></view>
        <text class="entry-mark-text">SEASON · CLOSET</text>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="entry-content">
      <!-- 品牌 Logo 图标 -->
      <view class="entry-logo-wrap">
        <view class="entry-logo">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <!-- 衣架 -->
            <path d="M24 6 C24 6 22 4 20 4 C18 4 16 6 16 6" />
            <line x1="24" y1="6" x2="24" y2="12" />
            <!-- 衣服轮廓 -->
            <path d="M24 12 L14 18 L8 16 L6 20 L14 24 L14 40 L34 40 L34 24 L42 20 L40 16 L34 18 Z" />
            <!-- 领口 -->
            <path d="M20 12 L24 18 L28 12" />
          </svg>
        </view>
        <!-- 光晕 -->
        <view class="entry-logo-glow"></view>
      </view>

      <!-- 英文大标题 -->
      <text class="entry-title-en">Season Closet</text>

      <!-- 中文标题 -->
      <view class="entry-title-cn-wrap">
        <text class="entry-title-cn">四季</text>
        <text class="entry-title-cn em">衣橱</text>
      </view>

      <!-- 分隔线 -->
      <view class="entry-divider"></view>

      <!-- 简要介绍 -->
      <text class="entry-intro">把每一件衣物都安顿好</text>
      <text class="entry-intro-sub">Your Personal Wardrobe Manager</text>
    </view>

    <!-- 底部区域 -->
    <view class="entry-loader-area">
      <!-- 正常加载 -->
      <template v-if="!showError">
        <text class="entry-loading-text">{{ loadingText }}</text>
        <view class="entry-progress-track">
          <view class="entry-progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </template>

      <!-- 错误状态 -->
      <template v-else>
        <text class="entry-error-text">连接服务失败，请检查网络</text>
        <view class="entry-retry-btn" hover-class="entry-retry-btn-hover" :hover-stay-time="100" @click="manualRetry">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          <text class="entry-retry-text">重试</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { ROUTE_TARGETS, ROUTES } from "@/common/constants/routes.js";
import { resolveLaunchTarget } from "@/common/services/session-router.js";
import { getCurrentSession } from "@/common/services/auth.js";

const isRouting = ref(false);
const progressPercent = ref(0);
const statusBarHeight = ref(44);
const showError = ref(false);

let progressTimer = null;
let retryTimer = null;
let retryCount = 0;
const MAX_AUTO_RETRIES = 3;

const loadingTexts = [
  "正在初始化...",
  "加载配置中...",
  "准备就绪",
];

const loadingText = computed(() => {
  if (progressPercent.value < 30) return loadingTexts[0];
  if (progressPercent.value < 70) return loadingTexts[1];
  return loadingTexts[2];
});

function getRetryDelay(attempt) {
  return Math.min(1000 * Math.pow(2, attempt), 4000);
}

function startProgressSimulation() {
  progressPercent.value = 0;
  let current = 0;
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (current < 85) {
      current += Math.random() * 12 + 3;
      if (current > 85) current = 85;
      progressPercent.value = current;
    }
  }, 200);
}

function completeProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progressPercent.value = 100;
}

function resetProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progressPercent.value = 0;
}

async function routeBySession() {
  if (isRouting.value) return;

  isRouting.value = true;
  showError.value = false;
  startProgressSimulation();

  try {
    const result = await resolveLaunchTarget();

    if (result.target === ROUTE_TARGETS.error) {
      resetProgress();
      retryCount++;

      if (retryCount >= MAX_AUTO_RETRIES) {
        if (tryDegradedEntry()) return;
        showError.value = true;
        isRouting.value = false;
      } else {
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = setTimeout(() => {
          isRouting.value = false;
          routeBySession();
        }, getRetryDelay(retryCount - 1));
      }
      return;
    }

    completeProgress();
    await delay(500);

    if (result.target === ROUTE_TARGETS.home) {
      return uni.switchTab({ url: result.url });
    }

    return uni.reLaunch({ url: result.url });
  } catch (error) {
    console.error("routeBySession failed", error);
    resetProgress();
    retryCount++;

    if (retryCount >= MAX_AUTO_RETRIES) {
      if (tryDegradedEntry()) return;
      showError.value = true;
      isRouting.value = false;
    } else {
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        isRouting.value = false;
        routeBySession();
      }, getRetryDelay(retryCount - 1));
    }
  } finally {
    isRouting.value = false;
  }
}

function tryDegradedEntry() {
  const session = getCurrentSession();
  if (!session.hasLogin) return false;

  completeProgress();
  setTimeout(() => {
    uni.switchTab({ url: ROUTES.home });
  }, 300);
  return true;
}

function manualRetry() {
  retryCount = 0;
  routeBySession();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onLoad(() => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 44;
  } catch (e) {
    statusBarHeight.value = 44;
  }
});

onShow(() => {
  retryCount = 0;
  routeBySession();
});
</script>

<style lang="scss" scoped>
.entry-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $color-primary-dark;
  display: flex;
  flex-direction: column;
}

/* 背景层 */
.entry-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(165deg,
    $color-primary-dark 0%,
    $color-primary 30%,
    $color-primary-soft 55%,
    $color-sage 75%,
    $color-sage-light 90%,
    $color-bg-page 100%
  );
}

.entry-bg-noise {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.04;
  pointer-events: none;
}

/* 装饰线条 */
.entry-deco {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.entry-deco-svg {
  width: 100%;
  height: 100%;
}

/* 顶部标记 */
.entry-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding-left: 28px;
  padding-right: 28px;
  display: flex;
  justify-content: center;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both;
}

.entry-mark {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: $radius-pill;
  background: rgba(244, 239, 230, 0.08);
  border: 1px solid rgba(244, 239, 230, 0.12);
  backdrop-filter: blur(20px);
}

.entry-mark-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $color-terra-soft;
  animation: pulseDot 2.5s ease-in-out infinite;
}

.entry-mark-text {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 3px;
  color: $inverse-85;
  font-weight: 500;
}

/* 主体内容 */
.entry-content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 0 40px;
}

/* 品牌 Logo */
.entry-logo-wrap {
  position: relative;
  margin-bottom: 28px;
  animation: logoReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s both;
}

.entry-logo {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(244, 239, 230, 0.08);
  border: 1px solid rgba(244, 239, 230, 0.12);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $inverse-85;
  position: relative;
  z-index: 2;
}

.entry-logo svg {
  width: 36px;
  height: 36px;
}

.entry-logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(212, 128, 95, 0.15) 0%, transparent 70%);
  z-index: 1;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes logoReveal {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

/* 英文大标题 */
.entry-title-en {
  display: block;
  font-family: $font-serif;
  font-size: 44px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1.5px;
  color: $color-text-inverse;
  margin-bottom: 8px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both;
}

/* 中文标题 */
.entry-title-cn-wrap {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 20px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s both;
}

.entry-title-cn {
  font-family: $font-serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 2px;
  color: $inverse-85;
}

.entry-title-cn.em {
  transform: skewX(-8deg);
  transform-origin: left center;
  font-weight: 300;
  color: $color-sage-light;
}

/* 分隔线 */
.entry-divider {
  width: 36px;
  height: 1px;
  background: rgba(244, 239, 230, 0.2);
  margin: 0 auto 20px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s both;
}

/* 介绍文字 */
.entry-intro {
  display: block;
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 500;
  color: $inverse-85;
  letter-spacing: 1px;
  margin-bottom: 6px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.65s both;
}

.entry-intro-sub {
  display: block;
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  color: $inverse-50;
  text-transform: uppercase;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.75s both;
}

/* 底部区域 */
.entry-loader-area {
  position: relative;
  z-index: 2;
  padding: 0 60px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s both;
}

/* 加载状态文字 */
.entry-loading-text {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: $inverse-50;
  text-transform: uppercase;
}

/* 进度条 */
.entry-progress-track {
  width: 100%;
  height: 3px;
  background: rgba(244, 239, 230, 0.08);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.entry-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-sage-light 0%, $color-terra-soft 100%);
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 0 10px rgba(212, 128, 95, 0.4);
}

/* 错误状态 */
.entry-error-text {
  font-family: $font-sans;
  font-size: 13px;
  color: $inverse-55;
  letter-spacing: 0.5px;
}

.entry-retry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: $radius-btn;
  background: rgba(244, 239, 230, 0.08);
  border: 1px solid rgba(244, 239, 230, 0.12);
  transition: all 0.2s ease;
}

.entry-retry-btn svg {
  width: 15px;
  height: 15px;
  stroke: $inverse-85;
}

.entry-retry-text {
  font-family: $font-sans;
  font-size: 13px;
  font-weight: 500;
  color: $inverse-85;
}

.entry-retry-btn-hover {
  background: rgba(244, 239, 230, 0.14);
  transform: scale(0.97);
}
</style>
