"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "LoginFormCard",
  props: {
    username: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:username", "update:password", "submit", "register"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.username,
    b: common_vendor.o(($event) => _ctx.$emit("update:username", $event.detail.value), "95"),
    c: $props.password,
    d: common_vendor.o(($event) => _ctx.$emit("update:password", $event.detail.value), "83"),
    e: $props.loading,
    f: common_vendor.o(($event) => _ctx.$emit("submit"), "34"),
    g: common_vendor.o(($event) => _ctx.$emit("register"), "47")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginFormCard.js.map
