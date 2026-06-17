"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
if (!Math) {
  (LoginHero + LoginFormCard)();
}
const LoginFormCard = () => "./components/LoginFormCard.js";
const LoginHero = () => "./components/LoginHero.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const uniIdRedirectUrl = common_vendor.ref("");
    common_vendor.onLoad((query) => {
      if (query == null ? void 0 : query.uniIdRedirectUrl) {
        uniIdRedirectUrl.value = decodeURIComponent(query.uniIdRedirectUrl);
      }
    });
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
        common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none"
        });
        return;
      }
      if (!password.value) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        const result = await common_api_modules_auth.login(buildLoginPayload());
        uni_modules_uniIdPages_common_store.mutations.loginSuccess({
          ...result,
          autoBack: false,
          uniIdRedirectUrl: uniIdRedirectUrl.value
        });
        const nextUrl = uniIdRedirectUrl.value || common_constants_routes.ROUTES.entry;
        common_vendor.index.reLaunch({
          url: nextUrl
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth-login/index.vue:95", "custom login failed", error);
      } finally {
        submitting.value = false;
      }
    }
    function goRegister() {
      common_vendor.index.navigateTo({
        url: common_constants_routes.ROUTES.register
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(submitLogin, "60"),
        b: common_vendor.o(goRegister, "16"),
        c: common_vendor.o(($event) => username.value = $event, "81"),
        d: common_vendor.o(($event) => password.value = $event, "db"),
        e: common_vendor.p({
          loading: submitting.value,
          username: username.value,
          password: password.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth-login/index.js.map
