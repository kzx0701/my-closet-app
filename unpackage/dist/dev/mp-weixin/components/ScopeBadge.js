"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "ScopeBadge",
  props: {
    text: {
      type: String,
      default: "Personal · 个人空间"
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.text),
        b: __props.dark ? 1 : ""
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-208c7e95"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ScopeBadge.js.map
