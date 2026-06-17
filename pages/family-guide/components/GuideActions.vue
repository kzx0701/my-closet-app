<template>
  <view class="actions">
    <button class="primary" type="primary" @click="emit('create-family')">创建家庭</button>
    <button class="secondary" @click="emit('join-family')">加入家庭</button>
    <button class="ghost" @click="emit('skip')">先跳过</button>
  </view>
</template>

<script setup>
const emit = defineEmits(["create-family", "join-family", "skip"]);
</script>

<style lang="scss">
.actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.primary,
.secondary,
.ghost {
  border-radius: $radius-pill;
  font-size: $font-size-xl;
}

.secondary {
  background: $color-primary-light;
  color: $color-primary;
}

.ghost {
  background: transparent;
  color: $color-text-secondary;
}
</style>
