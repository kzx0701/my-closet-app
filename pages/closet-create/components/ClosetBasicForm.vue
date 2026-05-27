<template>
  <view class="form-card">
    <view class="field">
      <text class="label">衣橱名称</text>
      <input
        class="input"
        :value="name"
        maxlength="30"
        placeholder="例如：主卧大衣柜"
        @input="$emit('update:name', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">所属房间</text>
      <input
        class="input"
        :value="roomName"
        maxlength="30"
        placeholder="例如：主卧、次卧、客房"
        @input="$emit('update:roomName', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">衣橱描述</text>
      <textarea
        class="textarea"
        :value="description"
        maxlength="200"
        placeholder="可以补充这个衣橱的用途或收纳特点"
        @input="$emit('update:description', $event.detail.value)"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: "ClosetBasicForm",
  props: {
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
  },
  emits: ["update:name", "update:roomName", "update:description"],
};
</script>

<style>
.form-card {
  padding: 30rpx 26rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.field + .field {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #2d392f;
}

.input,
.textarea {
  width: 100%;
  border-radius: 20rpx;
  background: #f2f5ef;
  font-size: 27rpx;
  color: #243026;
  box-sizing: border-box;
}

.input {
  height: 92rpx;
  padding: 0 24rpx;
}

.textarea {
  min-height: 180rpx;
  padding: 22rpx 24rpx;
}
</style>
