<template>
  <view class="card">
    <text class="label">当前空间</text>
    <text class="title">{{ title }}</text>
    <text class="desc">{{ desc }}</text>
  </view>
</template>

<script>
export default {
  name: "ScopeStatusCard",
  props: {
    title: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.card {
  padding: 36rpx 30rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #566a4e 0%, #738b66 100%);
  box-shadow: 0 18rpx 44rpx rgba(51, 65, 50, 0.18);
}

.label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.78);
}

.title {
  margin-top: 14rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
}

.desc {
  margin-top: 14rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.84);
}
</style>
