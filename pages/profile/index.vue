<template>
  <view class="page noise-texture">
    <!-- ===== Hero 区 ===== -->
    <view class="hero" :style="{ paddingTop: statusBarHeight + 'px' }">
      <!-- 装饰性 SVG 线条 -->
      <view class="hero-deco">
        <svg viewBox="0 0 375 280" preserveAspectRatio="none" class="deco-svg">
          <path d="M 0 60 Q 187 30 375 60" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
          <path d="M 0 120 Q 187 90 375 120" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
          <path d="M 0 200 Q 187 170 375 200" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
        </svg>
      </view>

      <!-- 顶部标记 -->
      <view class="hero-topbar">
        <view class="hero-mark">
          <view class="hero-mark-dot"></view>
          <text class="hero-mark-text">PROFILE</text>
        </view>
      </view>

      <!-- 加载骨架屏 -->
      <template v-if="loading">
        <view class="hero-body">
          <view class="avatar-wrap">
            <view class="skeleton skeleton-avatar"></view>
          </view>
          <view class="skeleton skeleton-name"></view>
          <view class="skeleton skeleton-meta"></view>
        </view>
      </template>

      <!-- 已加载 -->
      <template v-else>
        <view class="hero-body fade-up-delay-1">
          <view class="avatar-wrap">
            <view class="avatar-ring"></view>
            <image
              v-if="userInfo.avatar"
              class="avatar avatar-image"
              :src="userInfo.avatar"
              mode="aspectFill"
            />
            <view v-else class="avatar">
              <text class="avatar-text">{{ avatarText }}</text>
            </view>
          </view>
          <text class="user-name">{{ userInfo.nickname || userInfo.username || "未设置昵称" }}</text>
          <text class="user-meta">{{ metaText }}</text>
        </view>
      </template>
    </view>

    <!-- ===== 内容区 ===== -->
    <view class="content">

      <!-- 账户信息 -->
      <view class="section fade-up-delay-2">
        <text class="section-label">Account · 账户</text>
        <view class="card-group">
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goUserInfo">
            <view class="card-item-icon">
              <uni-icons type="person" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">个人资料</text>
              <text class="card-item-desc">昵称、头像等个人信息</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
          <view class="card-divider"></view>
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goAccountSecurity">
            <view class="card-item-icon">
              <uni-icons type="locked" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">账号安全</text>
              <text class="card-item-desc">密码修改、安全设置</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 家庭协作 -->
      <view class="section fade-up-delay-3">
        <text class="section-label">Family · 家庭协作</text>

        <!-- 已加入家庭 -->
        <view v-if="familyInfo.hasFamily" class="card-group">
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goFamilyManage">
            <view class="card-item-icon family-icon">
              <uni-icons type="home" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <view class="card-item-title-row">
                <text class="card-item-title">{{ familyInfo.name || "未命名家庭" }}</text>
                <view class="role-tag">
                  <text class="role-tag-text">{{ familyInfo.role === 'admin' ? 'Admin' : 'Member' }}</text>
                </view>
              </view>
              <view class="card-item-desc-row">
                <view class="member-avatars-inline">
                  <view
                    v-for="member in displayMembers"
                    :key="member.user_id"
                    class="mini-avatar"
                    :class="{ 'mini-avatar-admin': member.role === 'admin' }"
                  >
                    <text class="mini-avatar-text">{{ getMemberInitial(member) }}</text>
                  </view>
                  <text v-if="extraMemberCount > 0" class="mini-more">+{{ extraMemberCount }}</text>
                </view>
                <text class="card-item-desc">{{ familyMembers.length }} 位成员</text>
              </view>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
          <view class="card-divider"></view>
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="copyInviteCode">
            <view class="card-item-icon">
              <uni-icons type="paperclip" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">邀请码</text>
              <text class="card-item-desc">分享给家人加入</text>
            </view>
            <view class="card-item-value">
              <text class="invite-code-value">{{ familyInfo.inviteCode || "—" }}</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
          <view class="card-divider"></view>
          <view
            v-if="familyInfo.role !== 'admin'"
            class="card-item card-item-danger"
            hover-class="card-item-danger-hover"
            :hover-stay-time="100"
            @click="confirmLeaveFamily"
          >
            <view class="card-item-icon danger-icon">
              <uni-icons type="redo" size="18" color="#B85C3A"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title danger-title">退出家庭</text>
              <text class="card-item-desc">退出后将无法访问家庭数据</text>
            </view>
          </view>
          <view
            v-else
            class="card-item"
            hover-class="card-item-hover"
            :hover-stay-time="100"
            @click="showMemberManagement"
          >
            <view class="card-item-icon">
              <uni-icons type="staff" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">管理成员</text>
              <text class="card-item-desc">移除家庭成员</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
        </view>

        <!-- 未加入家庭 -->
        <view v-else class="family-cta-card" hover-class="family-cta-card-hover" :hover-stay-time="100" @click="goFamilyGuide">
          <view class="family-cta-left">
            <view class="family-cta-icon-wrap">
              <uni-icons type="home" size="22" color="#2D4334"></uni-icons>
            </view>
            <view class="family-cta-content">
              <text class="family-cta-title">开启<text class="em">家庭</text>协作</text>
              <text class="family-cta-desc">和家人共享衣橱与衣物</text>
            </view>
          </view>
          <uni-icons type="right" size="16" color="#B8C4B0"></uni-icons>
        </view>
      </view>

      <!-- 应用设置 -->
      <view class="section fade-up-delay-4">
        <text class="section-label">Settings · 设置</text>
        <view class="card-group">
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="handleClearCache">
            <view class="card-item-icon">
              <uni-icons type="trash" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">缓存清理</text>
            </view>
            <view class="card-item-value">
              <text class="card-item-value-text">{{ cacheSize }}</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
          <view class="card-divider"></view>
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="handleDataExport">
            <view class="card-item-icon">
              <uni-icons type="download" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">数据导出 / 备份</text>
              <text class="card-item-desc">将衣橱与衣物数据导出为本地备份</text>
            </view>
            <view class="card-item-value">
              <text class="card-item-value-text tag-coming">即将上线</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
          <view class="card-divider"></view>
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goAbout">
            <view class="card-item-icon">
              <uni-icons type="info" size="18" color="#2D4334"></uni-icons>
            </view>
            <view class="card-item-body">
              <text class="card-item-title">关于 四季衣橱</text>
            </view>
            <view class="card-item-value">
              <text class="card-item-value-text">{{ appVersion }}</text>
            </view>
            <view class="card-item-arrow">
              <uni-icons type="right" size="14" color="#B8C4B0"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section fade-up-delay-5">
        <view class="logout-btn" hover-class="logout-btn-hover" :hover-stay-time="100" @click="handleLogout">
          <uni-icons type="undo" size="16" color="#B85C3A"></uni-icons>
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 底部品牌 -->
      <view class="brand-footer fade-up-delay-5">
        <text class="brand-text">Season Closet</text>
        <text class="brand-version">{{ appVersion }}</text>
      </view>
    </view>

    <h5-tab-bar :current-route="ROUTES.profile" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getFamilyMembers, leaveFamily, removeFamilyMember } from "@/common/api/modules/family.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { mutations, store } from "@/uni_modules/uni-id-pages/common/store.js";
import { clearUserCache } from "@/common/services/cache-service.js";

const userInfo = ref({
  nickname: "",
  username: "",
  avatar: "",
  mobile: "",
  email: "",
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

const cacheSize = ref("—");
const appVersion = ref("v1.0.0");
const hasPassword = ref(false);
const hasInitialized = ref(false);

const MAX_DISPLAY_MEMBERS = 4;
const displayMembers = computed(() => familyMembers.value.slice(0, MAX_DISPLAY_MEMBERS));
const extraMemberCount = computed(() => Math.max(0, familyMembers.value.length - MAX_DISPLAY_MEMBERS));

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
      // 同步最新昵称到 uni-id-pages store，避免其他页面读到旧数据
      // 注意：avatar_file 结构含 name/extname/url，此处仅有 url，不完整，
      // 头像更新已在 user-info 页通过 mutations.updateUserInfo 同步，无需在此覆盖
      if (info.nickname) {
        mutations.setUserInfo({ nickname: info.nickname });
      }
    } else {
      // clientDB 查询失败时，从 uni-id-pages store 缓存读取
      const cached = store.userInfo || {};
      if (cached && Object.keys(cached).length > 0) {
        userInfo.value = {
          nickname: cached.nickname || "",
          username: cached.username || "",
          avatar: cached.avatar_file?.url || "",
          mobile: cached.mobile || "",
          email: cached.email || "",
        };
      }
    }
  } catch (error) {
    console.error("loadUserInfo failed", error);
    // 出错时也从 store 缓存读取
    const cached = store.userInfo || {};
    if (cached && Object.keys(cached).length > 0) {
      userInfo.value = {
        nickname: cached.nickname || "",
        username: cached.username || "",
        avatar: cached.avatar_file?.url || "",
        mobile: cached.mobile || "",
        email: cached.email || "",
      };
    }
  }
}

async function loadFamilyInfo() {
  const session = getCurrentSession();
  if (!session?.uid) return;

  try {
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
  } catch (error) {
    console.error("loadFamilyInfo failed", error);
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
    if (isAdmin && familyMembers.value.length > 0) {
      items.push("管理成员");
    }
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
        } else if (action === "管理成员") {
          showMemberManagement();
        }
      },
    });
  } else {
    uni.navigateTo({ url: ROUTES.familyGuide });
  }
}

function showMemberManagement() {
  if (familyMembers.value.length === 0) {
    uni.showToast({ title: "暂无其他成员", icon: "none" });
    return;
  }
  const otherMembers = familyMembers.value.filter((m) => m.user_id !== currentUserId.value);

  if (otherMembers.length === 0) {
    uni.showToast({ title: "暂无其他成员", icon: "none" });
    return;
  }

  const memberNames = otherMembers.map((m) => m.nickname || m.username || "未设置");

  uni.showActionSheet({
    itemList: memberNames,
    success: (res) => {
      confirmRemoveMember(otherMembers[res.tapIndex]);
    },
  });
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
        // 刷新家庭信息，刷新失败不影响退出成功的事实
        try {
          await loadFamilyInfo();
        } catch (refreshError) {
          console.error("loadFamilyInfo after leave failed", refreshError);
        }
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
        // 刷新成员列表，刷新失败不影响移除成功的事实
        try {
          await loadFamilyMembers();
        } catch (refreshError) {
          console.error("loadFamilyMembers after remove failed", refreshError);
        }
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
    url: ROUTES.userInfo,
  });
}

function goFamilyGuide() {
  uni.navigateTo({ url: ROUTES.familyGuide });
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
    content: `当前缓存大小 ${cacheSize.value}，确定要清理吗？\n（仅清理业务缓存，不影响登录状态）`,
    success: (res) => {
      if (!res.confirm) return;
      uni.showLoading({ title: "清理中..." });
      try {
        // 仅清理当前用户的业务数据缓存，保留登录 token 和用户信息
        const uid = currentUserId.value;
        if (uid) {
          clearUserCache(uid);
        } else {
          // uid 尚未加载时，清理所有 cache: 前缀的缓存
          const info = uni.getStorageInfoSync();
          info.keys.forEach((key) => {
            if (key.startsWith("cache:")) {
              uni.removeStorageSync(key);
            }
          });
        }
        refreshCacheSize();
        uni.hideLoading();
        uni.showToast({ title: "缓存已清理", icon: "success" });
      } catch (e) {
        console.error("clearUserCache failed", e);
        uni.hideLoading();
        uni.showToast({ title: "清理失败", icon: "none" });
      }
    },
  });
}

function handleDataExport() {
  uni.showModal({
    title: "数据导出 / 备份",
    content: "该功能正在开发中，上线后可将衣橱、衣物等数据导出为本地文件备份。",
    showCancel: false,
    confirmText: "知道了",
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

async function goAccountSecurity() {
  // 已查询过密码状态时直接跳转，否则先查询
  if (!hasPassword.value) {
    try {
      const uniIdCo = uniCloud.importObject("uni-id-co");
      const res = await uniIdCo.getAccountInfo();
      hasPassword.value = res?.isPasswordSet || false;
    } catch (e) {
      console.error("getAccountInfo failed", e);
    }
  }

  const targetUrl = hasPassword.value
    ? "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd"
    : "/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd";

  uni.navigateTo({
    url: targetUrl,
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
      // mutations.logout() 内部已重定向到登录页，无需再次 reLaunch
      await mutations.logout();
    },
  });
}

onLoad(() => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif

  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }
});

onShow(async () => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif

  const session = getCurrentSession();
  if (!session.hasLogin) {
    uni.showToast({ title: "请先登录", icon: "none", duration: 1500 });
    setTimeout(() => {
      uni.navigateTo({ url: ROUTES.login });
    }, 500);
    return;
  }

  refreshCacheSize();

  if (!hasInitialized.value) {
    // 首次加载：串行请求
    hasInitialized.value = true;
    hasPassword.value = false;
    loading.value = true;
    try {
      await loadUserInfo();
      await loadFamilyInfo();
    } catch (error) {
      console.error("profile onShow load failed", error);
    } finally {
      loading.value = false;
    }
  }
  // 非首次保持缓存状态，不重复请求
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: $color-bg-page;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page::-webkit-scrollbar {
  display: none;
}

/* ===== Hero 区 ===== */
.hero {
  position: relative;
  z-index: 2;
  padding: 0 28px 44px;
  color: $color-text-inverse;
  overflow: hidden;
  background: linear-gradient(180deg,
    $color-primary-dark 0%,
    $color-primary 30%,
    $color-primary-soft 55%,
    $color-sage 75%,
    $color-sage-light 90%,
    $color-bg-page 100%
  );
  border-radius: 0 0 32px 32px;
}

/* 装饰线条 */
.hero-deco {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.deco-svg {
  width: 100%;
  height: 100%;
}

/* 顶部标记 */
.hero-topbar {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.hero-mark {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: $radius-pill;
  background: rgba(244, 239, 230, 0.08);
  border: 1px solid rgba(244, 239, 230, 0.12);
  backdrop-filter: blur(20px);
}

.hero-mark-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $color-terra-soft;
  animation: pulseDot 2.5s ease-in-out infinite;
}

.hero-mark-text {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 3px;
  color: $inverse-85;
  font-weight: 500;
}

/* Hero 主体 */
.hero-body {
  position: relative;
  z-index: 2;
}

.avatar-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 1px solid rgba(244, 239, 230, 0.12);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(244, 239, 230, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  background: transparent;
  border: 2px solid rgba(244, 239, 230, 0.25);
}

.avatar-text {
  font-family: $font-serif;
  font-size: 34px;
  font-weight: 600;
  color: $color-text-inverse;
}

.user-name {
  display: block;
  margin-bottom: 8px;
  font-family: $font-serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
  color: $color-text-inverse;
  letter-spacing: -0.5px;
}

.user-meta {
  display: block;
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: $inverse-55;
}

/* ===== 内容区 ===== */
.content {
  position: relative;
  z-index: 2;
  padding: 0 28px 160px;
}

.section {
  margin-top: 28px;
}

.section-label {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 12px;
  display: block;
}

/* ===== 通用卡片组 ===== */
.card-group {
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  transition: background 0.2s ease;
}

.card-item-hover {
  background: rgba(58, 84, 67, 0.03);
}

.card-item-danger-hover {
  background: rgba(184, 92, 58, 0.04);
}

.card-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(58, 84, 67, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.family-icon {
  background: rgba(58, 84, 67, 0.08);
}

.danger-icon {
  background: rgba(184, 92, 58, 0.06);
}

.danger-icon svg {
  stroke: $color-terra;
}

.card-item-body {
  flex: 1;
  min-width: 0;
}

.card-item-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.card-item-title {
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 500;
  color: $color-text-title;
  display: block;
}

.danger-title {
  color: $color-terra;
}

.card-item-desc {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
  line-height: 1.4;
  display: block;
}

.card-item-desc-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 角色标签 */
.role-tag {
  padding: 1px 8px;
  border-radius: $radius-btn;
  border: 1px solid rgba(184, 92, 58, 0.2);
  flex-shrink: 0;
}

.role-tag-text {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-terra;
}

/* 成员头像行内 */
.member-avatars-inline {
  display: flex;
  align-items: center;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $color-moss;
  color: $color-text-inverse;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-serif;
  font-size: 8px;
  font-weight: 600;
  border: 1.5px solid #ffffff;
  margin-left: -4px;
}

.mini-avatar:first-child {
  margin-left: 0;
}

.mini-avatar-admin {
  background: $color-terra;
}

.mini-avatar-text {
  line-height: 1;
}

.mini-more {
  font-family: $font-sans;
  font-size: 9px;
  color: $color-text-placeholder;
  margin-left: 4px;
}

/* 邀请码值 */
.card-item-value {
  flex-shrink: 0;
}

.invite-code-value {
  font-family: $font-mono;
  font-size: 12px;
  letter-spacing: 1px;
  color: $color-primary;
  padding: 3px 10px;
  background: rgba(58, 84, 67, 0.05);
  border-radius: 6px;
}

.card-item-value-text {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
}

.tag-coming {
  font-size: 10px;
  color: $color-terra;
  padding: 2px 7px;
  background: rgba(184, 92, 58, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(184, 92, 58, 0.12);
}

.card-item-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 0 18px;
}

/* ===== 家庭 CTA 卡片 ===== */
.family-cta-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.family-cta-card-hover {
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(58, 84, 67, 0.06);
}

.family-cta-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.family-cta-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(58, 84, 67, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.family-cta-content {
  min-width: 0;
}

.family-cta-title {
  display: block;
  font-family: $font-serif;
  font-size: 15px;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 2px;
}

.family-cta-title .em {
  transform: skewX(-8deg);
  transform-origin: left center;
  display: inline-block;
  color: $color-terra;
}

.family-cta-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
  line-height: 1.4;
}

.family-cta-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== 退出登录 ===== */
.logout-section {
  margin-top: 36px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  border-radius: $radius-btn;
  background: rgba(184, 92, 58, 0.05);
  border: 1px solid rgba(184, 92, 58, 0.12);
  transition: all 0.2s ease;
}

.logout-btn-hover {
  background: rgba(184, 92, 58, 0.09);
}

.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-text {
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 500;
  color: $color-terra;
}

/* ===== 底部品牌 ===== */
.brand-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  padding-bottom: 16px;
}

.brand-text {
  font-family: $font-serif;
  font-size: 12px;
  font-weight: 400;
  color: $color-text-placeholder;
  letter-spacing: 0.5px;
}

.brand-version {
  font-family: $font-mono;
  font-size: 10px;
  color: $color-text-placeholder;
  opacity: 0.5;
}

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.skeleton-name {
  height: 26px;
  width: 160px;
  margin-top: 20px;
  margin-bottom: 8px;
  border-radius: 6px;
}

.skeleton-meta {
  height: 14px;
  width: 220px;
  border-radius: 6px;
}
</style>
