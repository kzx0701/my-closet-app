<template>
  <view class="page">
    <view class="page-head">
      <view>
        <text class="page-eyebrow">HOME</text>
        <text class="page-title">衣橱首页</text>
      </view>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>

    <scope-status-card
      :title="scopeTitle"
      :desc="scopeDesc"
      :badge="scopeBadge"
      :meta-items="scopeMetaItems"
    />

    <view class="section">
      <view class="section-head">
        <text class="section-title">快捷操作</text>
        <text class="section-subtitle">先从最常用的动作开始</text>
      </view>
      <home-quick-actions :items="quickActions" @select="handleQuickAction" />
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">当前空间摘要</text>
        <text class="section-subtitle">后续会接入真实数据</text>
      </view>
      <view class="stats-grid">
        <view class="stat-card" v-for="item in summaryItems" :key="item.label">
          <text class="stat-value">{{ item.value }}</text>
          <text class="stat-label">{{ item.label }}</text>
          <text class="stat-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">{{ collaborationTitle }}</text>
        <text class="section-subtitle">围绕家庭协作的当前入口</text>
      </view>
      <view class="panel-card">
        <text class="panel-desc">{{ collaborationDesc }}</text>
        <view class="panel-actions">
          <button
            v-for="item in collaborationActions"
            :key="item.title"
            class="panel-btn"
            @click="handlePanelAction(item)"
          >
            {{ item.title }}
          </button>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">提示事项</text>
        <text class="section-subtitle">给你一个自然的下一步</text>
      </view>
      <view class="tips-list">
        <view class="tip-card" v-for="item in noticeItems" :key="item.title">
          <view class="tip-dot"></view>
          <view class="tip-body">
            <text class="tip-title">{{ item.title }}</text>
            <text class="tip-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getCurrentSession } from "@/common/services/auth.js";
import { ROUTES } from "@/common/constants/routes.js";
import { getFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";
import HomeQuickActions from "./components/HomeQuickActions.vue";
import ScopeStatusCard from "./components/ScopeStatusCard.vue";

const scopeTitle = ref("个人空间");
const scopeDesc = ref("你当前还没有加入家庭，可以先管理自己的衣橱和衣物。");
const scopeBadge = ref("个人模式");
const scopeMetaItems = ref([]);
const quickActions = ref([]);
const summaryItems = ref([]);
const collaborationTitle = ref("家庭协作");
const collaborationDesc = ref("你还没有加入家庭，可以先创建家庭，或通过邀请码加入已有家庭。");
const collaborationActions = ref([]);
const noticeItems = ref([]);
const isFamilyMode = ref(false);
const familyRecord = ref(null);
const membershipRecord = ref(null);
const hasSkippedFamilyGuide = ref(false);

function buildPageSections() {
  scopeMetaItems.value = isFamilyMode.value
    ? [
        {
          label: "家庭名称",
          value: familyRecord.value?.name || "未命名家庭",
        },
        {
          label: "我的角色",
          value: membershipRecord.value?.role === "admin" ? "管理员" : "成员",
        },
      ]
    : [
        {
          label: "当前模式",
          value: "个人空间",
        },
        {
          label: "家庭状态",
          value: hasSkippedFamilyGuide.value ? "可随时加入家庭" : "尚未加入家庭",
        },
      ];

  quickActions.value = isFamilyMode.value
    ? [
        { title: "衣橱管理", desc: "查看和管理当前家庭下的衣橱。", tag: "下一步", action: "wardrobes" },
        { title: "衣物管理", desc: "查看家庭衣物列表与详情。", tag: "下一步", action: "clothes" },
        { title: "创建衣橱", desc: "为家庭空间新增一个衣橱。", tag: "待接入", action: "create-wardrobe" },
        { title: "添加衣物", desc: "把新的衣物记录到家庭空间。", tag: "待接入", action: "create-clothing" },
      ]
    : [
        { title: "衣橱管理", desc: "查看和管理个人空间下的衣橱。", tag: "下一步", action: "wardrobes" },
        { title: "衣物管理", desc: "查看个人衣物列表与详情。", tag: "下一步", action: "clothes" },
        { title: "创建家庭", desc: "创建一个家庭并邀请家人加入。", tag: "已可用", action: "create-family" },
        { title: "加入家庭", desc: "通过邀请码加入已有家庭。", tag: "已可用", action: "join-family" },
      ];

  summaryItems.value = isFamilyMode.value
    ? [
        { value: "0", label: "家庭衣橱", desc: "当前家庭下的衣橱数量" },
        { value: "0", label: "家庭衣物", desc: "当前家庭下的衣物数量" },
        { value: "0", label: "未归类衣物", desc: "暂未放入衣橱的衣物" },
        {
          value: String(familyRecord.value?.member_count || 1),
          label: "家庭成员",
          desc: "当前已加入家庭的人数",
        },
      ]
    : [
        { value: "0", label: "个人衣橱", desc: "当前个人空间下的衣橱数量" },
        { value: "0", label: "个人衣物", desc: "当前个人空间下的衣物数量" },
        { value: "0", label: "未归类衣物", desc: "暂未放入衣橱的衣物" },
        { value: "0", label: "待加入家庭", desc: "加入家庭后可开启协作模式" },
      ];

  if (isFamilyMode.value) {
    collaborationTitle.value = "家庭协作";
    collaborationDesc.value = familyRecord.value?.invite_code
      ? `当前家庭邀请码：${familyRecord.value.invite_code}，你可以发给家人邀请他们加入。`
      : "当前家庭已创建，后续可以继续完善成员与邀请码相关能力。";
    collaborationActions.value = [
      { title: "查看家庭信息", action: "family-info" },
      { title: "复制邀请码", action: "copy-invite" },
    ];
    noticeItems.value = [
      {
        title: "先创建第一个家庭衣橱",
        desc: "家庭空间适合按卧室、季节或成员来划分衣橱。",
      },
      {
        title: "邀请家人加入",
        desc: "把邀请码发给家人后，就能共同维护家庭空间的数据。",
      },
    ];
    return;
  }

  collaborationTitle.value = "家庭协作";
  collaborationDesc.value = hasSkippedFamilyGuide.value
    ? "你当前正在使用个人模式。准备好后，可以随时创建家庭或通过邀请码加入已有家庭。"
    : "加入家庭后，可以和家人共享衣橱与衣物数据，也能按角色协作管理。";
  collaborationActions.value = [
    { title: "创建家庭", action: "create-family" },
    { title: "加入家庭", action: "join-family" },
  ];
  noticeItems.value = [
    {
      title: "先创建你的第一个衣橱",
      desc: "可以先按收纳位置、季节或使用场景来划分个人衣橱。",
    },
    {
      title: "个人与家庭数据并存",
      desc: "加入家庭后，个人空间的数据仍会独立保留，不会自动迁移。",
    },
  ];
}

async function syncScopeStatus() {
  const session = getCurrentSession();

  if (!session.hasLogin) {
    isFamilyMode.value = false;
    scopeTitle.value = "访客状态";
    scopeDesc.value = "当前未获取到有效登录态，首页仅展示静态骨架内容。";
    scopeBadge.value = "未登录";
    familyRecord.value = null;
    membershipRecord.value = null;
    hasSkippedFamilyGuide.value = false;
    buildPageSections();
    return;
  }

  const membership = await getFamilyMembership(session.uid);

  if (membership.status === "failed") {
    isFamilyMode.value = false;
    scopeTitle.value = "状态检查失败";
    scopeDesc.value = membership.errorMessage || "家庭状态查询失败，请稍后重试。";
    scopeBadge.value = "需重试";
    familyRecord.value = null;
    membershipRecord.value = null;
    hasSkippedFamilyGuide.value = false;
    buildPageSections();
    return;
  }

  if (membership.status === "unauthorized") {
    isFamilyMode.value = false;
    scopeTitle.value = "登录已失效";
    scopeDesc.value = "当前登录态已失效，请重新登录后继续。";
    scopeBadge.value = "需登录";
    familyRecord.value = null;
    membershipRecord.value = null;
    hasSkippedFamilyGuide.value = false;
    buildPageSections();
    return;
  }

  familyRecord.value = membership.familyRecord || null;
  membershipRecord.value = membership.membershipRecord || null;
  hasSkippedFamilyGuide.value = getFamilyGuideSkipState(session.uid);

  if (membership.hasFamily) {
    isFamilyMode.value = true;
    scopeTitle.value = familyRecord.value?.name || "家庭空间";
    scopeDesc.value = "你当前正在家庭空间中，后续可以和家人一起管理家庭衣橱与衣物。";
    scopeBadge.value = membershipRecord.value?.role === "admin" ? "管理员" : "家庭成员";
    buildPageSections();
    return;
  }

  isFamilyMode.value = false;
  scopeTitle.value = "个人空间";
  scopeDesc.value = hasSkippedFamilyGuide.value
    ? "你已跳过家庭引导，当前以个人模式进入首页，后续仍可创建或加入家庭。"
    : "你当前还没有加入家庭，可以先在个人空间里管理自己的衣橱和衣物。";
  scopeBadge.value = hasSkippedFamilyGuide.value ? "已跳过家庭引导" : "个人模式";
  buildPageSections();
}

function handleQuickAction(item) {
  if (item.action === "wardrobes") {
    return uni.navigateTo({
      url: ROUTES.closets,
    });
  }

  if (item.action === "create-family") {
    return uni.navigateTo({
      url: ROUTES.familyCreate,
    });
  }

  if (item.action === "join-family") {
    return uni.navigateTo({
      url: ROUTES.familyGuide,
    });
  }

  uni.showToast({
    title: "该功能将在下一批接入",
    icon: "none",
  });
}

function handlePanelAction(item) {
  if (item.action === "create-family") {
    return uni.navigateTo({
      url: ROUTES.familyCreate,
    });
  }

  if (item.action === "join-family") {
    return uni.navigateTo({
      url: ROUTES.familyGuide,
    });
  }

  if (item.action === "copy-invite") {
    if (!familyRecord.value?.invite_code) {
      uni.showToast({
        title: "当前还没有可用邀请码",
        icon: "none",
      });
      return;
    }

    return uni.setClipboardData({
      data: familyRecord.value.invite_code,
      success: () => {
        uni.showToast({
          title: "邀请码已复制",
          icon: "success",
        });
      },
    });
  }

  uni.showToast({
    title: "该功能将在下一批接入",
    icon: "none",
  });
}

function handleLogout() {
  uni.showModal({
    title: "退出登录",
    content: "退出后将回到登录页，是否继续？",
    success: async (res) => {
      if (!res.confirm) {
        return;
      }

      await mutations.logout();
    },
  });
}

onShow(() => {
  syncScopeStatus();
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26rpx;
}

.page-eyebrow {
  display: block;
  font-size: 22rpx;
  letter-spacing: 4rpx;
  color: #7c8979;
}

.page-title {
  display: block;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #2b362d;
}

.logout-btn {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.88);
  color: #556451;
  font-size: 24rpx;
  box-shadow: 0 12rpx 26rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.1);
}

.section {
  margin-top: 34rpx;
}

.section-head {
  margin-bottom: 18rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2d392f;
}

.section-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #7a8678;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.stat-card,
.panel-card {
  padding: 28rpx 24rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 16rpx 36rpx rgba(73, 81, 69, 0.08);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.stat-value {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
  color: #2d3a2f;
}

.stat-label {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #485447;
}

.stat-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.65;
  color: #73806f;
}

.panel-desc {
  display: block;
  font-size: 24rpx;
  line-height: 1.75;
  color: #657164;
}

.panel-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 24rpx;
}

.panel-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 999rpx;
  background: #edf1ea;
  color: #314033;
  font-size: 24rpx;
  border: none;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.tip-card {
  display: flex;
  gap: 18rpx;
  align-items: flex-start;
  padding: 24rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14rpx 30rpx rgba(73, 81, 69, 0.06);
}

.tip-dot {
  width: 16rpx;
  height: 16rpx;
  margin-top: 12rpx;
  border-radius: 50%;
  background: #7a9070;
  flex-shrink: 0;
}

.tip-body {
  flex: 1;
}

.tip-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #314033;
}

.tip-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 23rpx;
  line-height: 1.7;
  color: #687466;
}
</style>
