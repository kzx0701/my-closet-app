"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
if (!Math) {
  (RegisterHero + RegisterFormCard)();
}
const RegisterFormCard = () => "./components/RegisterFormCard.js";
const RegisterHero = () => "./components/RegisterHero.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const username = common_vendor.ref("");
    const nickname = common_vendor.ref("");
    const password = common_vendor.ref("");
    const passwordConfirm = common_vendor.ref("");
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
      if (normalizedUsername.length < 4 || normalizedUsername.length > 20) {
        return "用户名长度需为 4-20 位";
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
        if (normalizedNickname.length < 2 || normalizedNickname.length > 32) {
          return "昵称长度需为 2-32 位";
        }
      }
      if (!password.value) {
        return "请输入密码";
      }
      if (password.value.length < 6) {
        return "密码长度至少 6 位";
      }
      if (passwordConfirm.value !== password.value) {
        return "两次输入的密码不一致";
      }
      return "";
    }
    async function submitRegister() {
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
          password2: passwordConfirm.value
        });
        uni_modules_uniIdPages_common_store.mutations.loginSuccess({
          ...result,
          autoBack: false
        });
        common_vendor.index.reLaunch({
          url: common_constants_routes.ROUTES.entry
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth-register/index.vue:120", "custom register failed", error);
        common_vendor.index.showToast({ title: (error == null ? void 0 : error.message) || "注册失败，请重试", icon: "none" });
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
    function goBack() {
      common_vendor.index.navigateBack({
        fail() {
          common_vendor.index.reLaunch({
            url: common_constants_routes.ROUTES.entry
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          d: "M15 18l-6-6 6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        c: common_vendor.o(goBack, "09"),
        d: common_vendor.o(submitRegister, "24"),
        e: common_vendor.o(goLogin, "76"),
        f: common_vendor.o(($event) => username.value = $event, "2b"),
        g: common_vendor.o(($event) => nickname.value = $event, "21"),
        h: common_vendor.o(($event) => password.value = $event, "53"),
        i: common_vendor.o(($event) => passwordConfirm.value = $event, "35"),
        j: common_vendor.p({
          loading: submitting.value,
          username: username.value,
          nickname: nickname.value,
          password: password.value,
          passwordConfirm: passwordConfirm.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f5970715"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth-register/index.js.map
