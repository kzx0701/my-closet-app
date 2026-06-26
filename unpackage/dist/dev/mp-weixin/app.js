"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uniIdPages_init = require("./uni_modules/uni-id-pages/init.js");
if (!Math) {
  "./pages/entry/index.js";
  "./pages/auth-login/index.js";
  "./pages/auth-register/index.js";
  "./uni_modules/uni-id-pages/pages/login/login-withpwd.js";
  "./uni_modules/uni-id-pages/pages/login/login-withoutpwd.js";
  "./uni_modules/uni-id-pages/pages/register/register.js";
  "./uni_modules/uni-id-pages/pages/register/register-by-email.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve.js";
  "./uni_modules/uni-id-pages/pages/userinfo/userinfo.js";
  "./uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile.js";
  "./uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd.js";
  "./uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd.js";
  "./pages/family-guide/index.js";
  "./pages/family-create/index.js";
  "./pages/clothes/index.js";
  "./pages/clothes-create/index.js";
  "./pages/clothes-detail/index.js";
  "./pages/closet-detail/index.js";
  "./pages/closets/index.js";
  "./pages/closet-create/index.js";
  "./pages/home/index.js";
  "./pages/user-info/index.js";
  "./pages/profile/index.js";
}
if (!Array) {
  const _easycom_u_toast = common_vendor.resolveComponent("u-toast");
  const _easycom_u_modal = common_vendor.resolveComponent("u-modal");
  (_easycom_u_toast + _easycom_u_modal)();
}
if (!Math) {
  (common_vendor._easycom_u_toast + common_vendor._easycom_u_modal)();
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const uToastRef = common_vendor.ref(null);
    const uModalRef = common_vendor.ref(null);
    common_vendor.onLaunch(async () => {
      try {
        await uni_modules_uniIdPages_init.initUniIdPages();
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:21", "uni-id-pages init failed", error);
      }
    });
    common_vendor.onShow(() => {
    });
    common_vendor.onHide(() => {
    });
    common_vendor.index.$u.toast = (options) => {
      var _a;
      (_a = uToastRef.value) == null ? void 0 : _a.show(options);
    };
    common_vendor.index.$u.modal = (options) => {
      var _a;
      return (_a = uModalRef.value) == null ? void 0 : _a.show(options);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(uToastRef, "2f0451d6-0", {
          "k": "uToastRef"
        }),
        b: common_vendor.sr(uModalRef, "2f0451d6-1", {
          "k": "uModalRef"
        })
      };
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.uviewPlus);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
