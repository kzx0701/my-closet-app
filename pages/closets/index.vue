<template>
  <view class="page">
    <view class="page-head">
      <view>
        <text class="eyebrow">PERSONAL CLOSETS</text>
        <text class="title">我的衣橱</text>
        <text class="desc">当前先开放个人空间衣橱管理，家庭衣橱会在后续批次接入。</text>
      </view>
      <button class="create-btn" @click="goCreateCloset">新建</button>
    </view>

    <closet-empty-state v-if="!loading && closets.length === 0" @create="goCreateCloset" />

    <view v-else class="list">
      <closet-list-card v-for="item in closets" :key="item._id" :closet="item" />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { ROUTES } from "@/common/constants/routes.js";
import { getPersonalClosetList } from "@/common/api/modules/closet.js";
import ClosetEmptyState from "./components/ClosetEmptyState.vue";
import ClosetListCard from "./components/ClosetListCard.vue";

const loading = ref(false);
const closets = ref([]);

async function loadClosets() {
  loading.value = true;

  try {
    const result = await getPersonalClosetList();
    closets.value = result?.list || [];
  } catch (error) {
    console.error("loadClosets failed", error);
    uni.showToast({
      title: error?.message || "衣橱列表加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

function goCreateCloset() {
  uni.navigateTo({
    url: ROUTES.closetCreate,
  });
}

onShow(() => {
  loadClosets();
});
</script>

<style>
.page {
  min-height: 100vh;
  padding: 44rpx 28rpx 88rpx;
  background:
    radial-gradient(circle at top, rgba(214, 223, 205, 0.48), transparent 36%),
    linear-gradient(180deg, #f7f4ee 0%, #fcfbf8 38%, #f3efe6 100%);
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 30rpx;
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

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
