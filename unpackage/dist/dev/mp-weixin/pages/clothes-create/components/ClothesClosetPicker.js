"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ClothesClosetPicker",
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
            b: item._id,
            c: __props.modelValue === item._id ? 1 : "",
            d: common_vendor.o(($event) => emit("update:modelValue", item._id), item._id)
          };
        }),
        b: __props.modelValue === "" ? 1 : "",
        c: common_vendor.o(($event) => emit("update:modelValue", ""), "35")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6483baed"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes-create/components/ClothesClosetPicker.js.map
