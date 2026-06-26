<template>
  <view class="empty-state fade-up-delay-3">
    <view class="empty-state__card">
      <!-- 顶部插画 -->
      <view class="empty-state__art">
        <view class="empty-state__art-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <path d="M9 9h6v6H9z"/>
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M1 9h3M20 15h3M1 15h3"/>
          </svg>
        </view>
        <view class="empty-state__art-orbit"></view>
      </view>

      <text class="empty-state__title">{{ titleText }}</text>
      <text class="empty-state__desc">{{ descText }}</text>

      <!-- 步骤引导 -->
      <view class="empty-state__steps">
        <view class="empty-state__step">
          <view class="empty-state__step-icon empty-state__step-icon--1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </view>
          <text class="empty-state__step-text">创建衣橱</text>
        </view>
        <view class="empty-state__step-connector">
          <view class="empty-state__step-dot"></view>
          <view class="empty-state__step-line"></view>
          <view class="empty-state__step-dot"></view>
        </view>
        <view class="empty-state__step">
          <view class="empty-state__step-icon empty-state__step-icon--2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-3.08 4.38"/><path d="M9.62 3.46 14 2a4 4 0 0 1 3.08 4.38"/><path d="M4.24 14.08c-1.24 1.37-1.1 3.5.3 4.7l3.6 3.2a3.1 3.1 0 0 0 4.2 0l3.6-3.2c1.4-1.2 1.54-3.33.3-4.7l-3.3-3.66a4 4 0 0 0-5.94 0Z"/><path d="M12 6v8"/></svg>
          </view>
          <text class="empty-state__step-text">添加衣物</text>
        </view>
        <view class="empty-state__step-connector">
          <view class="empty-state__step-dot"></view>
          <view class="empty-state__step-line"></view>
          <view class="empty-state__step-dot"></view>
        </view>
        <view class="empty-state__step">
          <view class="empty-state__step-icon empty-state__step-icon--3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </view>
          <text class="empty-state__step-text">轻松管理</text>
        </view>
      </view>

      <!-- 首次使用亮点 -->
      <view v-if="isFirstTime" class="empty-state__highlights">
        <view class="empty-state__highlight">
          <view class="empty-state__highlight-dot"></view>
          <text class="empty-state__highlight-text">按房间、季节归类衣物</text>
        </view>
        <view class="empty-state__highlight">
          <view class="empty-state__highlight-dot"></view>
          <text class="empty-state__highlight-text">与家人共享家庭衣橱</text>
        </view>
        <view class="empty-state__highlight">
          <view class="empty-state__highlight-dot"></view>
          <text class="empty-state__highlight-text">快速搜索与批量管理</text>
        </view>
      </view>

      <view v-if="canCreate" class="empty-state__btn-wrap">
        <view class="empty-state__btn" hover-class="empty-state__btn-hover" :hover-stay-time="100" @tap="handleCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <text class="empty-state__btn-text">{{ buttonText }}</text>
        </view>
      </view>

      <text v-if="isFirstTime" class="empty-state__tip">点击上方按钮，30 秒创建你的第一个衣橱</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "ClosetEmptyState",
  props: {
    scopeType: {
      type: String,
      default: "personal",
    },
    canCreate: {
      type: Boolean,
      default: true,
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    titleText() {
      return this.scopeType === "family" ? "家庭空间还是空的" : "从这里开始整理";
    },
    descText() {
      return this.scopeType === "family"
        ? "创建一个共享衣橱，和家人一起管理四季衣物"
        : "创建一个专属衣橱，把散落的衣物归类整理";
    },
    buttonText() {
      return this.scopeType === "family" ? "创建家庭衣橱" : "创建第一个衣橱";
    },
  },
  methods: {
    handleCreate() {
      this.$emit("create");
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 48rpx 64rpx;
}

.empty-state__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56rpx 44rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 36rpx;
  width: 100%;
  box-sizing: border-box;
}

/* 顶部插画 */
.empty-state__art {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-state__art-circle {
  position: relative;
  z-index: 2;
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-soft 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 40rpx rgba(58, 84, 67, 0.22);

  svg {
    width: 72rpx;
    height: 72rpx;
    color: #ffffff;
  }
}

.empty-state__art-orbit {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2rpx dashed rgba(58, 84, 67, 0.14);
  animation: slowSpin 18s linear infinite;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 2rpx dashed rgba(58, 84, 67, 0.1);
  }

  &::before {
    inset: 20rpx;
  }

  &::after {
    inset: 40rpx;
    border-color: rgba(196, 92, 62, 0.12);
  }
}

@keyframes slowSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state__title {
  font-family: $font-serif;
  font-size: 36rpx;
  font-weight: 700;
  color: $color-text-title;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.empty-state__desc {
  font-size: 26rpx;
  color: $color-text-secondary;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 36rpx;
}

/* 步骤引导 */
.empty-state__steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36rpx;
  width: 100%;
}

.empty-state__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.empty-state__step-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32rpx;
    height: 32rpx;
    stroke: #ffffff;
  }

  &--1 { background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%); }
  &--2 { background: linear-gradient(135deg, $color-terra 0%, #d67a5a 100%); }
  &--3 { background: linear-gradient(135deg, $color-moss 0%, #6b8a6c 100%); }
}

.empty-state__step-text {
  font-size: 22rpx;
  color: $color-text-secondary;
  font-weight: 500;
}

.empty-state__step-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  margin-top: -20rpx;
}

.empty-state__step-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, $color-sage-light 0%, $color-sage 100%);
}

.empty-state__step-dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: $color-sage;
  flex-shrink: 0;
}

/* 亮点 */
.empty-state__highlights {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  width: 100%;
  padding: 24rpx 28rpx;
  margin-bottom: 32rpx;
  background: $color-bg-page;
  border-radius: 20rpx;
  box-sizing: border-box;
}

.empty-state__highlight {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.empty-state__highlight-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: $color-primary;
  flex-shrink: 0;
}

.empty-state__highlight-text {
  font-size: 24rpx;
  color: $color-text-secondary;
  line-height: 1.4;
}

/* 按钮 */
.empty-state__btn-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.empty-state__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx 72rpx;
  background: $gradient-button;
  border-radius: $radius-pill;
  box-shadow: 0 8px 20px rgba(90, 115, 81, 0.28);
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  svg {
    width: 32rpx;
    height: 32rpx;
    stroke: #ffffff;
  }
}

.empty-state__btn-hover {
  transform: scale(0.97);
  box-shadow: 0 4px 12px rgba(90, 115, 81, 0.22);
}

.empty-state__btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  line-height: 1.3;
}

.empty-state__tip {
  font-size: 22rpx;
  color: $color-text-placeholder;
  margin-top: 20rpx;
  text-align: center;
}
</style>
