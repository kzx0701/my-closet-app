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
  __name: "RegisterFormCard",
  props: {
    username: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: ""
    },
    passwordConfirm: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "update:username",
    "update:nickname",
    "update:password",
    "update:passwordConfirm",
    "submit",
    "login"
  ],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:username", $event), "15"),
        b: common_vendor.p({
          modelValue: __props.username,
          maxlength: "20",
          placeholder: "字母 / 数字 4-20 位",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx"
          }
        }),
        c: common_vendor.o(($event) => emit("update:nickname", $event), "6d"),
        d: common_vendor.p({
          modelValue: __props.nickname,
          maxlength: "32",
          placeholder: "例如：林屿",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx"
          }
        }),
        e: common_vendor.o(($event) => emit("update:password", $event), "e3"),
        f: common_vendor.p({
          modelValue: __props.password,
          type: "password",
          maxlength: "20",
          placeholder: "至少 6 位",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx"
          }
        }),
        g: common_vendor.o(($event) => emit("update:passwordConfirm", $event), "d2"),
        h: common_vendor.p({
          modelValue: __props.passwordConfirm,
          type: "password",
          maxlength: "20",
          placeholder: "再次输入密码",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx",
            borderRadius: "40rpx"
          }
        }),
        i: __props.loading,
        j: common_vendor.o(($event) => emit("submit"), "69"),
        k: common_vendor.o(($event) => emit("login"), "0f")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-712d4fb4"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-register/components/RegisterFormCard.js.map
