"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
if (!Math) {
  LoginDesignA();
}
const LoginDesignA = () => "./components/LoginDesignA.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const wxLoading = common_vendor.ref(false);
    const uniIdRedirectUrl = common_vendor.ref("");
    const statusBarHeight = common_vendor.ref(44);
    const loginMode = common_vendor.ref("wechat");
    const agreed = common_vendor.ref(false);
    const agreementShake = common_vendor.ref(false);
    common_vendor.onLoad((query) => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 44;
      } catch (e) {
        statusBarHeight.value = 44;
      }
      if (query == null ? void 0 : query.uniIdRedirectUrl) {
        uniIdRedirectUrl.value = decodeURIComponent(query.uniIdRedirectUrl);
      }
    });
    function toggleAgree() {
      agreed.value = !agreed.value;
    }
    function switchMode(mode) {
      loginMode.value = mode;
    }
    function checkAgreement() {
      if (!agreed.value) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none"
        });
        agreementShake.value = true;
        setTimeout(() => {
          agreementShake.value = false;
        }, 500);
        return false;
      }
      return true;
    }
    function buildLoginPayload() {
      const account = username.value.trim();
      const payload = {
        password: password.value
      };
      if (/^1\d{10}$/.test(account)) {
        payload.mobile = account;
        return payload;
      }
      if (/@/.test(account)) {
        payload.email = account;
        return payload;
      }
      payload.username = account;
      return payload;
    }
    async function submitLogin() {
      if (!username.value.trim()) {
        common_vendor.index.showToast({ title: "请输入账号", icon: "none" });
        return;
      }
      if (!password.value) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (!checkAgreement())
        return;
      if (submitting.value)
        return;
      submitting.value = true;
      try {
        const result = await common_api_modules_auth.login(buildLoginPayload());
        uni_modules_uniIdPages_common_store.mutations.loginSuccess({
          ...result,
          autoBack: false,
          uniIdRedirectUrl: uniIdRedirectUrl.value
        });
        if (uniIdRedirectUrl.value) {
          common_vendor.index.reLaunch({ url: uniIdRedirectUrl.value });
        } else {
          common_vendor.index.navigateBack({
            fail() {
              common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.home });
            }
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth-login/index.vue:136", "custom login failed", error);
        common_vendor.index.showToast({ title: (error == null ? void 0 : error.message) || "登录失败，请重试", icon: "none" });
      } finally {
        submitting.value = false;
      }
    }
    async function loginByWeixin() {
      var _a, _b;
      if (!checkAgreement())
        return;
      if (wxLoading.value)
        return;
      wxLoading.value = true;
      try {
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({
            provider: "weixin",
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });
        const code = loginRes.code;
        if (!code) {
          throw new Error("获取微信授权码失败");
        }
        const uniIdCo = common_vendor._r.importObject("uni-id-co", { customUI: true });
        const result = await uniIdCo.loginByWeixin({ code });
        uni_modules_uniIdPages_common_store.mutations.loginSuccess({
          ...result,
          autoBack: false,
          uniIdRedirectUrl: uniIdRedirectUrl.value
        });
        if (uniIdRedirectUrl.value) {
          common_vendor.index.reLaunch({ url: uniIdRedirectUrl.value });
        } else {
          common_vendor.index.navigateBack({
            fail() {
              common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.home });
            }
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth-login/index.vue:183", "weixin login failed", error);
        if (((_a = error == null ? void 0 : error.errMsg) == null ? void 0 : _a.includes("cancel")) || ((_b = error == null ? void 0 : error.errMsg) == null ? void 0 : _b.includes("deny"))) {
          common_vendor.index.showToast({ title: "已取消授权", icon: "none" });
        } else {
          common_vendor.index.showToast({
            title: (error == null ? void 0 : error.message) || "微信登录失败，请重试",
            icon: "none",
            duration: 3e3
          });
        }
      } finally {
        wxLoading.value = false;
      }
    }
    function goRegister() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.register });
    }
    function goForgot() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/retrieve/retrieve",
        fail: () => {
          common_vendor.index.showToast({ title: "找回密码页面暂不可用", icon: "none" });
        }
      });
    }
    function goBack() {
      common_vendor.index.navigateBack({
        fail() {
          common_vendor.index.reLaunch({ url: common_constants_routes.ROUTES.entry });
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack, "c0"),
        b: common_vendor.o(toggleAgree, "39"),
        c: common_vendor.o(loginByWeixin, "93"),
        d: common_vendor.o(switchMode, "b3"),
        e: common_vendor.o(submitLogin, "ff"),
        f: common_vendor.o(goRegister, "dd"),
        g: common_vendor.o(goForgot, "6a"),
        h: common_vendor.o(($event) => username.value = $event, "5d"),
        i: common_vendor.o(($event) => password.value = $event, "14"),
        j: common_vendor.p({
          statusBarHeight: statusBarHeight.value,
          mode: loginMode.value,
          agreed: agreed.value,
          agreementShake: agreementShake.value,
          wxLoading: wxLoading.value,
          submitting: submitting.value,
          username: username.value,
          password: password.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d0795671"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth-login/index.js.map
