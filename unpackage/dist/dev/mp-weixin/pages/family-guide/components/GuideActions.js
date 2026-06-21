"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "GuideActions",
  emits: ["create-family", "join-family", "skip"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          d: "M9 18l6-6-6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        c: common_vendor.o(($event) => emit("create-family"), "2c"),
        d: common_vendor.p({
          d: "M9 18l6-6-6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        e: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        f: common_vendor.o(($event) => emit("join-family"), "f3"),
        g: common_vendor.o(($event) => emit("skip"), "fd")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-def3b79a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/family-guide/components/GuideActions.js.map
