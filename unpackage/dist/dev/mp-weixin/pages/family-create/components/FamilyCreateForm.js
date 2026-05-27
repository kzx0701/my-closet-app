"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "FamilyCreateForm",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    suggestions: {
      type: Array,
      default() {
        return [];
      }
    },
    helperText: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "submit", "pick-suggestion"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleInput(event) {
      emit("update:modelValue", event.detail.value);
    }
    return (_ctx, _cache) => {
      return {
        a: __props.modelValue,
        b: common_vendor.o(handleInput, "c7"),
        c: common_vendor.t(__props.helperText),
        d: common_vendor.t(__props.modelValue.length),
        e: common_vendor.f(__props.suggestions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => emit("pick-suggestion", item), item)
          };
        }),
        f: __props.loading,
        g: common_vendor.o(($event) => emit("submit"), "c6")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/family-create/components/FamilyCreateForm.js.map
