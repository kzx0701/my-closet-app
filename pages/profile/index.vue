<template>
  <view class="page">
    <!-- 用户信息卡片 -->
    <view class="profile-header">
      <view class="avatar-wrap">
        <u-image
          :src="userInfo.avatar || '/static/userImg/default.png'"
          width="120rpx"
          height="120rpx"
          shape="circle"
          bgColor="#edf1ea"
        >
          <template #error>
            <view class="avatar-fallback">
              <text class="avatar-text">{{ avatarText }}</text>
            </view>
          </template>
        </u-image>
      </view>
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
        <text class="username">{{ userInfo.username || '未设置用户名' }}</text>
      </view>
    </view>

    <!-- 家庭信息卡片 -->
    <view v-if="familyInfo.hasFamily" class="section-card">
      <view class="section-header">
        <text class="section-title">家庭信息</text>
        <u-tag :text="familyInfo.role === 'admin' ? '管理员' : '成员'" size="mini" type="success" plain />
      </view>
      <u-cell-group :border="false">
        <u-cell title="家庭名称" :value="familyInfo.name" :border="false" />
        <u-cell title="邀请码" :border="false">
          <template #right-icon>
            <view class="invite-code-wrap">
              <text class="invite-code">{{ familyInfo.inviteCode }}</text>
              <u-icon name="file-text" color="#314033" size="36" @click="copyInviteCode" />
            </view>
          </template>
        </u-cell>
        <u-cell title="成员数量" :value="`${familyMembers.length} 人`" :border="false" />
      </u-cell-group>
    </view>

    <!-- 家庭成员列表 -->
    <view v-if="familyInfo.hasFamily && familyMembers.length > 0" class="section-card">
      <view class="section-header">
        <text class="section-title">家庭成员</text>
      </view>
      <view class="member-list">
        <view v-for="member in familyMembers" :key="member.user_id" class="member-item">
          <u-image
            :src="member.avatar || '/static/userImg/default.png'"
            width="72rpx"
            height="72rpx"
            shape="circle"
            bgColor="#edf1ea"
          >
            <template #error>
              <view class="member-avatar-fallback">
                <text class="member-avatar-text">{{ getMemberInitial(member) }}</text>
              </view>
            </template>
          </u-image>
          <view class="member-info">
            <text class="member-name">{{ member.nickname || member.username || '未设置' }}</text>
            <text class="member-role">{{ member.role === 'admin' ? '管理员' : '成员' }}</text>
          </view>
          <u-button
            v-if="familyInfo.role === 'admin' && member.user_id !== currentUserId"
            size="mini"
            type="error"
            plain
            @click="confirmRemoveMember(member)"
          >
            移除
          </u-button>
        </view>
      </view>
    </view>

    <!-- 退出家庭按钮 -->
    <view v-if="familyInfo.hasFamily && familyInfo.role !== 'admin'" class="section-card">
      <u-cell-group :border="false">
        <u-cell title="退出家庭" :border="false" @click="confirmLeaveFamily">
          <template #icon>
            <u-icon name="reload" color="#dd524d" size="40" />
          </template>
        </u-cell>
      </u-cell-group>
    </view>

    <!-- 未加入家庭提示 -->
    <view v-else class="section-card">
      <view class="empty-family">
        <u-icon name="account-fill" size="48" color="#909399" />
        <text class="empty-text">尚未加入家庭</text>
        <text class="empty-desc">加入家庭后可以和家人一起管理衣橱</text>
        <u-button
          type="primary"
          size="small"
          customStyle="background: #314033; border-color: #314033;"
          @click="goFamilyGuide"
        >
          创建或加入家庭
        </u-button>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section-card">
      <u-cell-group :border="false">
        <u-cell title="账号信息" isLink :border="false" @click="goUserInfo">
          <template #icon>
            <u-icon name="account" color="#314033" size="40" />
          </template>
        </u-cell>
        <u-cell title="我的衣橱" isLink :border="false" @click="goClosets">
          <template #icon>
            <u-icon name="list" color="#314033" size="40" />
          </template>
        </u-cell>
        <u-cell title="我的衣物" isLink :border="false" @click="goClothes">
          <template #icon>
            <u-icon name="tags" color="#314033" size="40" />
          </template>
        </u-cell>
      </u-cell-group>
    </view>

    <!-- 退出登录 -->
    <view class="section-card">
      <u-cell-group :border="false">
        <u-cell title="退出登录" :border="false" @click="handleLogout">
          <template #icon>
            <u-icon name="reload" color="#dd524d" size="40" />
          </template>
        </u-cell>
      </u-cell-group>
    </view>

    <h5-tab-bar :current-route="ROUTES.profile" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getFamilyMembers, leaveFamily, removeFamilyMember } from "@/common/api/modules/family.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
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

const avatarText = computed(() => {
  const name = userInfo.value.nickname || userInfo.value.username || "";
  return name.charAt(0).toUpperCase() || "U";
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

function goFamilyGuide() {
  uni.navigateTo({ url: ROUTES.familyGuide });
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
  loadUserInfo();
  loadFamilyInfo();
});
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  padding: $spacing-lg 28rpx 180rpx;
  background: $gradient-page-radial, $gradient-page;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 36rpx 30rpx;
  margin-bottom: $spacing-lg;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
}

.avatar-wrap {
  margin-right: $spacing-lg;
}

.avatar-fallback {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-primary-light;
  border-radius: 50%;
}

.avatar-text {
  font-size: 48rpx;
  font-weight: 700;
  color: $color-primary;
}

.user-info {
  flex: 1;
}

.nickname {
  display: block;
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $color-text-title;
}

.username {
  display: block;
  margin-top: $spacing-xs;
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.section-card {
  margin-bottom: $spacing-lg;
  padding: 20rpx 0;
  border-radius: $radius-lg;
  background: $gradient-card;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-border;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md 30rpx;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $color-primary;
}

.invite-code-wrap {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.invite-code {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $color-primary;
  letter-spacing: 2rpx;
}

.empty-family {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 30rpx;
}

.empty-text {
  margin-top: $spacing-md;
  font-size: $font-size-lg;
  font-weight: 600;
  color: #606266;
}

.empty-desc {
  margin-top: $spacing-xs;
  font-size: $font-size-base;
  color: $color-info;
}

.member-list {
  padding: 0 30rpx 20rpx;
}

.member-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $color-border;
}

.member-item:last-child {
  border-bottom: none;
}

.member-avatar-fallback {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-primary-light;
  border-radius: 50%;
}

.member-avatar-text {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $color-primary;
}

.member-info {
  flex: 1;
}

.member-name {
  display: block;
  font-size: $font-size-md;
  font-weight: 600;
  color: $color-text-primary;
}

.member-role {
  display: block;
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: $color-text-secondary;
}
</style>