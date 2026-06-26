<template>
  <view class="basic-form">
    <!-- 所在房间 -->
    <view class="form-section">
      <text class="form-label">所在房间</text>
      <view class="input-wrap">
        <input
          class="form-input"
          :class="{ 'form-input-focus': roomFocused }"
          type="text"
          :value="roomName"
          maxlength="30"
          :adjust-position="true"
          :cursor-spacing="80"
          placeholder="例如：主卧、次卧、储物间"
          placeholder-class="input-placeholder"
          @focus="roomFocused = true"
          @blur="roomFocused = false"
          @input="emit('update:roomName', $event.detail.value)"
        />
      </view>
    </view>

    <!-- 归属空间 -->
    <view v-if="!hideScope" class="form-section">
      <text class="form-label">归属空间</text>
      <view class="chip-row">
        <view
          class="chip"
          :class="{ active: scopeType === 'personal' }"
          @click="emit('update:scopeType', 'personal')"
        >
          <view class="chip-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </view>
          <text class="chip-text">个人空间</text>
        </view>
        <view
          v-if="familyName"
          class="chip"
          :class="{ active: scopeType === 'family' }"
          @click="emit('update:scopeType', 'family')"
        >
          <view class="chip-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </view>
          <text class="chip-text">{{ familyName }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  roomName: {
    type: String,
    default: "",
  },
  scopeType: {
    type: String,
    default: "personal",
  },
  familyName: {
    type: String,
    default: "",
  },
  hideScope: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:roomName", "update:scopeType"]);

const roomFocused = ref(false);
</script>

<style lang="scss" scoped>
.basic-form {
  /* no extra wrapper margin needed — parent card handles spacing */
}

.form-section {
  margin-bottom: 48rpx;
}

.basic-form .form-section:first-child {
  margin-top: 0;
}

.form-label {
  display: block;
  margin-bottom: 20rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-secondary;
  letter-spacing: 2rpx;
}

.input-wrap {
  position: relative;
}

.form-input {
  width: 100%;
  height: 92rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-family: $font-sans;
  font-size: 28rpx;
  color: $color-text-title;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.form-input-focus {
  border-color: $color-primary;
  box-shadow: 0 0 0 3rpx rgba(58, 84, 67, 0.08);
}

.input-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

/* ========== Scope Chips ========== */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.chip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 28rpx;
  border-radius: $radius-pill;
  background: $color-bg-chip;
  border: 2rpx solid transparent;
  transition: all 0.25s ease;
}

.chip.active {
  background: $color-primary;
  border-color: $color-primary;
  box-shadow: $shadow-button;
}

.chip-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.chip-icon svg {
  width: 32rpx;
  height: 32rpx;
  stroke: $color-text-secondary;
}

.chip.active .chip-icon svg {
  stroke: $color-text-inverse;
}

.chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
  transition: color 0.25s ease;
}

.chip.active .chip-text {
  color: $color-text-inverse;
  font-weight: 600;
}
</style>
