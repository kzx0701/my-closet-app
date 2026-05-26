<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">家庭协作</text>
      <text class="title">先创建一个家庭</text>
      <text class="desc">创建成功后，你会自动成为管理员，后续可以邀请家人一起管理衣橱。</text>
    </view>

    <family-create-form
      v-model="familyName"
      :loading="submitting"
      @submit="handleSubmit"
    />
  </view>
</template>

<script>
import { createFamily } from "@/common/api/modules/family.js";
import { ROUTES } from "@/common/constants/routes.js";
import FamilyCreateForm from "./components/FamilyCreateForm.vue";

export default {
  components: {
    FamilyCreateForm,
  },
  data() {
    return {
      familyName: "",
      submitting: false,
    };
  },
  methods: {
    async handleSubmit() {
      const normalizedName = this.familyName.trim();

      if (!normalizedName) {
        uni.showToast({
          title: "请输入家庭名称",
          icon: "none",
        });
        return;
      }

      if (this.submitting) {
        return;
      }

      this.submitting = true;

      try {
        await createFamily({
          name: normalizedName,
        });

        uni.showToast({
          title: "家庭创建成功",
          icon: "success",
        });

        setTimeout(() => {
          uni.reLaunch({
            url: ROUTES.home,
          });
        }, 300);
      } catch (error) {
        console.error("createFamily failed", error);
        uni.showToast({
          title: error?.message || "创建家庭失败",
          icon: "none",
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style>
.page {
  min-height: 100vh;
  padding: 88rpx 32rpx 80rpx;
  background: linear-gradient(180deg, #f4f1e8 0%, #ffffff 55%, #f0ebe0 100%);
}

.hero {
  margin-bottom: 36rpx;
}

.eyebrow {
  display: block;
  font-size: 24rpx;
  letter-spacing: 4rpx;
  color: #7d876f;
}

.title {
  display: block;
  margin-top: 18rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #2a352b;
}

.desc {
  display: block;
  margin-top: 18rpx;
  font-size: 28rpx;
  line-height: 1.7;
  color: #627061;
}
</style>
