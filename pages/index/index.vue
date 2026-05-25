<template>
  <view class="page">
    <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
    <text class="title">{{ title }}</text>
    <text class="desc">{{ desc }}</text>
    <view>123</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "我的衣橱",
      desc: "项目已初始化完成，可以开始搭建家庭衣橱管理功能。",
    };
  },
};
</script>

<style>
.page {
  min-height: 100vh;
  padding: 160rpx 48rpx 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, #f7f7f2 0%, #ffffff 55%, #f3f0ea 100%);
}

.logo {
  width: 180rpx;
  height: 180rpx;
}

.title {
  margin-top: 40rpx;
  font-size: 44rpx;
  font-weight: 600;
  color: #2f3a2f;
}

.desc {
  margin-top: 24rpx;
  font-size: 28rpx;
  line-height: 1.7;
  color: #6f756b;
  text-align: center;
}
</style>
