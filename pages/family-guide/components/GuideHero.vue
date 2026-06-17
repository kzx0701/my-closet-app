<template>
  <view class="hero">
    <text class="eyebrow">家庭协作可选开启</text>
    <text class="title">你还没有加入家庭</text>
    <text class="desc">
      你可以先创建家庭或加入已有家庭，也可以先跳过，直接以个人模式管理自己的衣橱和衣物。
    </text>
  </view>
</template>

<script setup></script>

<style lang="scss">
.hero {
  display: flex;
  flex-direction: column;
}

.eyebrow {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-secondary;
  letter-spacing: 2rpx;
}

.title {
  margin-top: 18rpx;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.25;
  color: $color-text-title;
}

.desc {
  margin-top: 22rpx;
  font-size: $font-size-lg;
  line-height: 1.75;
  color: $color-text-secondary;
}
</style>
