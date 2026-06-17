"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
if (!Math) {
  (RegisterHero + RegisterFormCard)();
}
const RegisterFormCard = () => "./components/RegisterFormCard.js";
const RegisterHero = () => "./components/RegisterHero.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const registerFormCardRef = common_vendor.ref(null);
    const username = common_vendor.ref("");
    const nickname = common_vendor.ref("");
    const password = common_vendor.ref("");
    const passwordConfirm = common_vendor.ref("");
    const captcha = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    function isEmail(value) {
      return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
    }
    function validateRegisterForm() {
      const normalizedUsername = username.value.trim();
      const normalizedNickname = nickname.value.trim();
      if (!normalizedUsername) {
        return "请输入用户名";
      }
      if (normalizedUsername.length < 3 || normalizedUsername.length > 32) {
        return "用户名长度需为 3-32 位";
      }
      if (/^1\d{10}$/.test(normalizedUsername) || isEmail(normalizedUsername)) {
        return "用户名不能是手机号或邮箱";
      }
      if (/^\d+$/.test(normalizedUsername)) {
        return "用户名不能为纯数字";
      }
      if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(normalizedUsername)) {
        return "用户名不能包含中文";
      }
      if (normalizedNickname) {
        if (normalizedNickname.length < 3 || normalizedNickname.length > 32) {
          return "昵称长度需为 3-32 位";
        }
        if (/^1\d{10}$/.test(normalizedNickname) || isEmail(normalizedNickname)) {
          return "昵称不能是手机号或邮箱";
        }
        if (/^\d+$/.test(normalizedNickname)) {
          return "昵称不能为纯数字";
        }
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(normalizedNickname)) {
          return "昵称不能包含中文";
        }
      }
      if (!password.value) {
        return "请输入密码";
      }
      if (password.value.length < 8 || password.value.length > 16) {
        return "密码长度需为 8-16 位";
      }
      if (passwordConfirm.value !== password.value) {
        return "两次输入的密码不一致";
      }
      if (!captcha.value || captcha.value.length !== 4) {
        return "请输入 4 位验证码";
      }
      return "";
    }
    async function submitRegister() {
      var _a;
      const errorMessage = validateRegisterForm();
      if (errorMessage) {
        common_vendor.index.showToast({
          title: errorMessage,
          icon: "none"
        });
        return;
      }
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        const result = await common_api_modules_auth.registerUser({
          username: username.value.trim(),
          nickname: nickname.value.trim(),
          password: password.value,
          password2: passwordConfirm.value,
          captcha: captcha.value
        });
        uni_modules_uniIdPages_common_store.mutations.loginSuccess({
          ...result,
          autoBack: false
        });
        common_vendor.index.reLaunch({
          url: common_constants_routes.ROUTES.entry
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth-register/index.vue:138", "custom register failed", error);
        (_a = registerFormCardRef.value) == null ? void 0 : _a.refreshCaptcha();
      } finally {
        submitting.value = false;
      }
    }
    function goLogin() {
      common_vendor.index.navigateBack({
        fail() {
          common_vendor.index.reLaunch({
            url: common_constants_routes.ROUTES.login
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(registerFormCardRef, "3c774ef5-1", {
          "k": "registerFormCardRef"
        }),
        b: common_vendor.o(submitRegister, "ce"),
        c: common_vendor.o(goLogin, "7e"),
        d: common_vendor.o(($event) => username.value = $event, "44"),
        e: common_vendor.o(($event) => nickname.value = $event, "a6"),
        f: common_vendor.o(($event) => password.value = $event, "d9"),
        g: common_vendor.o(($event) => passwordConfirm.value = $event, "e1"),
        h: common_vendor.o(($event) => captcha.value = $event, "90"),
        i: common_vendor.p({
          loading: submitting.value,
          username: username.value,
          nickname: nickname.value,
          password: password.value,
          passwordConfirm: passwordConfirm.value,
          captcha: captcha.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth-register/index.js.map
