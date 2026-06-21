"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_rect + _component_line + _component_svg)();
}
const _sfc_main = {
  __name: "ClosetEmptyState",
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
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const titleText = common_vendor.computed(() => {
      if (props.scopeType === "family") {
        return "家庭空间还没有衣橱";
      }
      return "还没有衣橱";
    });
    const descText = common_vendor.computed(() => {
      if (props.scopeType === "family") {
        return "当前家庭空间还没有衣橱，现在就可以先创建一个";
      }
      return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理";
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        b: common_vendor.p({
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12"
        }),
        c: common_vendor.p({
          x1: "12",
          y1: "3",
          x2: "12",
          y2: "21"
        }),
        d: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        e: common_vendor.t(titleText.value),
        f: common_vendor.t(descText.value),
        g: __props.canCreate
      }, __props.canCreate ? {
        h: common_vendor.o(($event) => emit("create"), "a6")
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3720155d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetEmptyState.js.map
