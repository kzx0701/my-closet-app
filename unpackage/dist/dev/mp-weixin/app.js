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
  "./pages/family-guide/index.js";
  "./pages/family-create/index.js";
  "./pages/clothes/index.js";
  "./pages/closets/index.js";
  "./pages/closet-create/index.js";
  "./pages/home/index.js";
  "./pages/profile/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      try {
        await uni_modules_uniIdPages_init.initUniIdPages();
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:9", "uni-id-pages init failed", error);
      }
      common_vendor.index.__f__("log", "at App.vue:11", "App Launch");
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:15", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:19", "App Hide");
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
