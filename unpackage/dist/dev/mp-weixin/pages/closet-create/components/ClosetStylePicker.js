"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ClosetStylePicker",
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
  emits: ["update:modelValue"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.options, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.desc),
        c: item.code,
        d: $props.modelValue === item.code ? 1 : "",
        e: common_vendor.o(($event) => _ctx.$emit("update:modelValue", item.code), item.code)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetStylePicker.js.map
