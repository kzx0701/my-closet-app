<template>
  <view class="page noise-texture">
    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-back" @click="goBack">
        <view class="nav-back-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </view>
      </view>
      <text class="nav-title">个人资料</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 头像区域 -->
    <view class="avatar-section fade-up-delay-1">
      <view class="avatar-wrap">
        <view class="avatar-ring"></view>
        <view class="avatar">
          <image
            v-if="userInfo.avatar"
            :src="userInfo.avatar"
            class="avatar-img"
            mode="aspectFill"
          />
          <text v-else class="avatar-text">{{ avatarText }}</text>
        </view>
        <view class="avatar-edit" hover-class="avatar-edit-hover" :hover-stay-time="100" @click="changeAvatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </view>
      </view>
      <text class="avatar-hint">点击头像可更换</text>
    </view>

    <!-- 资料卡片组 -->
    <view class="content">

      <!-- 基本信息 -->
      <view class="section fade-up-delay-2">
        <text class="section-label">Basic Info · 基本信息</text>
        <view class="card-group">
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="editNickname">
            <view class="card-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </view>
            <view class="card-item-body">
              <text class="card-item-label">用户名</text>
            </view>
            <view class="card-item-value">
              <text class="card-item-value-text">{{ userInfo.nickname || userInfo.username || '未设置' }}</text>
            </view>
            <view class="card-item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="section fade-up-delay-3">
        <text class="section-label">Contact · 联系方式</text>
        <view class="card-group">
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goBindMobile">
            <view class="card-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </view>
            <view class="card-item-body">
              <text class="card-item-label">手机号</text>
            </view>
            <view class="card-item-value">
              <text v-if="userInfo.mobile" class="card-item-value-text">{{ maskedMobile }}</text>
              <text v-else class="card-item-value-text card-item-value-empty">未绑定</text>
            </view>
            <view class="card-item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
          <view class="card-divider"></view>
          <view class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goBindEmail">
            <view class="card-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </view>
            <view class="card-item-body">
              <text class="card-item-label">邮箱</text>
            </view>
            <view class="card-item-value">
              <text v-if="userInfo.email" class="card-item-value-text">{{ userInfo.email }}</text>
              <text v-else class="card-item-value-text card-item-value-empty">未绑定</text>
            </view>
            <view class="card-item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 账户安全 -->
      <view class="section fade-up-delay-4">
        <text class="section-label">Security · 安全设置</text>
        <view class="card-group">
          <view v-if="hasPassword" class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goChangePassword">
            <view class="card-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </view>
            <view class="card-item-body">
              <text class="card-item-label">修改密码</text>
            </view>
            <view class="card-item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
          <view v-else class="card-item" hover-class="card-item-hover" :hover-stay-time="100" @click="goSetPassword">
            <view class="card-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </view>
            <view class="card-item-body">
              <text class="card-item-label">设置密码</text>
            </view>
            <view class="card-item-value">
              <text class="card-item-value-text card-item-value-empty">未设置</text>
            </view>
            <view class="card-item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view class="bottom-space"></view>
    </view>

    <!-- 昵称编辑弹窗 -->
    <uni-popup ref="nicknamePopup" type="dialog">
      <uni-popup-dialog
        mode="input"
        :value="userInfo.nickname"
        @confirm="confirmNickname"
        title="修改昵称"
        placeholder="请输入昵称"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getCurrentSession } from "@/common/services/auth.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { store, mutations } from "@/uni_modules/uni-id-pages/common/store.js";

const statusBarHeight = ref(20);
const hasPassword = ref(false);
const currentUserId = ref("");

const userInfo = ref({
  nickname: "",
  username: "",
  avatar: "",
  mobile: "",
  email: "",
});

const nicknamePopup = ref(null);

const avatarText = computed(() => {
  const name = userInfo.value.nickname || userInfo.value.username || "";
  return name.charAt(0).toUpperCase() || "U";
});

const maskedMobile = computed(() => {
  const mobile = userInfo.value.mobile;
  if (!mobile || mobile.length < 7) return mobile;
  return mobile.slice(0, 3) + "****" + mobile.slice(7);
});

function goBack() {
  uni.navigateBack({ delta: 1 });
}

async function loadUserInfo() {
  const session = getCurrentSession();
  if (!session?.uid) return;

  currentUserId.value = session.uid;

  // 先从 store 获取缓存数据（含 mobile、email）
  const storeInfo = store.userInfo || {};
  userInfo.value = {
    nickname: storeInfo.nickname || "",
    username: storeInfo.username || "",
    avatar: storeInfo.avatar_file?.url || "",
    mobile: storeInfo.mobile || "",
    email: storeInfo.email || "",
  };

  // 再从数据库获取最新数据
  try {
    const freshInfo = await getCurrentUserInfo(session.uid);
    if (freshInfo) {
      userInfo.value.nickname = freshInfo.nickname || userInfo.value.nickname;
      userInfo.value.username = freshInfo.username || userInfo.value.username;
      userInfo.value.avatar = freshInfo.avatar || userInfo.value.avatar;
    }
  } catch (e) {
    console.error("loadUserInfo failed", e);
  }

  // 检查是否已设置密码
  try {
    const uniIdCo = uniCloud.importObject("uni-id-co");
    const res = await uniIdCo.getAccountInfo();
    hasPassword.value = res?.isPasswordSet || false;
  } catch (e) {
    console.error("getAccountInfo failed", e);
  }
}

function editNickname() {
  nicknamePopup.value?.open();
}

async function confirmNickname(nickname) {
  if (!nickname || !nickname.trim()) {
    uni.showToast({ title: "昵称不能为空", icon: "none" });
    return;
  }
  const trimmed = nickname.trim();
  // mutations.updateUserInfo 内部会更新 DB、store 并显示 toast，无需重复提示
  mutations.updateUserInfo({ nickname: trimmed });
  userInfo.value.nickname = trimmed;
  nicknamePopup.value?.close();
}

function changeAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      await uploadAvatar(tempFilePath);
    },
    fail: () => {
      // 用户取消选择，静默处理
    },
  });
}

async function uploadAvatar(filePath) {
  uni.showLoading({ title: "上传中...", mask: true });
  try {
    const ext = filePath.split(".").pop() || "jpg";
    const cloudPath = `avatar/${currentUserId.value || Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadResult = await uniCloud.uploadFile({
      filePath,
      cloudPath,
      fileType: "image",
    });

    const avatarFile = {
      name: cloudPath,
      extname: ext,
      url: uploadResult.fileID,
    };

    uni.hideLoading();
    // mutations.updateUserInfo 内部会更新 DB、store 并显示"更新成功" toast
    mutations.updateUserInfo({ avatar_file: avatarFile });
    userInfo.value.avatar = avatarFile.url;
  } catch (error) {
    console.error("uploadAvatar failed", error);
    uni.hideLoading();
    uni.showToast({ title: error?.message || "头像上传失败", icon: "none" });
  }
}

function goBindMobile() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile",
  });
}

function goBindEmail() {
  uni.showToast({ title: "邮箱绑定功能开发中", icon: "none" });
}

function goChangePassword() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
  });
}

function goSetPassword() {
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd",
  });
}

onLoad(() => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  loadUserInfo();
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

/* ===== 导航栏 ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding-left: 14px;
  padding-right: 14px;
  padding-bottom: 12px;
  background: $color-bg-page;
}

.nav-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-back:active {
  opacity: 0.6;
}

.nav-back-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(58, 84, 67, 0.06);
  border: 1px solid rgba(58, 84, 67, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-primary-dark;
}

.nav-back-icon svg {
  width: 16px;
  height: 16px;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-sans;
  font-size: 15px;
  font-weight: 600;
  color: $color-text-title;
  margin-right: 36px;
}

.nav-placeholder {
  width: 36px;
  height: 36px;
}

/* ===== 头像区域 ===== */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 28px;
}

.avatar-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 12px;
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 1.5px solid rgba(58, 84, 67, 0.15);
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary-soft, $color-sage);
  border: 2px solid #ffffff;
  box-shadow: 0 4px 16px rgba(58, 84, 67, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-text {
  font-family: $font-serif;
  font-size: 40px;
  font-weight: 600;
  color: #ffffff;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.avatar-edit svg {
  width: 14px;
  height: 14px;
  stroke: $color-primary;
}

.avatar-edit-hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-hint {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
}

/* ===== 内容区 ===== */
.content {
  padding: 0 28px;
}

.section {
  margin-bottom: 24px;
}

.section-label {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 10px;
  display: block;
}

/* ===== 卡片组 ===== */
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
  gap: 12px;
  padding: 15px 16px;
  transition: background 0.2s ease;
}

.card-item-hover {
  background: rgba(58, 84, 67, 0.03);
}

.card-item-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(58, 84, 67, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-item-icon svg {
  width: 16px;
  height: 16px;
  stroke: $color-text-secondary;
}

.card-item-body {
  flex: 1;
  min-width: 0;
}

.card-item-label {
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 500;
  color: $color-text-title;
}

.card-item-value {
  flex-shrink: 0;
  margin-right: 2px;
}

.card-item-value-text {
  font-family: $font-sans;
  font-size: 13px;
  color: $color-text-secondary;
}

.card-item-value-empty {
  color: $color-text-placeholder;
}

.card-item-arrow {
  width: 16px;
  height: 16px;
  color: $color-text-placeholder;
  flex-shrink: 0;
}

.card-item-arrow svg {
  width: 16px;
  height: 16px;
}

.card-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 0 16px;
}

/* ===== 底部留白 ===== */
.bottom-space {
  height: 40px;
}
</style>
