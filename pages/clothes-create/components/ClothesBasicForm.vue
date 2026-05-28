<template>
  <view class="form-card">
    <view class="field">
      <text class="label">衣物名称</text>
      <input
        class="input"
        :value="name"
        maxlength="50"
        placeholder="例如：米白色针织衫"
        @input="$emit('update:name', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">衣物分类</text>
      <view class="chip-group">
        <button
          v-for="item in categoryOptions"
          :key="item.code"
          class="chip"
          :class="{ 'chip-active': category === item.code }"
          @click="$emit('update:category', item.code)"
        >
          {{ item.name }}
        </button>
      </view>
    </view>

    <view class="field">
      <text class="label">适用季节</text>
      <view class="chip-group">
        <button
          v-for="item in seasonOptions"
          :key="item.code"
          class="chip"
          :class="{ 'chip-active': season === item.code }"
          @click="$emit('update:season', item.code)"
        >
          {{ item.name }}
        </button>
      </view>
    </view>

    <view class="field">
      <text class="label">颜色</text>
      <input
        class="input"
        :value="color"
        maxlength="20"
        placeholder="例如：米白、深蓝、灰黑"
        @input="$emit('update:color', $event.detail.value)"
      />
    </view>

    <view class="field">
      <text class="label">备注</text>
      <textarea
        class="textarea"
        :value="remark"
        maxlength="500"
        placeholder="可以补充材质、穿着场景或收纳提醒"
        @input="$emit('update:remark', $event.detail.value)"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: "ClothesBasicForm",
  props: {
    name: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    season: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    remark: {
      type: String,
      default: "",
    },
    categoryOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    seasonOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["update:name", "update:category", "update:season", "update:color", "update:remark"],
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

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip {
  min-width: 128rpx;
  height: 68rpx;
  line-height: 68rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: #5d6a5a;
  background: #eef2eb;
  border: none;
}

.chip-active {
  color: #243026;
  font-weight: 700;
  background: #dfe8d8;
}
</style>
