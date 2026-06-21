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
      <text class="nav-title">新增衣物</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- Hero 区 -->
    <view class="form-page-hero fade-up-delay-1">
      <scope-badge text="Add · 新增" />
      <text class="hero-title">{{ pageTitle }}</text>
      <text class="hero-desc">{{ pageDesc }}</text>
    </view>

    <!-- 空间选择器（仅非编辑模式） -->
    <view v-if="!isEditMode" class="scope-selector fade-up-delay-1">
      <text class="section-title">归属空间</text>
      <view class="chip-row">
        <view
          class="chip"
          :class="{ active: scopeType === 'personal' }"
          @click="changeScopeType('personal')"
        >
          <text class="chip-text">个人空间</text>
        </view>
        <view
          v-if="hasFamily"
          class="chip"
          :class="{ active: scopeType === 'family' }"
          @click="changeScopeType('family')"
        >
          <text class="chip-text">{{ familyName }}</text>
        </view>
      </view>
    </view>

    <!-- 表单区 -->
    <view class="form-body fade-up-delay-2">
      <!-- 衣物图片 -->
      <view class="section">
        <view class="section-title">
          <text>衣物图片</text>
          <text class="hint">选填</text>
        </view>
        <image-uploader v-model:imageUrl="imageUrl" :season="season" />
      </view>

      <!-- 名称 / 分类 / 颜色 / 季节 -->
      <clothes-basic-form
        :name="name"
        :category="category"
        :color="color"
        :season="season"
        :category-options="categoryOptions"
        :color-options="colorOptions"
        :season-options="seasonOptions"
        @update:name="name = $event"
        @update:category="category = $event"
        @update:color="color = $event"
        @update:season="season = $event"
      />

      <!-- 归属衣橱 -->
      <clothes-closet-picker v-model="closetId" :options="closetOptions" />

      <!-- 备注 -->
      <view class="section">
        <text class="section-title">备注</text>
        <textarea
          class="form-textarea"
          :class="{ 'form-input-focus': remarkFocused }"
          :value="remark"
          maxlength="500"
          :adjust-position="true"
          :cursor-spacing="80"
          placeholder="材质、颜色、品牌、购买时间…"
          placeholder-class="form-input-placeholder"
          @focus="remarkFocused = true"
          @blur="remarkFocused = false"
          @input="remark = $event.detail.value"
        />
      </view>
    </view>

    <!-- 底部固定栏 -->
    <view class="form-bottom-bar">
      <button
        class="btn-submit"
        :loading="submitting"
        :disabled="submitting"
        @click="submitClothes"
      >
        {{ submitButtonText }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { createClothes, getClothesDetail, updateClothes } from "@/common/api/modules/clothes.js";
import { getPersonalClosetList, getFamilyClosetList } from "@/common/api/modules/closet.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_COLOR_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import { ROUTES } from "@/common/constants/routes.js";
import { safeNavigateBack } from "@/common/utils/nav-helper.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import ImageUploader from "@/common/components/ImageUploader.vue";
import ScopeBadge from "@/components/ScopeBadge.vue";
import ClothesBasicForm from "./components/ClothesBasicForm.vue";
import ClothesClosetPicker from "./components/ClothesClosetPicker.vue";

const categoryOptions = CLOTHES_CATEGORY_OPTIONS;
const colorOptions = CLOTHES_COLOR_OPTIONS;
const seasonOptions = CLOTHES_SEASON_OPTIONS;

const name = ref("");
const category = ref(categoryOptions[0]?.code || "");
const color = ref("");
const season = ref("");
const remark = ref("");
const imageUrl = ref("");
const closetId = ref("");
const clothesId = ref("");
const scopeType = ref("personal");
const hasFamily = ref(false);
const familyName = ref("");
const closetOptions = ref([]);
const submitting = ref(false);
const statusBarHeight = ref(20);
const remarkFocused = ref(false);

const isEditMode = computed(() => Boolean(clothesId.value));
const isFamilyScope = computed(() => scopeType.value === "family");
const pageTitle = computed(() => (isEditMode.value ? "编辑衣物" : "新增衣物"));
const pageDesc = computed(() =>
  isEditMode.value
    ? "你可以继续调整衣物名称、分类、季节和所属衣橱。"
    : "上传一张衣物照片，填写基础信息。"
);
const submitButtonText = computed(() => (isEditMode.value ? "保存修改" : "保存衣物"));

async function loadClosetOptions() {
  try {
    const result = isFamilyScope.value
      ? await getFamilyClosetList({ pageSize: 100 })
      : await getPersonalClosetList({ pageSize: 100 });
    closetOptions.value = result?.list || [];
  } catch (error) {
    console.error("loadClosetOptions failed", error);
    closetOptions.value = [];
    uni.showToast({
      title: error?.message || "衣橱加载失败",
      icon: "none",
    });
  }
}

function changeScopeType(nextScopeType) {
  if (nextScopeType === scopeType.value) return;
  if (nextScopeType === "family" && !hasFamily.value) return;
  scopeType.value = nextScopeType;
  closetId.value = "";
  loadClosetOptions();
}

async function loadClothesDetail(targetClothesId) {
  const result = await getClothesDetail({ clothesId: targetClothesId });
  const clothes = result?.clothes;

  if (!clothes) {
    throw new Error("衣物详情不存在");
  }

  scopeType.value = clothes.scope_type === "family" ? "family" : "personal";
  name.value = clothes.name || "";
  category.value = clothes.category || "";
  color.value = clothes.color || "";
  season.value = clothes.season || "";
  remark.value = clothes.remark || "";
  imageUrl.value = clothes.image_url || "";
  closetId.value = clothes.closet_id || "";
}

async function submitClothes() {
  if (!name.value.trim()) {
    uni.showToast({ title: "请输入衣物名称", icon: "none" });
    return;
  }

  if (!category.value) {
    uni.showToast({ title: "请选择衣物分类", icon: "none" });
    return;
  }

  if (!season.value) {
    uni.showToast({ title: "请选择适用季节", icon: "none" });
    return;
  }

  if (submitting.value) return;

  submitting.value = true;

  try {
    if (isEditMode.value) {
      await updateClothes({
        clothesId: clothesId.value,
        name: name.value.trim(),
        category: category.value,
        color: color.value,
        season: season.value,
        remark: remark.value.trim(),
        imageUrl: imageUrl.value,
        closetId: closetId.value,
      });
    } else {
      await createClothes({
        scopeType: scopeType.value,
        name: name.value.trim(),
        category: category.value,
        color: color.value,
        season: season.value,
        remark: remark.value.trim(),
        imageUrl: imageUrl.value,
        closetId: closetId.value,
      });
    }

    uni.showToast({
      title: isEditMode.value ? "衣物修改成功" : "衣物创建成功",
      icon: "success",
    });

    // 通知列表页需要刷新
    uni.$emit("clothes:need-refresh");

    setTimeout(() => {
      uni.navigateBack();
    }, 300);
  } catch (error) {
    console.error("submitClothes failed", error);
    uni.showToast({
      title: error?.message || (isEditMode.value ? "衣物修改失败" : "衣物创建失败"),
      icon: "none",
    });
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  safeNavigateBack(ROUTES.clothes);
}

onLoad(async (options) => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }

  scopeType.value = options?.scopeType === "family" ? "family" : "personal";
  clothesId.value = String(options?.clothesId || "").trim();

  // 加载家庭状态（用于空间选择器）
  const session = getCurrentSession();
  if (session?.uid) {
    try {
      const membership = await getFamilyMembership(session.uid);
      hasFamily.value = membership.status === "success" && membership.hasFamily;
      if (hasFamily.value) {
        familyName.value = membership.familyRecord?.name || "未命名家庭";
      }
    } catch (e) {
      console.error("loadFamilyStatus failed", e);
    }
  }

  if (clothesId.value) {
    try {
      await loadClothesDetail(clothesId.value);
    } catch (error) {
      console.error("loadClothesDetail failed", error);
      uni.showToast({
        title: error?.message || "衣物详情加载失败",
        icon: "none",
      });
    }
  }

  await loadClosetOptions();
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: $gradient-hero;
  overflow: hidden;
}

/* 自定义导航栏 */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 28rpx;
  padding-right: 28rpx;
  padding-bottom: 16rpx;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-inverse;
}

.nav-back-icon svg {
  width: 32rpx;
  height: 32rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-family: $font-sans;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-inverse;
}

.nav-placeholder {
  width: 64rpx;
}

/* Hero 区 */
.form-page-hero {
  position: relative;
  z-index: 2;
  padding: 24rpx 56rpx 48rpx;
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
}

/* 空间选择器 */
.scope-selector {
  position: relative;
  z-index: 2;
  padding: 0 56rpx 8rpx;
}

.scope-selector .section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip {
  padding: 14rpx 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-chip;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.chip.active {
  background: $color-primary;
  border-color: $color-primary;
}

.chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.chip.active .chip-text {
  color: $color-text-inverse;
  font-weight: 600;
}

/* 表单区 */
.form-body {
  position: relative;
  z-index: 2;
  padding: 0 56rpx 240rpx;
}

.section {
  margin-top: 48rpx;
}

.form-body .section:first-child {
  margin-top: 0;
}

.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.hint {
  font-family: $font-sans;
  font-size: 22rpx;
  letter-spacing: 0;
  text-transform: none;
  color: $color-text-placeholder;
}

.form-input-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx 28rpx;
  border-radius: $radius-btn;
  background: rgba(58, 84, 67, 0.04);
  border: 1px solid $color-border-soft;
  font-family: $font-sans;
  font-size: 28rpx;
  line-height: 1.7;
  color: $color-text-title;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-input-focus {
  border-color: $color-primary;
}

/* 底部固定栏 */
.form-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  padding: 32rpx 56rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: $gradient-bottom-bar;
}

.btn-submit {
  width: 100%;
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
</style>
