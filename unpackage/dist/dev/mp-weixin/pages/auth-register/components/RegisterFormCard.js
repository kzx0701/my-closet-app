"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_input2 + _easycom_uni_captcha2 + _easycom_u_button2)();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_uni_captcha = () => "../../../uni_modules/uni-captcha/components/uni-captcha/uni-captcha.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_input + _easycom_uni_captcha + _easycom_u_button)();
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
    captcha: {
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
    "update:captcha",
    "submit",
    "login"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const captchaRef = common_vendor.ref(null);
    function handleCaptchaUpdate(value) {
      emit("update:captcha", value);
    }
    function refreshCaptcha() {
      var _a;
      (_a = captchaRef.value) == null ? void 0 : _a.getImageCaptcha();
    }
    __expose({ refreshCaptcha });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:username", $event), "06"),
        b: common_vendor.p({
          modelValue: __props.username,
          maxlength: "32",
          placeholder: "3-32 位，不能是纯数字/手机号/邮箱",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        c: common_vendor.o(($event) => emit("update:nickname", $event), "56"),
        d: common_vendor.p({
          modelValue: __props.nickname,
          maxlength: "32",
          placeholder: "选填，建议填写你的昵称",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        e: common_vendor.o(($event) => emit("update:password", $event), "1c"),
        f: common_vendor.p({
          modelValue: __props.password,
          type: "password",
          maxlength: "20",
          placeholder: "请输入 8-16 位密码",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        g: common_vendor.o(($event) => emit("update:passwordConfirm", $event), "a4"),
        h: common_vendor.p({
          modelValue: __props.passwordConfirm,
          type: "password",
          maxlength: "20",
          placeholder: "请再次输入密码",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        i: common_vendor.sr(captchaRef, "3dc74893-4", {
          "k": "captchaRef"
        }),
        j: common_vendor.o(handleCaptchaUpdate, "fc"),
        k: common_vendor.p({
          scene: "register",
          modelValue: __props.captcha
        }),
        l: common_vendor.o(($event) => emit("submit"), "98"),
        m: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: __props.loading,
          customStyle: "margin-top: 34rpx; background: $gradient-button; border: none;"
        }),
        n: common_vendor.o(($event) => emit("login"), "ab")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-register/components/RegisterFormCard.js.map
