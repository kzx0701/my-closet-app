<template>
  <view class="card">
    <view class="head">
      <text class="label">{{ label }}</text>
      <text v-if="badge" class="badge">{{ badge }}</text>
    </view>
    <text class="title">{{ title }}</text>
    <text class="desc">{{ desc }}</text>
    <view v-if="metaItems.length" class="meta-list">
      <view class="meta-item" v-for="item in metaItems" :key="item.label">
        <text class="meta-label">{{ item.label }}</text>
        <text class="meta-value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "当前空间",
  },
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  badge: {
    type: String,
    default: "",
  },
  metaItems: {
    type: Array,
    default() {
      return [];
    },
  },
});
</script>

<style lang="scss">
.card {
  padding: 36rpx 32rpx 34rpx;
  border-radius: $radius-xl;
  background: linear-gradient(135deg, #617857 0%, #7d9570 100%);
  box-shadow: 0 20rpx 48rpx rgba(58, 71, 54, 0.16);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
}

.label {
  font-size: $font-size-sm;
  letter-spacing: 2rpx;
  color: rgba(255, 255, 255, 0.72);
}

.badge {
  padding: 10rpx 18rpx;
  border-radius: $radius-pill;
  background: rgba(255, 255, 255, 0.18);
  font-size: $font-size-sm;
  color: $color-text-inverse;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-size: 50rpx;
  font-weight: 700;
  line-height: 1.2;
  color: $color-text-inverse;
}

.desc {
  display: block;
  margin-top: $spacing-md;
  font-size: 27rpx;
  line-height: 1.72;
  color: rgba(255, 255, 255, 0.9);
}

.meta-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  margin-top: 26rpx;
}

.meta-item {
  padding: 18rpx 20rpx;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.12);
}

.meta-label {
  display: block;
  font-size: 21rpx;
  color: rgba(255, 255, 255, 0.7);
}

.meta-value {
  display: block;
  margin-top: $spacing-xs;
  font-size: $font-size-md;
  font-weight: 600;
  color: $color-text-inverse;
}
</style>
