"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ClosetEmptyState",
  props: {
    scopeType: {
      type: String,
      default: "personal"
    },
    canCreate: {
      type: Boolean,
      default: true
    }
  },
  emits: ["create"],
  computed: {
    descText() {
      if (this.scopeType === "family") {
        return "当前家庭空间还没有衣橱，现在就可以先创建一个，方便家人后续一起管理和整理。";
      }
      return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理，后续再往里添加衣物。";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.descText),
    b: $props.canCreate
  }, $props.canCreate ? {
    c: common_vendor.o(($event) => _ctx.$emit("create"), "72")
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetEmptyState.js.map
