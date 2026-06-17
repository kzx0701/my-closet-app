"use strict";
const common_vendor = require("../vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = {
  __name: "ImageUploader",
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "图片"
    },
    desc: {
      type: String,
      default: "可选，上传一张衣物照片方便识别"
    },
    maxSize: {
      type: Number,
      default: 5
    }
  },
  emits: ["update:imageUrl"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          const fileRes = await common_vendor.index.getFileInfo({
            filePath: tempFilePath
          });
          const fileSizeMB = fileRes.size / (1024 * 1024);
          if (fileSizeMB > props.maxSize) {
            common_vendor.index.showToast({
              title: `图片不能超过 ${props.maxSize}MB`,
              icon: "none"
            });
            return;
          }
          await uploadImage(tempFilePath);
        },
        fail: () => {
        }
      });
    }
    async function uploadImage(filePath) {
      common_vendor.index.showLoading({ title: "上传中..." });
      try {
        const ext = filePath.split(".").pop() || "jpg";
        const uploadResult = await common_vendor._r.uploadFile({
          filePath,
          cloudPath: `clothes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        });
        emit("update:imageUrl", uploadResult.fileID);
      } catch (error) {
        common_vendor.index.__f__("error", "at common/components/ImageUploader.vue:85", "uploadImage failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "图片上传失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function removeImage() {
      emit("update:imageUrl", "");
    }
    function previewImage() {
      if (props.imageUrl) {
        common_vendor.index.previewImage({
          urls: [props.imageUrl],
          current: props.imageUrl
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.label),
        b: common_vendor.t(__props.desc),
        c: __props.imageUrl
      }, __props.imageUrl ? {
        d: __props.imageUrl,
        e: common_vendor.o(previewImage, "cc"),
        f: common_vendor.p({
          name: "close-circle-fill",
          color: "#dd524d",
          size: "40"
        }),
        g: common_vendor.o(removeImage, "35")
      } : {
        h: common_vendor.p({
          name: "camera",
          color: "#7a8678",
          size: "60"
        }),
        i: common_vendor.o(chooseImage, "4c")
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/components/ImageUploader.js.map
