<template>
  <view class="page">
    <view class="page-head">
      <text class="eyebrow">{{ pageEyebrow }}</text>
      <text class="title">{{ pageTitle }}</text>
      <text class="desc">{{ pageDesc }}</text>
    </view>

    <image-uploader v-model:imageUrl="imageUrl" />

    <clothes-basic-form
      :name="name"
      :category="category"
      :season="season"
      :color="color"
      :remark="remark"
      :category-options="categoryOptions"
      :season-options="seasonOptions"
      @update:name="name = $event"
      @update:category="category = $event"
      @update:season="season = $event"
      @update:color="color = $event"
      @update:remark="remark = $event"
    />

    <clothes-closet-picker v-model="closetId" :options="closetOptions" />

    <u-button
      type="primary"
      shape="circle"
      :loading="submitting"
      customStyle="margin-top: 34rpx; background: $gradient-button; border: none;"
      @click="submitClothes"
    >
      {{ submitButtonText }}
    </u-button>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { createClothes, getClothesDetail, updateClothes } from "@/common/api/modules/clothes.js";
import { getPersonalClosetList, getFamilyClosetList } from "@/common/api/modules/closet.js";
import { CLOTHES_CATEGORY_OPTIONS, CLOTHES_SEASON_OPTIONS } from "@/common/constants/clothes-options.js";
import ImageUploader from "@/common/components/ImageUploader.vue";
import ClothesBasicForm from "./components/ClothesBasicForm.vue";
import ClothesClosetPicker from "./components/ClothesClosetPicker.vue";

const categoryOptions = CLOTHES_CATEGORY_OPTIONS;
const seasonOptions = CLOTHES_SEASON_OPTIONS;

const name = ref("");
const category = ref(categoryOptions[0]?.code || "");
const season = ref(seasonOptions[0]?.code || "");
const color = ref("");
const remark = ref("");
const imageUrl = ref("");
const closetId = ref("");
const clothesId = ref("");
const scopeType = ref("personal");
const closetOptions = ref([]);
const submitting = ref(false);
const isEditMode = computed(() => Boolean(clothesId.value));
const isFamilyScope = computed(() => scopeType.value === "family");
const pageEyebrow = computed(() => (isEditMode.value ? "EDIT CLOTHES" : "CREATE CLOTHES"));
const pageTitle = computed(() => {
  if (isEditMode.value) {
    return isFamilyScope.value ? "编辑家庭衣物" : "编辑个人衣物";
  }
  return isFamilyScope.value ? "新增家庭衣物" : "新增个人衣物";
});
const pageDesc = computed(() =>
  isEditMode.value
    ? "你可以继续调整衣物名称、分类、季节和所属衣橱。"
    : isFamilyScope.value
      ? "为当前家庭空间新增一件衣物，后续家庭成员可以一起查看和管理。"
      : "先把个人空间的基础衣物记录跑通，支持可选绑定个人衣橱。"
);
const submitButtonText = computed(() => (isEditMode.value ? "保存修改" : "创建衣物"));

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

async function loadClothesDetail(targetClothesId) {
  const result = await getClothesDetail({ clothesId: targetClothesId });
  const clothes = result?.clothes;

  if (!clothes) {
    throw new Error("衣物详情不存在");
  }

  scopeType.value = clothes.scope_type === "family" ? "family" : "personal";
  name.value = clothes.name || "";
  category.value = clothes.category || categoryOptions[0]?.code || "";
  season.value = clothes.season || seasonOptions[0]?.code || "";
  color.value = clothes.color || "";
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
        season: season.value,
        color: color.value.trim(),
        remark: remark.value.trim(),
        imageUrl: imageUrl.value,
        closetId: closetId.value,
      });
    } else {
      await createClothes({
        scopeType: scopeType.value,
        name: name.value.trim(),
        category: category.value,
        season: season.value,
        color: color.value.trim(),
        remark: remark.value.trim(),
        imageUrl: imageUrl.value,
        closetId: closetId.value,
      });
    }

    uni.showToast({
      title: isEditMode.value ? "衣物修改成功" : "衣物创建成功",
      icon: "success",
    });

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

onLoad(async (options) => {
  scopeType.value = options?.scopeType === "family" ? "family" : "personal";
  clothesId.value = String(options?.clothesId || "").trim();

  await loadClosetOptions();

  if (clothesId.value) {
    loadClothesDetail(clothesId.value).catch((error) => {
      console.error("loadClothesDetail failed", error);
      uni.showToast({
        title: error?.message || "衣物详情加载失败",
        icon: "none",
      });
    });
  }
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
  margin-bottom: 28rpx;
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

.submit-btn {
  margin-top: 34rpx;
  border-radius: 999rpx;
}
</style>
