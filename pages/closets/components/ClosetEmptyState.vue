<template>
  <view class="empty-card">
    <u-empty mode="list" :text="descText" :iconSize="160">
      <template #bottom>
        <u-button
          v-if="canCreate"
          type="primary"
          size="small"
          shape="circle"
          customStyle="background: $color-primary; border-color: $color-primary;"
          @click="emit('create')"
        >
          创建衣橱
        </u-button>
      </template>
    </u-empty>
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

const descText = computed(() => {
  if (props.scopeType === "family") {
    return "当前家庭空间还没有衣橱，现在就可以先创建一个";
  }
  return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理";
});
</script>

<style lang="scss">
.empty-card {
  padding: 44rpx 32rpx;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card-lg;
  border: 2rpx solid $color-border;
}
</style>
