<template>
  <view class="empty-card fade-up-delay-2">
    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
    <text class="empty-title">{{ titleText }}</text>
    <text class="empty-desc">{{ descText }}</text>
    <view v-if="canCreate" class="empty-actions">
      <view class="empty-btn" @click="emit('create')">
        <text class="empty-btn-text">创建衣橱</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  scopeType: {
    type: String,
    default: "personal",
  },
  canCreate: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["create"]);

const titleText = computed(() => {
  if (props.scopeType === "family") {
    return "家庭空间还没有衣橱";
  }
  return "还没有衣橱";
});

const descText = computed(() => {
  if (props.scopeType === "family") {
    return "当前家庭空间还没有衣橱，现在就可以先创建一个";
  }
  return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理";
});
</script>

<style lang="scss" scoped>
.empty-card {
  padding: 44rpx 32rpx;
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px dashed $color-border;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 72rpx;
  height: 72rpx;
  stroke: $color-text-placeholder;
  opacity: 0.5;
  margin-bottom: 20rpx;
}

.empty-title {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-secondary;
  margin-bottom: 8rpx;
  display: block;
}

.empty-desc {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-placeholder;
  line-height: 1.5;
  display: block;
}

.empty-actions {
  margin-top: 24rpx;
}

.empty-btn {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 40rpx;
  border-radius: $radius-btn;
  background: $color-primary;
  transition: background 0.2s ease;
}

.empty-btn:hover,
.empty-btn:active {
  background: $color-primary-soft;
}

.empty-btn-text {
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-inverse;
}
</style>
