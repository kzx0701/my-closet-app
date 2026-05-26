<template>
  <view class="page">
    <scope-status-card :title="scopeTitle" :desc="scopeDesc" />
    <view class="section">
      <text class="section-title">后续入口预留</text>
      <home-quick-actions :items="quickActions" />
    </view>
  </view>
</template>

<script>
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import HomeQuickActions from "./components/HomeQuickActions.vue";
import ScopeStatusCard from "./components/ScopeStatusCard.vue";

export default {
  components: {
    ScopeStatusCard,
    HomeQuickActions,
  },
  data() {
    return {
      scopeTitle: "个人空间",
      scopeDesc: "当前为首页骨架页，后续会在这里接入衣橱、衣物和空间切换能力。",
      quickActions: [
        {
          title: "衣橱入口",
          desc: "下一批会接入个人或家庭维度下的衣橱管理。",
        },
        {
          title: "衣物入口",
          desc: "后续会在这里接入衣物列表、详情和编辑能力。",
        },
      ],
    };
  },
  onShow() {
    this.syncScopeStatus();
  },
  methods: {
    async syncScopeStatus() {
      const session = getCurrentSession();

      if (!session.hasLogin) {
        this.scopeTitle = "个人空间";
        this.scopeDesc = "当前未获取到有效登录态，首页仅展示骨架内容。";
        return;
      }

      const membership = await getFamilyMembership(session.uid);

      if (membership.hasFamily) {
        this.scopeTitle = "家庭空间";
        this.scopeDesc = "检测到你已加入家庭。当前批次首页先展示容器页，后续会接入家庭数据。";
        return;
      }

      this.scopeTitle = "个人空间";
      this.scopeDesc = "你当前尚未加入家庭，可以先在个人空间里管理自己的衣橱和衣物。";
    },
  },
};
</script>

<style>
.page {
  min-height: 100vh;
  padding: 48rpx 28rpx 80rpx;
  background: linear-gradient(180deg, #f6f4ee 0%, #ffffff 42%, #f0ece3 100%);
}

.section {
  margin-top: 32rpx;
}

.section-title {
  display: block;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #4b5648;
}
</style>
