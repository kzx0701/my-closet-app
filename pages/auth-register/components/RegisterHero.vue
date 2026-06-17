<template>
  <view class="hero">
    <text class="eyebrow">JOIN MY CLOSET</text>
    <text class="title">先创建你的账号，再进入个人或家庭衣橱空间</text>
    <text class="desc">
      注册成功后会自动进入系统，之后你可以先用个人模式，也可以继续创建或加入家庭。
    </text>
  </view>
</template>

<script setup>
</script>

<style lang="scss">
.hero {
  margin-bottom: 36rpx;
}

.eyebrow {
  display: block;
  font-size: $font-size-base;
  letter-spacing: 5rpx;
  color: rgba(236, 242, 233, 0.78);
}

.title {
  display: block;
  margin-top: 22rpx;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1.25;
  color: $color-text-inverse;
}

.desc {
  display: block;
  margin-top: 20rpx;
  font-size: 27rpx;
  line-height: 1.72;
  color: rgba(247, 249, 244, 0.84);
}
</style>
