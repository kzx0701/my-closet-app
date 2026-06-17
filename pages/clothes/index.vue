<template>
  <view class="page">
    <view class="page-head">
      <view>
        <text class="eyebrow">{{ pageEyebrow }}</text>
        <text class="title">{{ pageTitle }}</text>
        <text class="desc">{{ pageDesc }}</text>
      </view>
      <button class="create-btn" @click="goCreateClothes">新建</button>
    </view>

    <view v-if="showScopeSwitch" class="scope-switch">
      <button
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'personal' }"
        @click="changeScope('personal')"
      >
        个人衣物
      </button>
      <button
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'family' }"
        @click="changeScope('family')"
      >
        家庭衣物
      </button>
    </view>

    <clothes-filter-bar
      :filters="filters"
      :closet-options="closetOptions"
      :category-options="categoryOptions"
      :season-options="seasonOptions"
      @update:filters="handleFilterChange"
      @reset="resetFilters"
    />

    <scroll-view
      class="scroll-area"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <clothes-empty-state v-if="!loading && clothesList.length === 0" @create="goCreateClothes" />

      <view v-else class="list">
        <clothes-list-card
          v-for="item in clothesList"
          :key="item._id"
          :clothes="item"
          :show-creator="scopeType === 'family'"
        @edit="goEditClothes"
        @delete="confirmDeleteClothes"
      />
      </view>

      <u-loadmore :status="loadMoreStatus" v-if="clothesList.length > 0" />
    </scroll-view>

    <h5-tab-bar :current-route="ROUTES.clothes" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import {
  deleteClothes,
  getPersonalClothesList,
  getFamilyClothesList,
} from "@/common/api/modules/clothes.js";
import {
  getPersonalClosetList,
  getFamilyClosetList,
} from "@/common/api/modules/closet.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getClothesScopeState, setClothesScopeState } from "@/common/services/clothes-scope-state.js";
import ClothesEmptyState from "./components/ClothesEmptyState.vue";
import ClothesFilterBar from "./components/ClothesFilterBar.vue";
import ClothesListCard from "./components/ClothesListCard.vue";

const loading = ref(false);
const refreshing = ref(false);
const clothesList = ref([]);
const scopeType = ref("personal");
const hasFamily = ref(false);
const closetOptions = ref([]);
const categoryOptions = CLOTHES_CATEGORY_OPTIONS;
const seasonOptions = CLOTHES_SEASON_OPTIONS;
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const loadMoreStatus = computed(() => {
  if (loading.value) return "loading";
  if (clothesList.value.length >= total.value) return "nomore";
  return "loadmore";
});

const showScopeSwitch = computed(() => hasFamily.value);
const pageEyebrow = computed(() => (scopeType.value === "family" ? "FAMILY CLOTHES" : "PERSONAL CLOTHES"));
const pageTitle = computed(() => (scopeType.value === "family" ? "家庭衣物" : "我的衣物"));
const pageDesc = computed(() =>
  scopeType.value === "family"
    ? "这里展示当前家庭下的全部衣物，方便家庭成员协作管理。"
    : showScopeSwitch.value
      ? "这里是你的个人衣物空间；需要切换到家庭视角时，可以直接使用上方切换。"
      : "管理你的个人衣物，可以按分类、季节或衣橱来筛选。"
);

const filters = ref({
  closetId: "",
  category: "",
  season: "",
});

async function syncScopeType() {
  const session = getCurrentSession();

  if (!session?.uid) {
    hasFamily.value = false;
    scopeType.value = "personal";
    return;
  }

  const membership = await getFamilyMembership(session.uid);
  hasFamily.value = membership.status === "success" && membership.hasFamily;

  if (!hasFamily.value) {
    scopeType.value = "personal";
    setClothesScopeState(session.uid, "personal");
    return;
  }

  scopeType.value = getClothesScopeState(session.uid);
}

function changeScope(nextScopeType) {
  if (nextScopeType === scopeType.value) return;
  if (nextScopeType === "family" && !hasFamily.value) return;

  const session = getCurrentSession();
  scopeType.value = nextScopeType;
  setClothesScopeState(session?.uid, nextScopeType);
  currentPage.value = 1;
  loadClothes();
}

async function onRefresh() {
  refreshing.value = true;
  currentPage.value = 1;
  await loadClothes();
  refreshing.value = false;
}

function onLoadMore() {
  if (loading.value || clothesList.value.length >= total.value) return;
  currentPage.value += 1;
  loadClothes(true);
}

async function loadClothes(append = false) {
  loading.value = true;

  try {
    const payload = {
      closetId: filters.value.closetId,
      category: filters.value.category,
      season: filters.value.season,
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    const result = scopeType.value === "family"
      ? await getFamilyClothesList(payload)
      : await getPersonalClothesList(payload);

    if (append) {
      clothesList.value = [...clothesList.value, ...(result?.list || [])];
    } else {
      clothesList.value = result?.list || [];
    }
    total.value = result?.total || 0;
  } catch (error) {
    console.error("loadClothes failed", error);
    clothesList.value = [];
    total.value = 0;
    uni.showToast({
      title: error?.message || "衣物列表加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

async function loadClosetOptions() {
  try {
    const result = scopeType.value === "family"
      ? await getFamilyClosetList({ pageSize: 100 })
      : await getPersonalClosetList({ pageSize: 100 });
    closetOptions.value = result?.list || [];
  } catch (error) {
    console.error("loadClosetOptions failed", error);
    closetOptions.value = [];
  }
}

function goCreateClothes() {
  const scopeParam = scopeType.value === "family" ? "?scopeType=family" : "";
  uni.navigateTo({
    url: `${ROUTES.clothesCreate}${scopeParam}`,
  });
}

function handleFilterChange(nextFilters) {
  filters.value = {
    closetId: nextFilters?.closetId || "",
    category: nextFilters?.category || "",
    season: nextFilters?.season || "",
  };
  currentPage.value = 1;
  loadClothes();
}

function resetFilters() {
  filters.value = {
    closetId: "",
    category: "",
    season: "",
  };
  currentPage.value = 1;
  loadClothes();
}

function goEditClothes(clothes) {
  const targetClothesId = clothes?._id;

  if (!targetClothesId) {
    uni.showToast({ title: "缺少衣物ID", icon: "none" });
    return;
  }

  uni.navigateTo({
    url: `${ROUTES.clothesEdit}?clothesId=${targetClothesId}`,
  });
}

function confirmDeleteClothes(clothes) {
  const targetClothesId = clothes?._id;

  if (!targetClothesId) {
    uni.showToast({ title: "缺少衣物ID", icon: "none" });
    return;
  }

  uni.showModal({
    title: "删除衣物",
    content: "删除后这条衣物记录会被移出当前列表，是否继续？",
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await deleteClothes({ clothesId: targetClothesId });
        uni.showToast({ title: "衣物已删除", icon: "success" });
        loadClothes();
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

onShow(async () => {
  await syncScopeType();
  await loadClosetOptions();
  loadClothes();
});
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  padding: $spacing-xxl 28rpx 0;
  background: $gradient-page-radial, $gradient-page;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-lg;
  margin-bottom: 28rpx;
}

.eyebrow {
  display: block;
  font-size: $font-size-sm;
  letter-spacing: 4rpx;
  color: $color-text-secondary;
}

.title {
  display: block;
  margin-top: 10rpx;
  font-size: $font-size-hero;
  font-weight: 700;
  color: $color-text-title;
}

.desc {
  display: block;
  margin-top: 14rpx;
  font-size: $font-size-base;
  line-height: 1.7;
  color: $color-text-secondary;
}

.create-btn {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 30rpx;
  border-radius: $radius-pill;
  background: rgba(255, 255, 255, 0.88);
  color: $color-text-secondary;
  font-size: $font-size-base;
  box-shadow: $shadow-button;
  border: 2rpx solid $color-border;
}

.scope-switch {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  padding: 10rpx;
  border-radius: $radius-pill;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: $shadow-card-sm;
}

.scope-chip {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: $radius-pill;
  background: transparent;
  color: $color-text-secondary;
  font-size: $font-size-base;
  border: none;
}

.scope-chip-active {
  background: $color-primary-light;
  color: $color-primary;
  font-weight: 600;
}

.scroll-area {
  height: calc(100vh - 400rpx);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 20rpx;
}
</style>
