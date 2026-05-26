<template>
  <view class="actions">
    <button class="primary" type="primary" @click="$emit('create-family')">创建家庭</button>
    <button class="secondary" @click="$emit('join-family')">加入家庭</button>
    <button class="ghost" @click="$emit('skip')">先跳过</button>
  </view>
</template>

<script>
export default {
  name: "GuideActions",
  emits: ["create-family", "join-family", "skip"],
};
</script>

<style>
.actions {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.primary,
.secondary,
.ghost {
  border-radius: 999rpx;
  font-size: 30rpx;
}

.secondary {
  background: #edf1ea;
  color: #314033;
}

.ghost {
  background: transparent;
  color: #667062;
}
</style>
