<template>
  <view class="empty-card fade-up-delay-2">
    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
    <text class="empty-title">{{ titleText }}</text>
    <text class="empty-desc">{{ descText }}</text>
    <view v-if="canCreate" class="empty-actions">
      <view class="empty-btn" @click="emit('create')">
        <text class="empty-btn-text">添加衣物</text>
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
    return "家庭空间还没有衣物";
  }
  return "还没有衣物";
});

const descText = computed(() => {
  if (props.scopeType === "family") {
    return "当前家庭空间还没有添加衣物，现在就可以添加一件";
  }
  return "先添加一件衣物，可以按类别、季节或穿着场景来整理";
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
