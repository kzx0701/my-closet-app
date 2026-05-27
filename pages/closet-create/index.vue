<template>
  <view class="page">
    <view class="page-head">
      <text class="eyebrow">{{ pageEyebrow }}</text>
      <text class="title">{{ pageTitle }}</text>
      <text class="desc">{{ pageDesc }}</text>
    </view>

    <closet-style-picker v-model="styleCode" :options="styleOptions" />
    <closet-color-picker v-model="colorCode" :options="colorOptions" />
    <closet-basic-form
      :name="name"
      :room-name="roomName"
      :description="description"
      @update:name="name = $event"
      @update:roomName="roomName = $event"
      @update:description="description = $event"
    />

    <button class="submit-btn" type="primary" :loading="submitting" @click="submitCloset">
      {{ submitButtonText }}
    </button>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { createCloset, getClosetDetail, updateCloset } from "@/common/api/modules/closet.js";
import ClosetBasicForm from "./components/ClosetBasicForm.vue";
import ClosetColorPicker from "./components/ClosetColorPicker.vue";
import ClosetStylePicker from "./components/ClosetStylePicker.vue";

const styleOptions = CLOSET_STYLE_OPTIONS;
const colorOptions = CLOSET_COLOR_OPTIONS;

const styleCode = ref(styleOptions[0]?.code || "");
const colorCode = ref(colorOptions[0]?.code || "");
const name = ref("");
const roomName = ref("");
const description = ref("");
const submitting = ref(false);
const scopeType = ref("personal");
const closetId = ref("");
const isEditMode = computed(() => Boolean(closetId.value));
const pageEyebrow = computed(() => (isEditMode.value ? "EDIT CLOSET" : "CREATE CLOSET"));
const pageTitle = computed(() => {
  if (isEditMode.value) {
    return scopeType.value === "family" ? "编辑家庭衣橱" : "编辑个人衣橱";
  }

  return scopeType.value === "family" ? "新建家庭衣橱" : "新建个人衣橱";
});
const pageDesc = computed(() =>
  isEditMode.value
    ? "你可以继续调整衣柜样式、颜色、名称和房间信息。"
    : scopeType.value === "family"
      ? "为当前家庭空间新增一个衣橱，后续家庭成员可以一起查看和管理。"
      : "先选择一个你喜欢的衣柜样式和颜色，再填写名称与房间。"
);
const submitButtonText = computed(() => (isEditMode.value ? "保存修改" : "创建衣橱"));

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
  description.value = closet.description || "";
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
      title: "请选择衣柜样式",
      icon: "none",
    });
    return;
  }

  if (!colorCode.value) {
    uni.showToast({
      title: "请选择衣柜颜色",
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
        description: description.value.trim(),
      });
    } else {
      await createCloset({
        scopeType: scopeType.value,
        name: name.value.trim(),
        roomName: roomName.value.trim(),
        styleCode: styleCode.value,
        colorCode: colorCode.value,
        description: description.value.trim(),
      });
    }

    uni.showToast({
      title: isEditMode.value ? "衣橱修改成功" : "衣橱创建成功",
      icon: "success",
    });

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

onLoad((options) => {
  scopeType.value = options?.scopeType === "family" ? "family" : "personal";
  closetId.value = String(options?.closetId || "").trim();

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
