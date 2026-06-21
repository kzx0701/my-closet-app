<template>
  <view class="entry-page">
    <!-- 背景层 -->
    <view class="entry-bg"></view>
    <view class="entry-bg-noise noise-texture"></view>

    <!-- 装饰性 SVG 线条 -->
    <view class="entry-deco">
      <svg viewBox="0 0 375 812" preserveAspectRatio="none" class="entry-deco-svg">
        <path d="M 0 180 Q 187 120 375 180" fill="none" stroke="rgba(244,239,230,0.06)" stroke-width="1"/>
        <path d="M 0 240 Q 187 180 375 240" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
        <path d="M 0 600 Q 187 540 375 600" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
        <path d="M 0 660 Q 187 600 375 660" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
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

      <!-- 装饰性 SVG 衣架（浮动动画） -->
      <view class="entry-hanger">
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="rgba(244,239,230,0.22)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="hanger-svg">
          <path d="M100 30 Q90 10 80 30 Q70 50 100 60 L100 90 L40 110 L160 110 L100 90" />
          <circle cx="100" cy="20" r="6" />
          <line x1="40" y1="110" x2="160" y2="110" />
        </svg>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="entry-loader-area">
      <!-- 正常加载：进度条 -->
      <template v-if="!showError">
        <view class="entry-progress-track">
          <view class="entry-progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </template>

      <!-- 错误状态：提示 + 重试按钮 -->
      <template v-else>
        <text class="entry-error-text">连接服务失败，请检查网络</text>
        <button class="entry-retry-btn" @click="manualRetry">重试</button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
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

// 指数退避：1s → 2s → 4s
function getRetryDelay(attempt) {
  return Math.min(1000 * Math.pow(2, attempt), 4000);
}

// 模拟进度推进（0 → 85%），真实完成后跳到 100%
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
        // 超过最大重试次数，尝试降级进入首页
        if (tryDegradedEntry()) return;
        // 降级失败，显示错误状态
        showError.value = true;
        isRouting.value = false;
      } else {
        // 指数退避自动重试
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
      // 超过最大重试次数，尝试降级进入首页
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

/**
 * 降级进入首页：当所有重试都失败时，已登录用户直接进入首页（离线模式）。
 * 首页各区块独立加载并展示缓存或错误态，不阻塞用户。
 * @returns {boolean} 是否成功降级
 */
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

.entry-title-en {
  display: block;
  font-family: $font-serif;
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1.5px;
  color: $color-text-inverse;
  margin-bottom: 8px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both;
}

.entry-title-cn-wrap {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 24px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both;
}

.entry-title-cn {
  font-family: $font-serif;
  font-size: 24px;
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

.entry-divider {
  width: 40px;
  height: 1px;
  background: rgba(244, 239, 230, 0.25);
  margin: 0 auto 24px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s both;
}

.entry-intro {
  display: block;
  font-family: $font-sans;
  font-size: 15px;
  font-weight: 500;
  color: $inverse-85;
  letter-spacing: 1px;
  margin-bottom: 8px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.65s both;
}

.entry-intro-sub {
  display: block;
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 2px;
  color: $inverse-50;
  text-transform: uppercase;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.75s both;
}

/* 装饰衣架 */
.entry-hanger {
  margin-top: 48px;
  opacity: 0;
  animation: fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s both, hangerFloat 4s ease-in-out 1.9s infinite;
}

.hanger-svg {
  width: 160px;
  height: 96px;
  display: block;
}

@keyframes hangerFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* 底部区域 */
.entry-loader-area {
  position: relative;
  z-index: 2;
  padding: 0 80px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1.1s both;
}

/* 进度条 */
.entry-progress-track {
  width: 100%;
  height: 2px;
  background: rgba(244, 239, 230, 0.1);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.entry-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-sage-light 0%, $color-terra-soft 100%);
  border-radius: 1px;
  transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 0 8px rgba(212, 128, 95, 0.4);
}

/* 错误状态 */
.entry-error-text {
  font-family: $font-sans;
  font-size: 13px;
  color: $inverse-55;
  letter-spacing: 0.5px;
}

.entry-retry-btn {
  padding: 10px 32px;
  border-radius: $radius-btn;
  background: rgba(244, 239, 230, 0.1);
  border: 1px solid rgba(244, 239, 230, 0.15);
  color: $color-text-inverse;
  font-family: $font-sans;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  transition: all 0.2s ease;
}

.entry-retry-btn:active {
  background: rgba(244, 239, 230, 0.15);
  transform: scale(0.97);
}
</style>
