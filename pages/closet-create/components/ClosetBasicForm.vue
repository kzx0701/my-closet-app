<template>
  <view class="basic-form">
    <!-- 所在房间 -->
    <view class="section">
      <text class="section-title">所在房间</text>
      <input
        class="form-input"
        :class="{ 'form-input-focus': roomFocused }"
        type="text"
        :value="roomName"
        maxlength="30"
        :adjust-position="true"
        :cursor-spacing="80"
        placeholder="例如：主卧、次卧、储物间"
        placeholder-class="form-input-placeholder"
        @focus="roomFocused = true"
        @blur="roomFocused = false"
        @input="emit('update:roomName', $event.detail.value)"
      />
    </view>

    <!-- 归属空间 -->
    <view v-if="!hideScope" class="section">
      <text class="section-title">归属空间</text>
      <view class="chip-row">
        <view
          class="chip"
          :class="{ active: scopeType === 'personal' }"
          @click="emit('update:scopeType', 'personal')"
        >
          <text class="chip-text">个人空间</text>
        </view>
        <view
          v-if="familyName"
          class="chip"
          :class="{ active: scopeType === 'family' }"
          @click="emit('update:scopeType', 'family')"
        >
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
  margin-top: 48rpx;
}

.section {
  margin-top: 48rpx;
}

.basic-form .section:first-child {
  margin-top: 0;
}

.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: rgba(58, 84, 67, 0.04);
  border: 1px solid $color-border-soft;
  font-family: $font-sans;
  font-size: 28rpx;
  color: $color-text-title;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-input-focus {
  border-color: $color-primary;
}

.form-input-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip {
  padding: 14rpx 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-chip;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.chip.active {
  background: $color-primary;
  border-color: $color-primary;
}

.chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.chip.active .chip-text {
  color: $color-text-inverse;
  font-weight: 600;
}
</style>
