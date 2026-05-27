<template>
  <view class="page">
    <view class="page-head">
      <view>
        <text class="eyebrow">{{ pageEyebrow }}</text>
        <text class="title">{{ pageTitle }}</text>
        <text class="desc">{{ pageDesc }}</text>
      </view>
      <button v-if="allowCreate" class="create-btn" @click="goCreateCloset">新建</button>
    </view>

    <view v-if="showScopeSwitch" class="scope-switch">
      <button
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'personal' }"
        @click="changeScope('personal')"
      >
        个人衣橱
      </button>
      <button
        class="scope-chip"
        :class="{ 'scope-chip-active': scopeType === 'family' }"
        @click="changeScope('family')"
      >
        家庭衣橱
      </button>
    </view>

    <closet-empty-state
      v-if="!loading && closets.length === 0"
      :scope-type="scopeType"
      :can-create="allowCreate"
      @create="goCreateCloset"
    />

    <view v-else class="list">
      <closet-list-card
        v-for="item in closets"
        :key="item._id"
        :closet="item"
        @edit="goEditCloset"
        @delete="confirmDeleteCloset"
      />
    </view>

    <h5-tab-bar :current-route="ROUTES.closets" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { deleteCloset, getFamilyClosetList, getPersonalClosetList } from "@/common/api/modules/closet.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getClosetScopeState, setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import ClosetEmptyState from "./components/ClosetEmptyState.vue";
import ClosetListCard from "./components/ClosetListCard.vue";

const loading = ref(false);
const closets = ref([]);
const scopeType = ref("personal");
const hasFamily = ref(false);

const allowCreate = computed(() => scopeType.value === "personal" || hasFamily.value);
const showScopeSwitch = computed(() => hasFamily.value);
const pageEyebrow = computed(() => (scopeType.value === "family" ? "FAMILY CLOSETS" : "PERSONAL CLOSETS"));
const pageTitle = computed(() => (scopeType.value === "family" ? "家庭衣橱" : "我的衣橱"));
const pageDesc = computed(() =>
  scopeType.value === "family"
    ? "这里展示当前家庭下的全部衣橱，方便家庭成员协作管理，管理员也能查看不同创建者的衣橱。"
    : showScopeSwitch.value
      ? "这里是你的个人衣橱空间；需要切换到家庭视角时，可以直接使用上方切换。"
      : "这里是你的个人衣橱空间，适合先按房间、季节或用途整理自己的收纳结构。"
);

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
    setClosetScopeState(session.uid, "personal");
    return;
  }

  scopeType.value = getClosetScopeState(session.uid);
}

function changeScope(nextScopeType) {
  if (nextScopeType === scopeType.value) {
    return;
  }

  if (nextScopeType === "family" && !hasFamily.value) {
    return;
  }

  const session = getCurrentSession();
  scopeType.value = nextScopeType;
  setClosetScopeState(session?.uid, nextScopeType);
  loadClosets();
}

async function loadClosets() {
  loading.value = true;

  try {
    const result = scopeType.value === "family" ? await getFamilyClosetList() : await getPersonalClosetList();
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
    url: scopeType.value === "family" ? `${ROUTES.closetCreate}?scopeType=family` : ROUTES.closetCreate,
  });
}

function goEditCloset(closet) {
  const targetClosetId = closet?._id;

  if (!targetClosetId) {
    uni.showToast({
      title: "缺少衣橱ID",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: `${ROUTES.closetCreate}?closetId=${targetClosetId}`,
  });
}

function confirmDeleteCloset(closet) {
  const targetClosetId = closet?._id;

  if (!targetClosetId) {
    uni.showToast({
      title: "缺少衣橱ID",
      icon: "none",
    });
    return;
  }

  uni.showModal({
    title: "删除衣橱",
    content: "删除后该衣橱下已绑定的衣物会变为未归类，是否继续？",
    success: async (res) => {
      if (!res.confirm) {
        return;
      }

      try {
        await deleteCloset({
          closetId: targetClosetId,
        });

        uni.showToast({
          title: "衣橱已删除",
          icon: "success",
        });

        loadClosets();
      } catch (error) {
        console.error("deleteCloset failed", error);
        uni.showToast({
          title: error?.message || "衣橱删除失败",
          icon: "none",
        });
      }
    },
  });
}

onShow(async () => {
  await syncScopeType();
  loadClosets();
});
</script>

<style>
.page {
  min-height: 100vh;
  padding: 44rpx 28rpx 0;
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

.scope-switch {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12rpx 24rpx rgba(73, 81, 69, 0.06);
}

.scope-chip {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 999rpx;
  background: transparent;
  color: #6c786b;
  font-size: 24rpx;
  border: none;
}

.scope-chip-active {
  background: #edf1ea;
  color: #314033;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
