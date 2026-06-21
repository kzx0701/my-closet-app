<template>
  <view class="uploader">
    <!-- 有图片 -->
    <view v-if="imageUrl" class="image-preview" @click="previewImage">
      <image class="preview-image" :src="imageUrl" mode="aspectFill" />
      <view
        v-if="seasonMarkColor"
        class="season-mark"
        :style="{ background: seasonMarkColor }"
      ></view>
      <view class="replace-btn" @click.stop="chooseImage">
        <text class="replace-btn-text">重新上传</text>
      </view>
    </view>

    <!-- 无图片 -->
    <view v-else class="image-upload" @click="chooseImage">
      <view class="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      </view>
      <text class="upload-title">上传衣物图片</text>
      <text class="upload-sub">支持 jpg、png，建议不超过 {{ maxSize }}MB</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { SEASON_COLOR_MAP } from "@/common/constants/clothes-options.js";

const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
  season: {
    type: String,
    default: "",
  },
  maxSize: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:imageUrl"]);

const seasonMarkColor = computed(() => {
  const firstSeason = String(props.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)[0];
  return SEASON_COLOR_MAP[firstSeason] || "";
});

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];

      const fileRes = await uni.getFileInfo({
        filePath: tempFilePath,
      });

      const fileSizeMB = fileRes.size / (1024 * 1024);

      if (fileSizeMB > props.maxSize) {
        uni.showToast({
          title: `图片不能超过 ${props.maxSize}MB`,
          icon: "none",
        });
        return;
      }

      await uploadImage(tempFilePath);
    },
    fail: () => {
      // 用户取消选择，静默处理
    },
  });
}

async function uploadImage(filePath) {
  uni.showLoading({ title: "上传中..." });

  try {
    const ext = filePath.split(".").pop() || "jpg";
    const uploadResult = await uniCloud.uploadFile({
      filePath,
      cloudPath: `clothes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`,
    });

    emit("update:imageUrl", uploadResult.fileID);
  } catch (error) {
    console.error("uploadImage failed", error);
    uni.showToast({
      title: error?.message || "图片上传失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
}

function previewImage() {
  if (props.imageUrl) {
    uni.previewImage({
      urls: [props.imageUrl],
      current: props.imageUrl,
    });
  }
}
</script>

<style lang="scss" scoped>
.uploader {
  width: 100%;
}

.image-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $color-border;
  background: linear-gradient(135deg, $color-bg-chip 0%, $color-bg-card-end 100%);
}

.preview-image {
  width: 100%;
  height: 100%;
}

.season-mark {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  width: 8rpx;
  height: 56rpx;
  border-radius: 4rpx;
  z-index: 2;
}

.replace-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 10rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 2;
  transition: all 0.2s ease;
}

.replace-btn:active {
  opacity: 0.8;
}

.replace-btn-text {
  font-family: $font-sans;
  font-size: 22rpx;
  font-weight: 500;
  color: #ffffff;
}

.image-upload {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  background: $color-bg-card-end;
  border: 3rpx dashed $color-border;
  transition: all 0.2s ease;
}

.image-upload:active {
  background: $color-bg-chip;
  border-color: $color-sage;
}

.upload-icon {
  width: 72rpx;
  height: 72rpx;
  margin-bottom: 20rpx;
  color: $color-text-placeholder;
  opacity: 0.6;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-title {
  font-family: $font-serif;
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text-secondary;
  margin-bottom: 6rpx;
}

.upload-sub {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-placeholder;
}
</style>
