<template>
  <view class="form-card">
    <view class="field">
      <text class="label">衣橱名称</text>
      <u-input
        :value="name"
        maxlength="30"
        placeholder="例如：主卧大衣柜"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @input="emit('update:name', $event)"
      />
    </view>

    <view class="field">
      <text class="label">所属房间</text>
      <u-input
        :value="roomName"
        maxlength="30"
        placeholder="例如：主卧、次卧、客房"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @input="emit('update:roomName', $event)"
      />
    </view>

    <view class="field">
      <text class="label">衣橱描述</text>
      <u-textarea
        :value="description"
        maxlength="200"
        placeholder="可以补充这个衣橱的用途或收纳特点"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '22rpx 24rpx', minHeight: '180rpx' }"
        @input="emit('update:description', $event)"
      />
    </view>
  </view>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: "",
  },
  roomName: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:name", "update:roomName", "update:description"]);
</script>

<style lang="scss">
.form-card {
  padding: 30rpx 26rpx;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.field + .field {
  margin-top: $spacing-lg;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  font-size: $font-size-md;
  font-weight: 700;
  color: $color-text-title;
}
</style>
