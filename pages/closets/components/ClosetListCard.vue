<template>
  <view class="card">
    <view class="badge-row">
      <text class="style-badge">{{ styleName }}</text>
      <text class="color-badge">{{ colorName }}</text>
    </view>
    <text class="title">{{ closet.name }}</text>
    <text class="room">{{ closet.room_name || "未填写房间" }}</text>
    <text v-if="creatorText" class="creator">{{ creatorText }}</text>
    <text class="desc">{{ closet.description || "当前还没有补充衣橱描述。" }}</text>
    <view class="action-row">
      <button class="action-btn" size="mini" @click="$emit('edit', closet)">编辑</button>
      <button class="action-btn danger-btn" size="mini" @click="$emit('delete', closet)">删除</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";

const props = defineProps({
  closet: {
    type: Object,
    default() {
      return {};
    },
  },
});

defineEmits(["edit", "delete"]);

const styleName = computed(() => {
  return CLOSET_STYLE_OPTIONS.find((item) => item.code === props.closet.style_code)?.name || "未知样式";
});

const colorName = computed(() => {
  return CLOSET_COLOR_OPTIONS.find((item) => item.code === props.closet.color_code)?.name || "未知颜色";
});

const creatorText = computed(() => {
  if (props.closet.scope_type !== "family") {
    return "";
  }

  const creatorName = String(props.closet.creator_name || "").trim();

  if (!creatorName) {
    return "";
  }

  return `创建者：${creatorName}`;
});
</script>

<style lang="scss">
.card {
  padding: 30rpx 26rpx;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.badge-row {
  display: flex;
  gap: 14rpx;
}

.style-badge,
.color-badge {
  padding: $spacing-xs 16rpx;
  border-radius: $radius-pill;
  font-size: $font-size-xs;
  color: $color-text-primary;
  background: $color-bg-tag;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $color-text-title;
}

.room {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.creator {
  display: block;
  margin-top: 10rpx;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.desc {
  display: block;
  margin-top: $spacing-md;
  font-size: 23rpx;
  line-height: 1.7;
  color: $color-text-secondary;
}

.action-row {
  display: flex;
  gap: $spacing-md;
  margin-top: 22rpx;
}

.action-btn {
  min-width: 132rpx;
  height: 62rpx;
  line-height: 62rpx;
  border-radius: $radius-pill;
  font-size: $font-size-sm;
  color: $color-text-primary;
  background: $color-bg-chip;
  border: none;
}

.danger-btn {
  color: $color-danger;
  background: $color-danger-bg;
}
</style>
