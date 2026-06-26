<template>
  <view class="page noise-texture">
    <!-- 顶部导航 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-back" @click="goBack">
        <view class="nav-back-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </view>
      </view>
      <text class="nav-title">{{ pageTitle }}</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- Hero 区 -->
    <view class="form-page-hero fade-up-delay-1">
      <scope-badge text="Add · 新建衣橱" />
      <text class="hero-title">{{ pageTitle }}</text>
      <text class="hero-desc">{{ pageDesc }}</text>
    </view>

    <!-- 白色表单卡片 -->
    <view class="form-card fade-up-delay-2">
      <!-- 名称 -->
      <view class="form-section">
        <text class="form-label">名称</text>
        <view class="input-wrap">
          <input
            class="form-input"
            :class="{ 'form-input-focus': nameFocused }"
            type="text"
            :value="name"
            maxlength="30"
            :adjust-position="true"
            :cursor-spacing="80"
            placeholder="例如：主卧大衣橱"
            placeholder-class="input-placeholder"
            @focus="nameFocused = true"
            @blur="nameFocused = false"
            @input="name = $event.detail.value"
          />
        </view>
      </view>

      <!-- 样式 -->
      <closet-style-picker v-model="styleCode" :options="styleOptions" />

      <!-- 配色 -->
      <closet-color-picker v-model="colorCode" :options="colorOptions" />

      <!-- 所在房间 + 归属空间 -->
      <closet-basic-form
        :room-name="roomName"
        :scope-type="scopeType"
        :family-name="familyName"
        :hide-scope="isEditMode"
        @update:roomName="roomName = $event"
        @update:scopeType="scopeType = $event"
      />
    </view>

    <!-- 底部固定栏 -->
    <view class="form-bottom-bar">
      <button
        class="btn-submit"
        :class="{ 'btn-submit-edit': isEditMode }"
        :loading="submitting"
        :disabled="submitting"
        @click="submitCloset"
      >
        {{ submitButtonText }}
      </button>
      <button
        v-if="isEditMode"
        class="btn-delete"
        :disabled="submitting"
        @click="handleDelete"
      >
        删除衣橱
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { ROUTES } from "@/common/constants/routes.js";
import { safeNavigateBack } from "@/common/utils/nav-helper.js";
import { createCloset, deleteCloset, getClosetDetail, updateCloset } from "@/common/api/modules/closet.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getCurrentSession } from "@/common/services/auth.js";
import ScopeBadge from "@/components/ScopeBadge.vue";
import ClosetBasicForm from "./components/ClosetBasicForm.vue";
import ClosetColorPicker from "./components/ClosetColorPicker.vue";
import ClosetStylePicker from "./components/ClosetStylePicker.vue";

const styleOptions = CLOSET_STYLE_OPTIONS;
const colorOptions = CLOSET_COLOR_OPTIONS;

const styleCode = ref(styleOptions[0]?.code || "");
const colorCode = ref(colorOptions[0]?.code || "");
const name = ref("");
const roomName = ref("");
const submitting = ref(false);
const scopeType = ref("personal");
const closetId = ref("");
const familyName = ref("");
const statusBarHeight = ref(20);
const nameFocused = ref(false);

const isEditMode = computed(() => Boolean(closetId.value));
const pageTitle = computed(() => (isEditMode.value ? "编辑衣橱" : "新建衣橱"));
const pageDesc = computed(() =>
  isEditMode.value
    ? "你可以继续调整衣橱样式、配色、名称和房间信息。"
    : "选择样式与配色，记录衣橱所在房间。"
);
const submitButtonText = computed(() => (isEditMode.value ? "保存修改" : "创建衣橱"));

async function loadFamilyName() {
  const session = getCurrentSession();
  if (!session?.uid) return;

  try {
    const membership = await getFamilyMembership(session.uid);
    if (membership.status === "success" && membership.hasFamily) {
      familyName.value = membership.familyRecord?.name || "家庭空间";
    }
  } catch (error) {
    console.error("loadFamilyName failed", error);
  }
}

async function loadClosetDetail(targetClosetId) {
  const result = await getClosetDetail({
    closetId: targetClosetId,
  });
  const closet = result?.closet;

  if (!closet) {
    throw new Error("衣橱详情不存在");
  }

  scopeType.value = closet.scope_type === "family" ? "family" : "personal";
  styleCode.value = closet.style_code || styleOptions[0]?.code || "";
  colorCode.value = closet.color_code || colorOptions[0]?.code || "";
  name.value = closet.name || "";
  roomName.value = closet.room_name || "";
}

async function submitCloset() {
  if (!name.value.trim()) {
    uni.showToast({
      title: "请输入衣橱名称",
      icon: "none",
    });
    return;
  }

  if (!styleCode.value) {
    uni.showToast({
      title: "请选择衣橱样式",
      icon: "none",
    });
    return;
  }

  if (!colorCode.value) {
    uni.showToast({
      title: "请选择衣橱颜色",
      icon: "none",
    });
    return;
  }

  if (submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    if (isEditMode.value) {
      await updateCloset({
        closetId: closetId.value,
        name: name.value.trim(),
        roomName: roomName.value.trim(),
        styleCode: styleCode.value,
        colorCode: colorCode.value,
      });
    } else {
      await createCloset({
        scopeType: scopeType.value,
        name: name.value.trim(),
        roomName: roomName.value.trim(),
        styleCode: styleCode.value,
        colorCode: colorCode.value,
      });
    }

    uni.showToast({
      title: isEditMode.value ? "衣橱修改成功" : "衣橱创建成功",
      icon: "success",
    });

    // 通知列表页需要刷新
    uni.$emit("closets:need-refresh");

    setTimeout(() => {
      uni.navigateBack();
    }, 300);
  } catch (error) {
    console.error("createCloset failed", error);
    uni.showToast({
      title: error?.message || "衣橱创建失败",
      icon: "none",
    });
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  safeNavigateBack(ROUTES.closets);
}

function handleDelete() {
  if (!closetId.value) return;

  uni.showModal({
    title: "删除衣橱",
    content: "删除后衣橱内衣物的归属信息将被清除，是否继续？",
    confirmColor: "#b85c3a",
    success: async (res) => {
      if (!res.confirm) return;

      try {
        await deleteCloset({ closetId: closetId.value });
        uni.showToast({ title: "衣橱已删除", icon: "success" });
        // 通知列表页需要刷新
        uni.$emit("closets:need-refresh");
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      } catch (error) {
        console.error("deleteCloset failed", error);
        uni.showToast({
          title: error?.message || "删除失败",
          icon: "none",
        });
      }
    },
  });
}

onLoad((options) => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  scopeType.value = options?.scopeType === "family" ? "family" : "personal";
  closetId.value = String(options?.closetId || "").trim();

  const presetName = String(options?.name || "").trim();
  if (presetName && !closetId.value) {
    name.value = presetName;
  }

  loadFamilyName();

  if (closetId.value) {
    loadClosetDetail(closetId.value).catch((error) => {
      console.error("loadClosetDetail failed", error);
      uni.showToast({
        title: error?.message || "衣橱详情加载失败",
        icon: "none",
      });
    });
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

/* ========== 自定义导航栏 ========== */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 32rpx;
  padding-right: 32rpx;
  padding-bottom: 20rpx;
}

.nav-back {
  width: 68rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back-icon {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: rgba(58, 84, 67, 0.25);
  border: 1px solid rgba(244, 239, 230, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-inverse;
  transition: background 0.25s ease;
}

.nav-back-icon:active {
  background: rgba(58, 84, 67, 0.40);
}

.nav-back-icon svg {
  width: 34rpx;
  height: 34rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  letter-spacing: 1rpx;
}

.nav-placeholder {
  width: 68rpx;
}

/* ========== Hero 区 ========== */
.form-page-hero {
  position: relative;
  z-index: 2;
  padding: 20rpx 48rpx 56rpx;
  color: $color-text-inverse;
}

.hero-title {
  display: block;
  margin-bottom: 20rpx;
  font-family: $font-serif;
  font-size: 52rpx;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: $color-text-inverse;
}

.hero-desc {
  display: block;
  font-family: $font-sans;
  font-size: 26rpx;
  line-height: 1.7;
  color: $inverse-55;
  max-width: 580rpx;
}

/* ========== 白色表单卡片 ========== */
.form-card {
  position: relative;
  z-index: 2;
  margin: 0 24rpx 240rpx;
  padding: 44rpx 40rpx 20rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: $radius-card;
}

.form-section {
  margin-bottom: 48rpx;
}

.form-label {
  display: block;
  margin-bottom: 20rpx;
  font-family: $font-sans;
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-secondary;
  letter-spacing: 2rpx;
}

.input-wrap {
  position: relative;
}

.form-input {
  width: 100%;
  height: 92rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-family: $font-sans;
  font-size: 28rpx;
  color: $color-text-title;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.form-input-focus {
  border-color: $color-primary;
  box-shadow: 0 0 0 3rpx rgba(58, 84, 67, 0.08);
}

.input-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

/* ========== 底部固定栏 ========== */
.form-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  gap: 20rpx;
  padding: 32rpx 48rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: $gradient-bottom-bar;
}

.btn-submit {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: $radius-btn;
  background: $color-primary;
  border: none;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
  transition: all 0.2s ease;
}

.btn-submit-edit {
  flex: 2;
}

.btn-submit:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-submit::after {
  border: none;
}

.btn-submit[disabled] {
  opacity: 0.6;
}

.btn-delete {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: $radius-btn;
  background: transparent;
  border: 1px solid rgba(184, 92, 58, 0.3);
  font-family: $font-sans;
  font-size: 28rpx;
  font-weight: 600;
  color: $color-terra;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: rgba(184, 92, 58, 0.06);
}

.btn-delete:active {
  transform: scale(0.98);
}

.btn-delete::after {
  border: none;
}

.btn-delete[disabled] {
  opacity: 0.6;
}
</style>
