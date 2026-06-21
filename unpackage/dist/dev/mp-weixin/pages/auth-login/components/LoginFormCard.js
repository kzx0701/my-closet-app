"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  _easycom_u_input2();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
if (!Math) {
  _easycom_u_input();
}
const _sfc_main = {
  __name: "LoginFormCard",
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
  emits: ["update:username", "update:password", "submit", "register", "forgot"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:username", $event), "09"),
        b: common_vendor.p({
          modelValue: __props.username,
          placeholder: "输入用户名",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx",
            color: "#2a2a24"
          }
        }),
        c: common_vendor.o(($event) => emit("update:password", $event), "60"),
        d: common_vendor.p({
          modelValue: __props.password,
          type: "password",
          placeholder: "输入密码",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx",
            color: "#2a2a24"
          }
        }),
        e: __props.loading,
        f: common_vendor.o(($event) => emit("submit"), "00"),
        g: common_vendor.o(($event) => emit("register"), "6c"),
        h: common_vendor.o(($event) => emit("forgot"), "01")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b561ce2d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginFormCard.js.map
