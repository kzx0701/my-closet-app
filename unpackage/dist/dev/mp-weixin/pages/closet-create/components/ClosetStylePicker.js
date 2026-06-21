"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ClosetStylePicker",
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
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.desc),
            c: item.code,
            d: __props.modelValue === item.code ? 1 : "",
            e: common_vendor.o(($event) => emit("update:modelValue", item.code), item.code)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-15caaac3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetStylePicker.js.map
