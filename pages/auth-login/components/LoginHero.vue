<template>
  <view class="hero">
    <text class="eyebrow">MY CLOSET</text>
    <text class="title">把家庭与个人衣橱放进同一个空间</text>
    <text class="desc">
      登录后你可以继续使用个人模式，也可以创建家庭或加入家庭，和家人一起管理衣物。
    </text>
  </view>
</template>

<script>
export default {
  name: "LoginHero",
};
</script>

<style>
.hero {
  margin-bottom: 36rpx;
}

.eyebrow {
  display: block;
  font-size: 24rpx;
  letter-spacing: 6rpx;
  color: rgba(235, 241, 232, 0.78);
}

.title {
  display: block;
  margin-top: 22rpx;
  font-size: 54rpx;
  font-weight: 700;
  line-height: 1.22;
  color: #ffffff;
}

.desc {
  display: block;
  margin-top: 22rpx;
  font-size: 27rpx;
  line-height: 1.75;
  color: rgba(247, 249, 244, 0.84);
}
</style>
