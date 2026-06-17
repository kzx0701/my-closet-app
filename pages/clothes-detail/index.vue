<template>
  <view class="page">
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle" />
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="clothes" class="detail">
      <view v-if="clothes.image_url" class="image-section">
        <image class="cover-image" :src="clothes.image_url" mode="aspectFill" @click="previewImage" />
      </view>

      <view class="info-card">
        <view class="badge-row">
          <u-tag :text="categoryName" size="mini" type="primary" plain />
          <u-tag :text="seasonName" size="mini" type="success" plain />
          <u-tag v-if="clothes.color" :text="clothes.color" size="mini" type="info" plain />
        </view>

        <text class="title">{{ clothes.name }}</text>

        <view class="meta-grid">
          <view class="meta-item">
            <text class="meta-label">所属衣橱</text>
            <text class="meta-value">{{ closetName || '未绑定' }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">作用域</text>
            <text class="meta-value">{{ clothes.scope_type === 'family' ? '家庭' : '个人' }}</text>
          </view>
          <view v-if="clothes.scope_type === 'family' && clothes.creator_name" class="meta-item">
            <text class="meta-label">创建者</text>
            <text class="meta-value">{{ clothes.creator_name }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">创建时间</text>
            <text class="meta-value">{{ formatTime(clothes.created_at) }}</text>
          </view>
        </view>

        <view v-if="clothes.remark" class="remark-section">
          <text class="remark-label">备注</text>
          <text class="remark-text">{{ clothes.remark }}</text>
        </view>
      </view>

      <view class="action-bar">
        <u-button
          type="primary"
          shape="circle"
          customStyle="background: linear-gradient(135deg, #5a7351 0%, #738c67 100%); border: none;"
          @click="goEdit"
        >
          编辑
        </u-button>
        <u-button
          type="error"
          shape="circle"
          plain
          @click="confirmDelete"
        >
          删除
        </u-button>
      </view>
    </view>

    <view v-else class="empty-state">
      <u-empty mode="list" text="衣物不存在或已删除" />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getClothesDetail, deleteClothes } from "@/common/api/modules/clothes.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";

const loading = ref(true);
const clothes = ref(null);
const clothesId = ref("");
const needsRefresh = ref(false);

const categoryName = computed(() => {
  return CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === clothes.value?.category)?.name || "";
});

const seasonName = computed(() => {
  return CLOTHES_SEASON_OPTIONS.find((item) => item.code === clothes.value?.season)?.name || "";
});

const closetName = computed(() => {
  return clothes.value?.closet_name || "";
});

async function loadDetail() {
  if (!clothesId.value) return;

  try {
    const result = await getClothesDetail({ clothesId: clothesId.value });
    clothes.value = result?.clothes || null;
  } catch (error) {
    console.error("loadClothesDetail failed", error);
    clothes.value = null;
  }
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function previewImage() {
  if (clothes.value?.image_url) {
    uni.previewImage({
      urls: [clothes.value.image_url],
      current: clothes.value.image_url,
    });
  }
}

function goEdit() {
  needsRefresh.value = true;
  uni.navigateTo({
    url: `${ROUTES.clothesEdit}?clothesId=${clothesId.value}`,
  });
}

function confirmDelete() {
  uni.showModal({
    title: "删除衣物",
    content: "删除后这条衣物记录会被移出当前列表，是否继续？",
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await deleteClothes({ clothesId: clothesId.value });
        uni.showToast({ title: "衣物已删除", icon: "success" });
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      } catch (error) {
        console.error("deleteClothes failed", error);
        uni.showToast({
          title: error?.message || "衣物删除失败",
          icon: "none",
        });
      }
    },
  });
}

onLoad((options) => {
  clothesId.value = String(options?.clothesId || "").trim();
});

onShow(async () => {
  if (!clothesId.value) {
    loading.value = false;
    return;
  }

  if (needsRefresh.value) {
    needsRefresh.value = false;
    await loadDetail();
  } else if (!clothes.value) {
    loading.value = true;
    await loadDetail();
    loading.value = false;
  }
});
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  padding: 0 0 180rpx;
  background: $gradient-page-radial, $gradient-page;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}

.loading-text {
  margin-top: $spacing-md;
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.image-section {
  width: 100%;
  height: 500rpx;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.info-card {
  margin: $spacing-lg 28rpx;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.title {
  display: block;
  margin-top: $spacing-lg;
  font-size: $font-size-hero;
  font-weight: 700;
  color: $color-text-title;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  margin-top: $spacing-xl;
}

.meta-item {
  padding: $spacing-md;
  border-radius: $radius-sm;
  background: $color-bg-chip;
}

.meta-label {
  display: block;
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.meta-value {
  display: block;
  margin-top: $spacing-xs;
  font-size: $font-size-md;
  font-weight: 600;
  color: $color-text-primary;
}

.remark-section {
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1rpx solid $color-border;
}

.remark-label {
  display: block;
  font-size: $font-size-md;
  font-weight: 600;
  color: $color-text-primary;
}

.remark-text {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-base;
  line-height: 1.7;
  color: $color-text-secondary;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg 28rpx;
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.empty-state {
  padding: 200rpx 0;
}
</style>
