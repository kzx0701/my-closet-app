<template>
  <view class="page">
    <view class="page-head">
      <text class="eyebrow">CREATE CLOSET</text>
      <text class="title">新建个人衣橱</text>
      <text class="desc">先选择一个你喜欢的衣柜样式和颜色，再填写名称与房间。</text>
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

    <button class="submit-btn" type="primary" :loading="submitting" @click="submitCreateCloset">
      创建衣橱
    </button>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { createCloset } from "@/common/api/modules/closet.js";
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

async function submitCreateCloset() {
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
    await createCloset({
      name: name.value.trim(),
      roomName: roomName.value.trim(),
      styleCode: styleCode.value,
      colorCode: colorCode.value,
      description: description.value.trim(),
    });

    uni.showToast({
      title: "衣橱创建成功",
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
