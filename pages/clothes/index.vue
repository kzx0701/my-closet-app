<template>
  <view class="page">
    <view class="page-head">
      <view>
        <text class="eyebrow">PERSONAL CLOTHES</text>
        <text class="title">我的衣物</text>
        <text class="desc">当前这一批先开放个人空间衣物列表与新增功能，先把最常用的记录链路跑通。</text>
      </view>
      <button class="create-btn" @click="goCreateClothes">新建</button>
    </view>

    <view v-if="hasFamily" class="notice-card">
      <text class="notice-title">家庭衣物后续接入</text>
      <text class="notice-desc">你当前已加入家庭，但这一次先只开放个人空间衣物管理，家庭衣物会在后续批次补上。</text>
    </view>

    <clothes-filter-bar
      :filters="filters"
      :closet-options="closetOptions"
      :category-options="categoryOptions"
      :season-options="seasonOptions"
      @update:filters="handleFilterChange"
      @reset="resetFilters"
    />

    <clothes-empty-state v-if="!loading && clothesList.length === 0" @create="goCreateClothes" />

    <view v-else class="list">
      <clothes-list-card
        v-for="item in clothesList"
        :key="item._id"
        :clothes="item"
        @edit="goEditClothes"
        @delete="confirmDeleteClothes"
      />
    </view>

    <h5-tab-bar :current-route="ROUTES.clothes" />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { deleteClothes, getPersonalClothesList } from "@/common/api/modules/clothes.js";
import { getPersonalClosetList } from "@/common/api/modules/closet.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import ClothesEmptyState from "./components/ClothesEmptyState.vue";
import ClothesFilterBar from "./components/ClothesFilterBar.vue";
import ClothesListCard from "./components/ClothesListCard.vue";

const loading = ref(false);
const clothesList = ref([]);
const hasFamily = ref(false);
const closetOptions = ref([]);
const categoryOptions = CLOTHES_CATEGORY_OPTIONS;
const seasonOptions = CLOTHES_SEASON_OPTIONS;
const filters = ref({
  closetId: "",
  category: "",
  season: "",
});

async function syncFamilyState() {
  const session = getCurrentSession();

  if (!session?.uid) {
    hasFamily.value = false;
    return;
  }

  const membership = await getFamilyMembership(session.uid);
  hasFamily.value = membership.status === "success" && membership.hasFamily;
}

async function loadClothes() {
  loading.value = true;

  try {
    const result = await getPersonalClothesList({
      closetId: filters.value.closetId,
      category: filters.value.category,
      season: filters.value.season,
    });
    clothesList.value = result?.list || [];
  } catch (error) {
    console.error("loadClothes failed", error);
    clothesList.value = [];
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
    const result = await getPersonalClosetList();
    closetOptions.value = result?.list || [];
  } catch (error) {
    console.error("loadClosetOptions failed", error);
    closetOptions.value = [];
  }
}

function goCreateClothes() {
  uni.navigateTo({
    url: ROUTES.clothesCreate,
  });
}

function handleFilterChange(nextFilters) {
  filters.value = {
    closetId: nextFilters?.closetId || "",
    category: nextFilters?.category || "",
    season: nextFilters?.season || "",
  };
  loadClothes();
}

function resetFilters() {
  filters.value = {
    closetId: "",
    category: "",
    season: "",
  };
  loadClothes();
}

function goEditClothes(clothes) {
  const targetClothesId = clothes?._id;

  if (!targetClothesId) {
    uni.showToast({
      title: "缺少衣物ID",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: `${ROUTES.clothesEdit}?clothesId=${targetClothesId}`,
  });
}

function confirmDeleteClothes(clothes) {
  const targetClothesId = clothes?._id;

  if (!targetClothesId) {
    uni.showToast({
      title: "缺少衣物ID",
      icon: "none",
    });
    return;
  }

  uni.showModal({
    title: "删除衣物",
    content: "删除后这条衣物记录会被移出当前列表，是否继续？",
    success: async (res) => {
      if (!res.confirm) {
        return;
      }

      try {
        await deleteClothes({
          clothesId: targetClothesId,
        });

        uni.showToast({
          title: "衣物已删除",
          icon: "success",
        });

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
  await syncFamilyState();
  await loadClosetOptions();
  loadClothes();
});
</script>

<style>
.page {
  min-height: 100vh;
  padding: 44rpx 28rpx 0;
  background:
    radial-gradient(circle at top, rgba(214, 223, 205, 0.42), transparent 34%),
    linear-gradient(180deg, #f7f4ee 0%, #fcfbf8 38%, #f3efe6 100%);
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 28rpx;
}

.eyebrow {
  display: block;
  font-size: 22rpx;
  letter-spacing: 4rpx;
  color: #7c8979;
}

.title {
  display: block;
  margin-top: 10rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: #2b362d;
}

.desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #6e7b6c;
}

.create-btn {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 30rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.88);
  color: #556451;
  font-size: 24rpx;
  box-shadow: 0 12rpx 26rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.1);
}

.notice-card {
  margin-bottom: 24rpx;
  padding: 26rpx 24rpx;
  border-radius: 24rpx;
  background: #f3f6ef;
  border: 2rpx solid rgba(107, 126, 99, 0.1);
}

.notice-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #314033;
}

.notice-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 23rpx;
  line-height: 1.72;
  color: #6f7c6d;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
