"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_closetOptions = require("../../../common/constants/closet-options.js");
const _sfc_main = {
  __name: "ClosetListCard",
  props: {
    closet: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  emits: ["edit", "delete"],
  setup(__props) {
    const props = __props;
    const styleName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_STYLE_OPTIONS.find((item) => item.code === props.closet.style_code)) == null ? void 0 : _a.name) || "未知样式";
    });
    const colorName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_COLOR_OPTIONS.find((item) => item.code === props.closet.color_code)) == null ? void 0 : _a.name) || "未知颜色";
    });
    const creatorText = common_vendor.computed(() => {
      if (props.closet.scope_type !== "family") {
        return "";
      }
      const creatorName = String(props.closet.creator_name || "").trim();
      if (!creatorName) {
        return "";
      }
      return `创建者：${creatorName}`;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(styleName.value),
        b: common_vendor.t(colorName.value),
        c: common_vendor.t(__props.closet.name),
        d: common_vendor.t(__props.closet.room_name || "未填写房间"),
        e: creatorText.value
      }, creatorText.value ? {
        f: common_vendor.t(creatorText.value)
      } : {}, {
        g: common_vendor.t(__props.closet.description || "当前还没有补充衣橱描述。"),
        h: common_vendor.o(($event) => _ctx.$emit("edit", __props.closet), "da"),
        i: common_vendor.o(($event) => _ctx.$emit("delete", __props.closet), "d7")
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetListCard.js.map
