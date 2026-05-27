"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "RegisterFormCard",
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
  methods: {
    handleCaptchaUpdate(value) {
      this.$emit("update:captcha", value);
    },
    refreshCaptcha() {
      var _a;
      (_a = this.$refs.captchaRef) == null ? void 0 : _a.getImageCaptcha();
    }
  }
};
if (!Array) {
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  _easycom_uni_captcha2();
}
const _easycom_uni_captcha = () => "../../../uni_modules/uni-captcha/components/uni-captcha/uni-captcha.js";
if (!Math) {
  _easycom_uni_captcha();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.username,
    b: common_vendor.o(($event) => _ctx.$emit("update:username", $event.detail.value), "26"),
    c: $props.nickname,
    d: common_vendor.o(($event) => _ctx.$emit("update:nickname", $event.detail.value), "2c"),
    e: $props.password,
    f: common_vendor.o(($event) => _ctx.$emit("update:password", $event.detail.value), "27"),
    g: $props.passwordConfirm,
    h: common_vendor.o(($event) => _ctx.$emit("update:passwordConfirm", $event.detail.value), "86"),
    i: common_vendor.sr("captchaRef", "3dc74893-0"),
    j: common_vendor.o($options.handleCaptchaUpdate, "fa"),
    k: common_vendor.p({
      scene: "register",
      modelValue: $props.captcha
    }),
    l: $props.loading,
    m: common_vendor.o(($event) => _ctx.$emit("submit"), "25"),
    n: common_vendor.o(($event) => _ctx.$emit("login"), "a9")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-register/components/RegisterFormCard.js.map
