"use strict";
const common_vendor = require("../vendor.js");
const common_constants_clothesOptions = require("../constants/clothes-options.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "ImageUploader",
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    season: {
      type: String,
      default: ""
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
    const seasonMarkColor = common_vendor.computed(() => {
      const firstSeason = String(props.season || "").split(",").map((item) => item.trim()).filter(Boolean)[0];
      return common_constants_clothesOptions.SEASON_COLOR_MAP[firstSeason] || "";
    });
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
        common_vendor.index.__f__("error", "at common/components/ImageUploader.vue:100", "uploadImage failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "图片上传失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
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
        a: __props.imageUrl
      }, __props.imageUrl ? common_vendor.e({
        b: __props.imageUrl,
        c: seasonMarkColor.value
      }, seasonMarkColor.value ? {
        d: seasonMarkColor.value
      } : {}, {
        e: common_vendor.o(chooseImage, "2f"),
        f: common_vendor.o(previewImage, "7b")
      }) : {
        g: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        h: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.4",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        i: common_vendor.t(__props.maxSize),
        j: common_vendor.o(chooseImage, "00")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1a0b434d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/components/ImageUploader.js.map
