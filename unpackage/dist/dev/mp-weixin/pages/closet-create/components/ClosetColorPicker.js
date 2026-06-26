"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "ClosetColorPicker",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.options, (item, k0, i0) => {
          return common_vendor.e({
            a: __props.modelValue === item.code
          }, __props.modelValue === item.code ? {
            b: "3742f40d-1-" + i0 + "," + ("3742f40d-0-" + i0),
            c: common_vendor.p({
              d: "M20 6L9 17l-5-5"
            }),
            d: "3742f40d-0-" + i0,
            e: common_vendor.p({
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#ffffff",
              ["stroke-width"]: "3",
              ["stroke-linecap"]: "round",
              ["stroke-linejoin"]: "round"
            })
          } : {}, {
            f: item.color,
            g: common_vendor.t(item.name),
            h: item.code,
            i: __props.modelValue === item.code ? 1 : "",
            j: common_vendor.o(($event) => emit("update:modelValue", item.code), item.code)
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3742f40d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetColorPicker.js.map
