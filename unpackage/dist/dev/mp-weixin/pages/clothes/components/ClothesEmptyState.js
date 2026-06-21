"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "ClothesEmptyState",
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
        return "家庭空间还没有衣物";
      }
      return "还没有衣物";
    });
    const descText = common_vendor.computed(() => {
      if (props.scopeType === "family") {
        return "当前家庭空间还没有添加衣物，现在就可以添加一件";
      }
      return "先添加一件衣物，可以按类别、季节或穿着场景来整理";
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        c: common_vendor.t(titleText.value),
        d: common_vendor.t(descText.value),
        e: __props.canCreate
      }, __props.canCreate ? {
        f: common_vendor.o(($event) => emit("create"), "da")
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e32b413e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesEmptyState.js.map
