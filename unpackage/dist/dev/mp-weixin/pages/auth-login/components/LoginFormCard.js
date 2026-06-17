"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_input2 + _easycom_u_button2)();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_button)();
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
  emits: ["update:username", "update:password", "submit", "register"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:username", $event), "d7"),
        b: common_vendor.p({
          modelValue: __props.username,
          placeholder: "请输入用户名 / 手机号 / 邮箱",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        c: common_vendor.o(($event) => emit("update:password", $event), "57"),
        d: common_vendor.p({
          modelValue: __props.password,
          type: "password",
          placeholder: "请输入密码",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        e: common_vendor.o(($event) => emit("submit"), "5b"),
        f: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: __props.loading,
          customStyle: "margin-top: 34rpx; background: $gradient-button; border: none;"
        }),
        g: common_vendor.o(($event) => emit("register"), "1b")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginFormCard.js.map
