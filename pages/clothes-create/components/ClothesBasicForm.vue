<template>
  <view class="form-card">
    <view class="field">
      <text class="label">衣物名称</text>
      <u-input
        :value="name"
        maxlength="50"
        placeholder="例如：米白色针织衫"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @input="emit('update:name', $event)"
      />
    </view>

    <view class="field">
      <text class="label">衣物分类</text>
      <view class="chip-group">
        <u-tag
          v-for="item in categoryOptions"
          :key="item.code"
          :text="item.name"
          :type="category === item.code ? 'primary' : 'info'"
          :plain="category !== item.code"
          shape="circle"
          size="mini"
          :customStyle="category === item.code ? 'background: $color-primary; border-color: $color-primary;' : ''"
          @click="emit('update:category', item.code)"
        />
      </view>
    </view>

    <view class="field">
      <text class="label">适用季节</text>
      <view class="chip-group">
        <u-tag
          v-for="item in seasonOptions"
          :key="item.code"
          :text="item.name"
          :type="season === item.code ? 'primary' : 'info'"
          :plain="season !== item.code"
          shape="circle"
          size="mini"
          :customStyle="season === item.code ? 'background: $color-primary; border-color: $color-primary;' : ''"
          @click="emit('update:season', item.code)"
        />
      </view>
    </view>

    <view class="field">
      <text class="label">颜色</text>
      <u-input
        :value="color"
        maxlength="20"
        placeholder="例如：米白、深蓝、灰黑"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '0 24rpx' }"
        @input="emit('update:color', $event)"
      />
    </view>

    <view class="field">
      <text class="label">备注</text>
      <u-textarea
        :value="remark"
        maxlength="500"
        placeholder="可以补充材质、穿着场景或收纳提醒"
        shape="circle"
        bgColor="#f2f5ef"
        :customStyle="{ padding: '22rpx 24rpx', minHeight: '180rpx' }"
        @input="emit('update:remark', $event)"
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
});

const emit = defineEmits(["update:name", "update:category", "update:season", "update:color", "update:remark"]);
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

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}
</style>
