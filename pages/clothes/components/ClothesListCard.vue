<template>
  <view class="card" @click="goDetail">
    <view v-if="clothes.image_url" class="image-wrap">
      <image class="image" :src="clothes.image_url" mode="aspectFill" @click.stop="previewImage" />
    </view>
    <view class="content">
      <view class="badge-row">
        <text class="badge">{{ categoryName }}</text>
        <text class="badge">{{ seasonName }}</text>
        <text v-if="clothes.color" class="badge">{{ clothes.color }}</text>
      </view>
      <text class="title">{{ clothes.name }}</text>
      <text class="meta">{{ closetLabel }}</text>
      <text v-if="showCreator && creatorText" class="creator">{{ creatorText }}</text>
      <text class="remark">{{ clothes.remark || "当前还没有补充衣物备注。" }}</text>
    </view>
    <view class="action-row">
      <button class="action-btn" size="mini" @click.stop="$emit('edit', clothes)">编辑</button>
      <button class="action-btn danger-btn" size="mini" @click.stop="$emit('delete', clothes)">删除</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";

const props = defineProps({
  clothes: {
    type: Object,
    default() {
      return {};
    },
  },
  showCreator: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit", "delete"]);

const categoryName = computed(() => {
  return CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === props.clothes.category)?.name || "未知分类";
});

const seasonName = computed(() => {
  return CLOTHES_SEASON_OPTIONS.find((item) => item.code === props.clothes.season)?.name || "未知季节";
});

const closetLabel = computed(() => {
  const closetName = String(props.clothes.closet_name || "").trim();
  return closetName ? `所属衣橱：${closetName}` : "当前未绑定衣橱";
});

const creatorText = computed(() => {
  const creatorName = String(props.clothes.creator_name || "").trim();
  return creatorName ? `创建者：${creatorName}` : "";
});

function previewImage() {
  if (props.clothes.image_url) {
    uni.previewImage({
      urls: [props.clothes.image_url],
      current: props.clothes.image_url,
    });
  }
}

function goDetail() {
  uni.navigateTo({
    url: `${ROUTES.clothesDetail}?clothesId=${props.clothes._id}`,
  });
}
</script>

<style lang="scss">
.card {
  display: flex;
  gap: $spacing-md;
  padding: 30rpx 26rpx;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.image-wrap {
  width: 160rpx;
  height: 160rpx;
  flex-shrink: 0;
  border-radius: $radius-md;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
}

.content {
  flex: 1;
  min-width: 0;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.badge {
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

.meta {
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

.remark {
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
