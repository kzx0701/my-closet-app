<template>
  <view class="page noise-texture">
    <!-- Hero 区 -->
    <view class="hero fade-up-delay-1" :style="{ paddingTop: statusBarHeight + 'px' }">
      <scope-badge text="Profile · 个人中心" />

      <!-- 加载骨架屏 -->
      <template v-if="loading">
        <view class="avatar">
          <view class="skeleton skeleton-avatar"></view>
        </view>
        <view class="skeleton skeleton-name"></view>
        <view class="skeleton skeleton-meta"></view>
        <view class="stats">
          <view class="stat">
            <view class="skeleton skeleton-stat-num"></view>
            <view class="skeleton skeleton-stat-label"></view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat">
            <view class="skeleton skeleton-stat-num"></view>
            <view class="skeleton skeleton-stat-label"></view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat">
            <view class="skeleton skeleton-stat-num"></view>
            <view class="skeleton skeleton-stat-label"></view>
          </view>
        </view>
      </template>

      <!-- 已加载 -->
      <template v-else>
        <view class="avatar">
          <text class="avatar-text">{{ avatarText }}</text>
        </view>

        <text class="user-name">{{ userInfo.nickname || "未设置昵称" }}</text>
        <text class="user-meta">{{ metaText }}</text>

        <!-- 统计区 -->
        <view class="stats">
          <view class="stat" @click="goClosets">
            <text class="stat-num">{{ stats.closetCount }}</text>
            <text class="stat-label">衣橱</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat" @click="goClothes">
            <text class="stat-num stat-num-accent">{{ stats.clothesCount }}</text>
            <text class="stat-label">衣物</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat" @click="goFamilyShared">
            <text class="stat-num">{{ stats.familySharedCount }}</text>
            <text class="stat-label">家庭共享</text>
          </view>
        </view>
      </template>
    </view>

    <!-- 列表区 -->
    <view class="list-area">
      <!-- Account · 账户 -->
      <view class="group fade-up-delay-2">
        <text class="group-label">Account · 账户</text>
        <view class="profile-item" @click="goUserInfo">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </view>
          <text class="item-label">个人资料</text>
          <text class="item-value">{{ userInfo.nickname || "未设置" }}</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view class="profile-item" @click="goAccountSecurity">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </view>
          <text class="item-label">账号安全</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>

      <!-- Family · 家庭 -->
      <view class="group fade-up-delay-3">
        <text class="group-label">Family · 家庭</text>
        <view class="profile-item" @click="goFamilyManage">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </view>
          <text class="item-label">家庭名称</text>
          <text class="item-value">{{ familyInfo.hasFamily ? familyInfo.name : "未加入" }}</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view v-if="familyInfo.hasFamily" class="profile-item" @click="copyInviteCode">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </view>
          <text class="item-label">邀请码</text>
          <text class="item-value">{{ familyInfo.inviteCode || "—" }}</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view v-if="familyInfo.hasFamily" class="profile-item">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </view>
          <text class="item-label">家庭成员</text>
          <text class="item-value">{{ familyMembers.length }} 人</text>
        </view>

        <!-- 家庭成员列表 -->
        <view v-if="familyInfo.hasFamily && familyMembers.length > 0" class="member-list">
          <view v-for="member in familyMembers" :key="member.user_id" class="member-item">
            <view class="member-avatar">
              <text class="member-avatar-text">{{ getMemberInitial(member) }}</text>
            </view>
            <view class="member-info">
              <text class="member-name">{{ member.nickname || member.username || "未设置" }}</text>
              <text class="member-role">{{ member.role === "admin" ? "管理员" : "成员" }}</text>
            </view>
            <text
              v-if="familyInfo.role === 'admin' && member.user_id !== currentUserId"
              class="member-remove"
              @click="confirmRemoveMember(member)"
            >
              移除
            </text>
          </view>
        </view>

        <!-- 管理员退出家庭提示 -->
        <view v-if="familyInfo.hasFamily && familyInfo.role === 'admin'" class="admin-hint">
          <text class="admin-hint-text">你是管理员，如需退出请先移除其他成员或联系客服</text>
        </view>

        <view v-if="familyInfo.hasFamily && familyInfo.role !== 'admin'" class="profile-item" @click="confirmLeaveFamily">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </view>
          <text class="item-label">退出家庭</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>

      <!-- Settings · 设置 -->
      <view class="group fade-up-delay-4">
        <text class="group-label">Settings · 设置</text>
        <view class="profile-item" @click="goNotifications">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </view>
          <text class="item-label">通知设置</text>
          <text class="item-tag">即将上线</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view class="profile-item" @click="handleClearCache">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </view>
          <text class="item-label">缓存清理</text>
          <text class="item-value">{{ cacheSize }}</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view class="profile-item" @click="goAbout">
          <view class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </view>
          <text class="item-label">关于 四季衣橱</text>
          <text class="item-value">{{ appVersion }}</text>
          <view class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-area fade-up-delay-5">
        <text class="logout-text" @click="handleLogout">退出登录</text>
      </view>
    </view>

    <h5-tab-bar :current-route="ROUTES.profile" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import ScopeBadge from "@/components/ScopeBadge.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getFamilyMembers, leaveFamily, removeFamilyMember } from "@/common/api/modules/family.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { getHomeSummary } from "@/common/api/modules/closet.js";
import { mutations } from "@/uni_modules/uni-id-pages/common/store.js";

const userInfo = ref({
  nickname: "",
  username: "",
  avatar: "",
});

const familyInfo = ref({
  hasFamily: false,
  name: "",
  inviteCode: "",
  role: "",
  memberCount: 0,
});

const familyMembers = ref([]);
const currentUserId = ref("");
const statusBarHeight = ref(20);
const loading = ref(false);

const stats = ref({
  closetCount: 0,
  clothesCount: 0,
  familySharedCount: 0,
});

const cacheSize = ref("—");
const appVersion = ref("v1.0.0");

const avatarText = computed(() => {
  const name = userInfo.value.nickname || userInfo.value.username || "";
  return name.charAt(0).toUpperCase() || "U";
});

const metaText = computed(() => {
  if (familyInfo.value.hasFamily) {
    const role = familyInfo.value.role === "admin" ? "Admin" : "Member";
    return `Family · ${familyInfo.value.name || "家庭"} · ${role}`;
  }
  return "Personal · 个人空间";
});

async function loadUserInfo() {
  const session = getCurrentSession();
  if (!session?.uid) return;

  currentUserId.value = session.uid;

  try {
    const info = await getCurrentUserInfo(session.uid);
    if (info) {
      userInfo.value = info;
    }
  } catch (error) {
    console.error("loadUserInfo failed", error);
  }
}

async function loadStats() {
  try {
    const personalSummary = await getHomeSummary({ scopeType: "personal" });
    stats.value.closetCount = personalSummary?.closetCount || 0;
    stats.value.clothesCount = personalSummary?.clothesCount || 0;

    if (familyInfo.value.hasFamily) {
      const familySummary = await getHomeSummary({ scopeType: "family" });
      stats.value.familySharedCount = familySummary?.clothesCount || 0;
    } else {
      stats.value.familySharedCount = 0;
    }
  } catch (error) {
    console.error("loadStats failed", error);
  }
}

async function loadFamilyInfo() {
  const session = getCurrentSession();
  if (!session?.uid) return;

  const membership = await getFamilyMembership(session.uid);

  if (membership.status === "success" && membership.hasFamily) {
    const family = membership.familyRecord;
    const member = membership.membershipRecord;
    familyInfo.value = {
      hasFamily: true,
      name: family?.name || "",
      inviteCode: family?.invite_code || "",
      role: member?.role || "",
      memberCount: family?.member_count || 0,
    };

    await loadFamilyMembers();
  } else {
    familyInfo.value = {
      hasFamily: false,
      name: "",
      inviteCode: "",
      role: "",
      memberCount: 0,
    };
    familyMembers.value = [];
  }
}

async function loadFamilyMembers() {
  try {
    const result = await getFamilyMembers();
    familyMembers.value = result?.members || [];
  } catch (error) {
    console.error("loadFamilyMembers failed", error);
    familyMembers.value = [];
    uni.showToast({
      title: "家庭成员加载失败",
      icon: "none",
    });
  }
}

function getMemberInitial(member) {
  const name = member.nickname || member.username || "";
  return name.charAt(0).toUpperCase() || "M";
}

function copyInviteCode() {
  if (!familyInfo.value.inviteCode) {
    uni.showToast({ title: "暂无邀请码", icon: "none" });
    return;
  }
  uni.setClipboardData({
    data: familyInfo.value.inviteCode,
    success: () => {
      uni.showToast({ title: "邀请码已复制", icon: "success" });
    },
  });
}

function goFamilyManage() {
  if (familyInfo.value.hasFamily) {
    const isAdmin = familyInfo.value.role === "admin";
    const items = ["复制邀请码"];
    if (!isAdmin) {
      items.push("退出家庭");
    }
    uni.showActionSheet({
      itemList: items,
      success: (res) => {
        const action = items[res.tapIndex];
        if (action === "复制邀请码") {
          copyInviteCode();
        } else if (action === "退出家庭") {
          confirmLeaveFamily();
        }
      },
    });
  } else {
    uni.navigateTo({ url: ROUTES.familyGuide });
  }
}

function confirmLeaveFamily() {
  uni.showModal({
    title: "退出家庭",
    content: "退出后你将无法访问家庭空间的数据，是否继续？",
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await leaveFamily();
        uni.showToast({ title: "已退出家庭", icon: "success" });
        await loadFamilyInfo();
      } catch (error) {
        console.error("leaveFamily failed", error);
        uni.showToast({
          title: error?.message || "退出家庭失败",
          icon: "none",
        });
      }
    },
  });
}

function confirmRemoveMember(member) {
  const memberName = member.nickname || member.username || "该成员";

  uni.showModal({
    title: "移除成员",
    content: `确定要将 ${memberName} 移出家庭吗？`,
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await removeFamilyMember({ userId: member.user_id });
        uni.showToast({ title: "已移除成员", icon: "success" });
        await loadFamilyMembers();
      } catch (error) {
        console.error("removeFamilyMember failed", error);
        uni.showToast({
          title: error?.message || "移除成员失败",
          icon: "none",
        });
      }
    },
  });
}

function goUserInfo() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/userinfo/userinfo",
  });
}

function goClosets() {
  uni.switchTab({ url: ROUTES.closets });
}

function goClothes() {
  uni.switchTab({ url: ROUTES.clothes });
}

function goFamilyShared() {
  if (familyInfo.value.hasFamily) {
    const session = getCurrentSession();
    setClosetScopeState(session?.uid, "family");
    uni.switchTab({ url: ROUTES.clothes });
  } else {
    uni.navigateTo({ url: ROUTES.familyGuide });
  }
}

function goNotifications() {
  uni.showToast({ title: "该功能即将上线", icon: "none" });
}

function formatStorageSize(bytes) {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function refreshCacheSize() {
  try {
    const info = uni.getStorageInfoSync();
    cacheSize.value = formatStorageSize(info.currentSize * 1024);
  } catch (e) {
    console.error("getStorageInfoSync failed", e);
    cacheSize.value = "—";
  }
}

function handleClearCache() {
  uni.showModal({
    title: "缓存清理",
    content: `当前缓存大小 ${cacheSize.value}，确定要清理吗？`,
    success: (res) => {
      if (!res.confirm) return;
      uni.showLoading({ title: "清理中..." });
      try {
        uni.clearStorageSync();
        refreshCacheSize();
        uni.hideLoading();
        uni.showToast({ title: "缓存已清理", icon: "success" });
      } catch (e) {
        console.error("clearStorageSync failed", e);
        uni.hideLoading();
        uni.showToast({ title: "清理失败", icon: "none" });
      }
    },
  });
}

function goAbout() {
  uni.showModal({
    title: "关于 四季衣橱",
    content: `四季衣橱 Season Closet ${appVersion.value}\n\n一款帮你管理衣橱与衣物的轻量工具，支持个人空间与家庭共享，让收纳更从容。`,
    showCancel: false,
    confirmText: "知道了",
  });
}

function goAccountSecurity() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
    fail: () => {
      uni.showToast({ title: "该功能即将上线", icon: "none" });
    },
  });
}

function handleLogout() {
  uni.showModal({
    title: "退出登录",
    content: "退出后将回到登录页，是否继续？",
    success: async (res) => {
      if (!res.confirm) return;
      await mutations.logout();
      uni.reLaunch({ url: ROUTES.entry });
    },
  });
}

onShow(async () => {
  const session = getCurrentSession();
  if (!session.hasLogin) {
    uni.showToast({ title: "请先登录", icon: "none", duration: 1500 });
    setTimeout(() => {
      uni.navigateTo({ url: ROUTES.login });
    }, 500);
    return;
  }

  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  refreshCacheSize();

  loading.value = true;
  try {
    await loadUserInfo();
    await loadFamilyInfo();
    await loadStats();
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: $gradient-hero;
  overflow: hidden;
}

/* Hero 区 */
.hero {
  position: relative;
  z-index: 2;
  padding: 0 56rpx 56rpx;
  color: $color-text-inverse;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  margin-top: 32rpx;
  margin-bottom: 28rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-family: $font-serif;
  font-size: 56rpx;
  font-weight: 600;
  color: $color-text-inverse;
}

.user-name {
  display: block;
  margin-bottom: 12rpx;
  font-family: $font-serif;
  font-size: 48rpx;
  font-weight: 600;
  line-height: 1.2;
  color: $color-text-inverse;
}

.user-meta {
  display: block;
  margin-bottom: 48rpx;
  font-family: $font-mono;
  font-size: 24rpx;
  letter-spacing: 1px;
  color: $inverse-55;
}

/* 统计区 */
.stats {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-num {
  font-family: $font-serif;
  font-size: 52rpx;
  font-weight: 300;
  line-height: 1;
  color: $inverse-85;
}

.stat-num-accent {
  color: $color-terra-soft;
}

.stat-label {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $inverse-55;
}

.stat-divider {
  width: 1px;
  height: 64rpx;
  background: $inverse-25;
}

/* 列表区 */
.list-area {
  position: relative;
  z-index: 2;
  padding: 0 56rpx 240rpx;
}

.group {
  margin-top: 56rpx;
}

.group-label {
  display: block;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 0;
  border-bottom: 1px solid $color-border-soft;
  transition: background 0.2s ease;
}

.profile-item:active {
  background: rgba(58, 84, 67, 0.04);
}

.item-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-secondary;
  flex-shrink: 0;
}

.item-icon svg {
  width: 40rpx;
  height: 40rpx;
}

.item-label {
  flex: 1;
  font-family: $font-sans;
  font-size: 28rpx;
  color: $color-text-title;
}

.item-tag {
  font-family: $font-sans;
  font-size: 20rpx;
  color: $color-text-placeholder;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: rgba(58, 84, 67, 0.06);
  flex-shrink: 0;
}

.item-value {
  font-family: $font-sans;
  font-size: 26rpx;
  color: $color-text-placeholder;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-arrow {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-placeholder;
  flex-shrink: 0;
}

.item-arrow svg {
  width: 32rpx;
  height: 32rpx;
}

/* 家庭成员列表 */
.member-list {
  margin-top: 16rpx;
  padding: 8rpx 0 8rpx 64rpx;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 0;
}

.member-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(58, 84, 67, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-avatar-text {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-primary;
}

.member-info {
  flex: 1;
}

.member-name {
  display: block;
  font-family: $font-sans;
  font-size: 26rpx;
  font-weight: 500;
  color: $color-text-title;
}

.member-role {
  display: block;
  margin-top: 4rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 1px;
  color: $color-text-placeholder;
}

.member-remove {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-terra;
  padding: 8rpx 16rpx;
}

/* 管理员退出家庭提示 */
.admin-hint {
  margin-top: 16rpx;
  padding: 20rpx 28rpx;
  background: rgba(58, 84, 67, 0.04);
  border-radius: 12rpx;
}

.admin-hint-text {
  font-family: $font-sans;
  font-size: 24rpx;
  line-height: 1.6;
  color: $color-text-placeholder;
}

/* 退出登录 */
.logout-area {
  margin-top: 72rpx;
  display: flex;
  justify-content: center;
}

.logout-text {
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 500;
  color: $color-terra;
  padding: 16rpx 48rpx;
  transition: opacity 0.2s ease;
}

.logout-text:active {
  opacity: 0.7;
}

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 8rpx;
}

.skeleton-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
}

.skeleton-name {
  height: 48rpx;
  width: 240rpx;
  margin-top: 32rpx;
  margin-bottom: 16rpx;
  border-radius: 8rpx;
}

.skeleton-meta {
  height: 24rpx;
  width: 320rpx;
  margin-bottom: 48rpx;
  border-radius: 8rpx;
}

.skeleton-stat-num {
  height: 52rpx;
  width: 80rpx;
  border-radius: 8rpx;
}

.skeleton-stat-label {
  height: 22rpx;
  width: 80rpx;
  margin-top: 8rpx;
  border-radius: 8rpx;
}
</style>
