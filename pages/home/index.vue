<template>
  <view class="page">
    <!-- 背景层：随页面滚动 -->
    <view class="page-bg"></view>

    <!-- 顶部绿色区 -->
    <view class="hero-zone">
      <view class="topbar">
        <view class="greeting">
          <text class="greeting-hi">{{ greetingText }}</text>
          <text class="greeting-name">{{ nickname }}</text>
        </view>
        <view class="logout-btn" @click="handleLogout">
          <view class="logout-icon"></view>
        </view>
      </view>

      <view class="scope-info">
        <view class="scope-badge">
          <view class="scope-badge-dot"></view>
          <text class="scope-badge-text">{{ scopeBadgeText }}</text>
        </view>
        <text class="scope-title">
          {{ scopeTitleMain }}<text class="scope-title-em">{{ scopeTitleSub }}</text>
        </text>
        <text class="scope-desc">{{ scopeDesc }}</text>
        <view class="scope-meta-inline">
          <view class="scope-meta-item" v-for="item in scopeMetaItems" :key="item.key">
            <text class="scope-meta-key">{{ item.key }}</text>
            <text class="scope-meta-val" :class="{ accent: item.accent }">{{ item.val }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="stats-zone">
      <text class="stats-label">Overview · 概览</text>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">{{ summaryData.closetCount }}</text>
          <text class="stat-label">衣橱</text>
        </view>
        <view class="stat-item">
          <text class="stat-value accent">{{ summaryData.clothesCount }}</text>
          <text class="stat-label">衣物</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ summaryData.unassignedCount }}</text>
          <text class="stat-label">未归类</text>
        </view>
      </view>
    </view>

    <!-- 核心操作 -->
    <view class="actions-zone">
      <view class="action-card dark" @click="goClosets">
        <view class="card-top">
          <view class="card-number-wrap">
            <text class="card-number">{{ summaryData.closetCount }}</text>
            <text class="card-number-unit">个</text>
          </view>
        </view>
        <view class="card-bottom">
          <text class="card-title">{{ isFamilyMode ? "家庭衣橱" : "我的衣橱" }}</text>
          <text class="card-subtitle">查看和管理</text>
        </view>
        <view class="card-arrow"></view>
      </view>

      <view class="action-card light" @click="goClothes">
        <view class="card-top">
          <view class="card-number-wrap">
            <text class="card-number">{{ summaryData.clothesCount }}</text>
            <text class="card-number-unit">件</text>
          </view>
        </view>
        <view class="card-bottom">
          <text class="card-title">{{ isFamilyMode ? "家庭衣物" : "我的衣物" }}</text>
          <text class="card-subtitle">浏览列表</text>
        </view>
        <view class="card-arrow"></view>
      </view>
    </view>

    <!-- 家庭协作区 -->
    <view class="family-zone">
      <text class="family-label">Family · 家庭协作</text>

      <!-- 已加入家庭 -->
      <view v-if="isFamilyMode" class="family-invite-box">
        <view class="family-name-row">
          <text class="family-name">{{ familyRecord?.name || "未命名家庭" }}</text>
          <text class="family-role">{{ membershipRecord?.role === "admin" ? "Admin" : "Member" }}</text>
        </view>
        <view class="invite-row">
          <text class="invite-label">邀请码</text>
          <text class="invite-code">{{ familyRecord?.invite_code || "—" }}</text>
          <view class="copy-btn" @click="copyInviteCode">
            <view class="copy-icon"></view>
          </view>
        </view>
        <view class="members-row">
          <view class="member-avatar admin">我</view>
          <text class="member-more">共 {{ familyRecord?.member_count || 1 }} 人</text>
        </view>
      </view>

      <!-- 未加入家庭 -->
      <view v-else class="family-empty-box">
        <text class="family-empty-title">开启<text class="family-empty-em">家庭</text>协作</text>
        <text class="family-empty-desc">加入后可和家人共享衣橱与衣物，按角色协作管理。</text>
        <view class="family-empty-actions">
          <button class="btn-primary" @click="goCreateFamily">创建家庭</button>
          <button class="btn-secondary" @click="goJoinFamily">加入家庭</button>
        </view>
      </view>
    </view>

    <!-- 季节贴士 -->
    <view class="season-tip">
      <text class="season-tip-label">{{ seasonLabel }}</text>
      <text class="season-tip-text">{{ seasonTipText }}</text>
    </view>

    <!-- H5 TabBar -->
    <h5-tab-bar :current-route="ROUTES.home" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { getHomeSummary } from "@/common/api/modules/closet.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { ROUTES } from "@/common/constants/routes.js";
import { setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyGuideSkipState } from "@/common/services/family-guide-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";

const nickname = ref("");
const isFamilyMode = ref(false);
const familyRecord = ref(null);
const membershipRecord = ref(null);
const hasSkippedFamilyGuide = ref(false);
const closetCount = ref(0);
const clothesCount = ref(0);
const unassignedCount = ref(0);

// 小程序端加载自定义字体（仅 Fraunces，用于数字和邀请码）
// #ifdef MP-WEIXIN
const fontsLoaded = ref(false);

function loadCustomFonts() {
  if (fontsLoaded.value) return;
  uni.loadFontFace({
    family: "Fraunces",
    source: 'url("https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.woff2")',
    global: false,
    success() {
      console.log("Font loaded: Fraunces");
    },
    fail(err) {
      console.warn("Font load failed: Fraunces", err);
    },
  });
  fontsLoaded.value = true;
}
// #endif

// 问候语
const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
});

// 季节
const currentSeason = computed(() => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
});

const seasonLabel = computed(() => {
  const labels = {
    spring: "Spring · 春日提示",
    summer: "Summer · 夏日提示",
    autumn: "Autumn · 秋日提示",
    winter: "Winter · 冬日提示",
  };
  return labels[currentSeason.value];
});

const seasonTipText = computed(() => {
  const tips = {
    spring: "「春天来了，整理一下薄外套，把厚冬装收起来吧。」",
    summer: "「夏天到了，检查一下透气凉爽的衣物是否齐全。」",
    autumn: "「入秋了，把薄外套翻出来，检查去年的冬装是否还能穿。」",
    winter: "「冬天来了，检查冬装是否齐全，别等降温了再翻箱倒柜。」",
  };
  return tips[currentSeason.value];
});

// 空间徽章
const scopeBadgeText = computed(() => {
  if (isFamilyMode.value) {
    const role = membershipRecord.value?.role === "admin" ? "管理员" : "成员";
    return `Family Space · ${role}`;
  }
  return "Personal Space";
});

// 标题（主词 + 斜体词）
const scopeTitleMain = computed(() => {
  return isFamilyMode.value ? familyRecord.value?.name?.charAt(0) || "家" : "个人";
});

const scopeTitleSub = computed(() => {
  return isFamilyMode.value
    ? familyRecord.value?.name?.slice(1) || "空间"
    : "空间";
});

const scopeDesc = computed(() => {
  if (isFamilyMode.value) {
    return "和家人一起管理家庭衣橱与衣物，协作收纳更有序。";
  }
  return "管理你自己的衣橱和衣物，随时可以创建或加入家庭。";
});

// 元信息行
const scopeMetaItems = computed(() => {
  if (isFamilyMode.value) {
    return [
      { key: "Role", val: "管理员", accent: membershipRecord.value?.role === "admin" },
      { key: "Members", val: `${familyRecord.value?.member_count || 1} 位成员`, accent: false },
    ];
  }
  return [
    { key: "Mode", val: "个人模式", accent: false },
    { key: "Family", val: hasSkippedFamilyGuide.value ? "可随时加入" : "尚未加入", accent: false },
  ];
});

// 汇总数据
const summaryData = computed(() => ({
  closetCount: String(closetCount.value),
  clothesCount: String(clothesCount.value),
  unassignedCount: String(unassignedCount.value),
}));

async function syncClosetSummary() {
  try {
    const summary = await getHomeSummary({
      scopeType: isFamilyMode.value ? "family" : "personal",
    });
    closetCount.value = summary?.closetCount || 0;
    clothesCount.value = summary?.clothesCount || 0;
    unassignedCount.value = summary?.unassignedClothesCount || 0;
  } catch (error) {
    console.error("syncClosetSummary failed", error);
    closetCount.value = 0;
    clothesCount.value = 0;
    unassignedCount.value = 0;
  }
}

async function syncScopeStatus() {
  const session = getCurrentSession();
  if (!session.hasLogin) return;

  // 加载用户昵称
  try {
    const info = await getCurrentUserInfo(session.uid);
    if (info) nickname.value = info.nickname || info.username || "用户";
  } catch (e) {
    nickname.value = "用户";
  }

  const membership = await getFamilyMembership(session.uid);
  if (membership.status !== "success") return;

  familyRecord.value = membership.familyRecord || null;
  membershipRecord.value = membership.membershipRecord || null;
  hasSkippedFamilyGuide.value = getFamilyGuideSkipState(session.uid);

  if (membership.hasFamily) {
    isFamilyMode.value = true;
  } else {
    isFamilyMode.value = false;
  }

  await syncClosetSummary();
}

function goClosets() {
  const session = getCurrentSession();
  setClosetScopeState(session?.uid, isFamilyMode.value ? "family" : "personal");
  uni.switchTab({ url: ROUTES.closets });
}

function goClothes() {
  uni.switchTab({ url: ROUTES.clothes });
}

function goCreateFamily() {
  uni.navigateTo({ url: ROUTES.familyCreate });
}

function goJoinFamily() {
  uni.navigateTo({ url: ROUTES.familyGuide });
}

function copyInviteCode() {
  const code = familyRecord.value?.invite_code;
  if (!code) {
    uni.showToast({ title: "暂无邀请码", icon: "none" });
    return;
  }
  uni.setClipboardData({
    data: code,
    success: () => uni.showToast({ title: "邀请码已复制", icon: "success" }),
  });
}

function handleLogout() {
  uni.showModal({
    title: "退出登录",
    content: "退出后将回到登录页，是否继续？",
    success: async (res) => {
      if (!res.confirm) return;
      await mutations.logout();
    },
  });
}

onShow(() => {
  // #ifdef MP-WEIXIN
  loadCustomFonts();
  // #endif
  syncScopeStatus();
});
</script>

<style lang="scss">
// Fraunces：远程加载的衬线字体，仅用于纯数字和英文（邀请码、统计数字）
$font-serif: "Fraunces", Georgia, serif;
// 中文/正文：系统字体
$font-cn: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
$font-sans: "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif;
$font-mono: "PingFang SC", "Microsoft YaHei", "Consolas", monospace;

.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: $color-bg-page;
}

/* 背景层：随页面滚动 */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  z-index: 0;
  background: $gradient-hero;
}

/* 顶部绿色区 */
.hero-zone {
  position: relative;
  z-index: 2;
  padding: 0 28px 36px;
  color: $color-text-inverse;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0 36px;
}

.greeting {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.greeting-hi {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.5);
}

.greeting-name {
  font-family: $font-cn;
  font-size: 17px;
  font-weight: 500;
  color: $color-text-inverse;
  letter-spacing: -0.2px;
}

.logout-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-icon {
  width: 15px;
  height: 15px;
  border: 1.8px solid rgba(244, 239, 230, 0.6);
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
  transform: rotate(45deg);
}

.scope-info {
  position: relative;
}

.scope-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.scope-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $color-terra-soft;
  box-shadow: 0 0 8px $color-terra-soft;
}

.scope-badge-text {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.55);
}

.scope-title {
  font-family: $font-cn;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.8px;
  color: $color-text-inverse;
  margin-bottom: 10px;
}

.scope-title-em {
  font-weight: 300;
  color: $color-sage-light;
}

.scope-desc {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(244, 239, 230, 0.5);
  max-width: 280px;
  margin-bottom: 20px;
}

/* 元信息行 */
.scope-meta-inline {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

.scope-meta-item {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.scope-meta-item + .scope-meta-item::before {
  content: "·";
  margin: 0 10px;
  color: rgba(244, 239, 230, 0.25);
  font-size: 13px;
}

.scope-meta-key {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.35);
}

.scope-meta-val {
  font-family: $font-cn;
  font-size: 14px;
  font-weight: 500;
  color: rgba(244, 239, 230, 0.85);
}

.scope-meta-val.accent {
  color: $color-terra-soft;
}

/* 数据概览 */
.stats-zone {
  position: relative;
  z-index: 2;
  padding: 0 28px;
}

.stats-label {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 14px;
  display: block;
}

.stats-row {
  display: flex;
  align-items: baseline;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.stat-item + .stat-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: $color-border;
}

.stat-value {
  font-family: $font-serif;
  font-size: 36px;
  font-weight: 300;
  line-height: 1;
  color: $color-primary-dark;
  letter-spacing: -1px;
}

.stat-value.accent {
  color: $color-terra;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: $color-text-secondary;
}

/* 核心操作 */
.actions-zone {
  position: relative;
  z-index: 2;
  padding: 32px 28px 0;
  display: flex;
  gap: 12px;
}

.action-card {
  flex: 1;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
}

.action-card.dark {
  background: $color-primary;
  padding: 20px 18px;
}

.action-card.light {
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  padding: 20px 18px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-number-wrap {
  display: flex;
  align-items: baseline;
}

.card-number {
  font-family: $font-serif;
  font-size: 44px;
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -2px;
}

.action-card.dark .card-number {
  color: $color-sage-light;
}

.action-card.light .card-number {
  color: $color-terra;
}

.card-number-unit {
  font-family: $font-mono;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-left: 4px;
  opacity: 0.5;
}

.card-bottom {
  margin-top: 20px;
}

.card-title {
  font-family: $font-cn;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 2px;
  display: block;
}

.action-card.dark .card-title {
  color: $color-text-inverse;
}

.action-card.light .card-title {
  color: $color-primary-dark;
}

.card-subtitle {
  font-size: 11px;
  line-height: 1.4;
  display: block;
}

.action-card.dark .card-subtitle {
  color: rgba(244, 239, 230, 0.5);
}

.action-card.light .card-subtitle {
  color: $color-text-placeholder;
}

.card-arrow {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 12px;
  height: 12px;
  border-top: 1.5px solid;
  border-right: 1.5px solid;
  transform: rotate(45deg);
  opacity: 0.3;
}

.action-card.dark .card-arrow {
  border-color: $color-sage-light;
}

.action-card.light .card-arrow {
  border-color: $color-primary;
}

/* 家庭协作区 */
.family-zone {
  position: relative;
  z-index: 2;
  padding: 28px 28px 0;
}

.family-label {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 14px;
  display: block;
}

.family-invite-box {
  padding: 22px;
  border-radius: 18px;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
}

.family-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.family-name {
  font-family: $font-cn;
  font-size: 17px;
  font-weight: 600;
  color: $color-primary-dark;
}

.family-role {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-terra;
  padding: 3px 10px;
  border: 1px solid rgba(184, 92, 58, 0.25);
  border-radius: 999px;
}

.invite-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
}

.invite-label {
  font-size: 12px;
  color: $color-text-placeholder;
}

.invite-code {
  font-family: $font-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 4px;
  color: $color-primary-dark;
}

.copy-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $color-bg-chip;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-icon {
  width: 14px;
  height: 14px;
  border: 1.8px solid $color-primary;
  border-radius: 3px;
  border-top: none;
  border-left: none;
  position: relative;
}

.copy-icon::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  width: 10px;
  height: 10px;
  border: 1.8px solid $color-primary;
  border-radius: 2px;
}

.members-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: $color-moss;
  color: $color-text-inverse;
  display: flex;
  justify-content: center;
  font-family: $font-cn;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid $color-bg-card-end;
}

.member-avatar.admin {
  background: $color-terra;
}

.member-more {
  font-size: 11px;
  color: $color-text-placeholder;
  margin-left: 4px;
}

/* 未加入家庭 */
.family-empty-box {
  padding: 26px 22px;
  border-radius: 18px;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  text-align: center;
}

.family-empty-title {
  font-family: $font-cn;
  font-size: 16px;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 6px;
  display: block;
}

.family-empty-em {
  color: $color-terra;
}

.family-empty-desc {
  font-size: 12px;
  color: $color-text-placeholder;
  line-height: 1.6;
  margin-bottom: 16px;
  display: block;
}

.family-empty-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $color-primary;
  color: $color-text-inverse;
  border: none;
  font-size: 12px;
  font-weight: 600;
  line-height: 40px;
}

.btn-secondary {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: transparent;
  color: $color-primary-dark;
  border: 1px solid $color-border;
  font-size: 12px;
  font-weight: 600;
  line-height: 40px;
}

/* 季节贴士 */
.season-tip {
  margin: 28px 28px;
  padding: 16px 18px;
  border-left: 2px solid $color-terra;
  position: relative;
  z-index: 2;
}

.season-tip-label {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-terra;
  margin-bottom: 6px;
  display: block;
}

.season-tip-text {
  font-family: $font-cn;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: $color-text-secondary;
}
</style>
