<template>
  <view class="empty-card">
    <text class="title">还没有衣橱</text>
    <text class="desc">{{ descText }}</text>
    <button v-if="canCreate" class="create-btn" type="primary" @click="$emit('create')">创建衣橱</button>
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
  },
  emits: ["create"],
  computed: {
    descText() {
      if (this.scopeType === "family") {
        return "当前家庭空间还没有衣橱，现在就可以先创建一个，方便家人后续一起管理和整理。";
      }

      return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理，后续再往里添加衣物。";
    },
  },
};
</script>

<style>
.empty-card {
  padding: 44rpx 32rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 18rpx 40rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
  text-align: center;
}

.title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #273228;
}

.desc {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #6f7c6d;
}

.create-btn {
  margin-top: 30rpx;
  border-radius: 999rpx;
}
</style>
