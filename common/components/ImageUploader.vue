<template>
  <view class="uploader">
    <text class="label">{{ label }}</text>
    <text class="desc">{{ desc }}</text>

    <view v-if="imageUrl" class="preview">
      <image class="preview-image" :src="imageUrl" mode="aspectFill" @click="previewImage" />
      <view class="preview-remove" @click="removeImage">
        <u-icon name="close-circle-fill" color="#dd524d" size="40" />
      </view>
    </view>

    <view v-else class="upload-area" @click="chooseImage">
      <u-icon name="camera" color="#7a8678" size="60" />
      <text class="upload-text">点击上传图片</text>
      <text class="upload-hint">支持 jpg、png，建议不超过 5MB</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "图片",
  },
  desc: {
    type: String,
    default: "可选，上传一张衣物照片方便识别",
  },
  maxSize: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:imageUrl"]);

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

function removeImage() {
  emit("update:imageUrl", "");
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

<style lang="scss">
.uploader {
  margin-top: $spacing-lg;
}

.label {
  display: block;
  font-size: $font-size-md;
  font-weight: 700;
  color: $color-text-title;
}

.desc {
  display: block;
  margin-top: $spacing-xs;
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.preview {
  position: relative;
  margin-top: $spacing-md;
  width: 100%;
  height: 300rpx;
  border-radius: $radius-md;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.preview-remove {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: $spacing-md;
  height: 200rpx;
  border-radius: $radius-md;
  background: $color-bg-chip;
  border: 2rpx dashed $color-border;
}

.upload-text {
  margin-top: $spacing-sm;
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.upload-hint {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: $color-text-placeholder;
}
</style>
