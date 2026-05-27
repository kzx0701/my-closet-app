"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_sessionRouter = require("../../common/services/session-router.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const statusText = common_vendor.ref("即将进入应用");
    const isRouting = common_vendor.ref(false);
    const showRetry = common_vendor.ref(false);
    async function routeBySession() {
      var _a;
      if (isRouting.value) {
        return;
      }
      isRouting.value = true;
      showRetry.value = false;
      statusText.value = "正在准备页面";
      try {
        const result = await common_services_sessionRouter.resolveLaunchTarget();
        if (result.target === common_constants_routes.ROUTE_TARGETS.login) {
          statusText.value = "未登录，前往登录页";
          return common_vendor.index.redirectTo({
            url: result.url
          });
        }
        if (result.target === common_constants_routes.ROUTE_TARGETS.error) {
          statusText.value = ((_a = result.membership) == null ? void 0 : _a.errorMessage) || "状态检查失败，请稍后重试";
          showRetry.value = true;
          return;
        }
        if (result.target === common_constants_routes.ROUTE_TARGETS.home) {
          statusText.value = result.hasSkippedFamilyGuide ? "已按个人模式进入首页" : "检测到可直接进入首页";
        } else {
          statusText.value = "尚未加入家庭，进入家庭引导";
        }
        if (result.target === common_constants_routes.ROUTE_TARGETS.home) {
          return common_vendor.index.switchTab({
            url: result.url
          });
        }
        return common_vendor.index.reLaunch({
          url: result.url
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/entry/index.vue:65", "routeBySession failed", error);
        statusText.value = "状态检查失败，请重新尝试";
        showRetry.value = true;
      } finally {
        isRouting.value = false;
      }
    }
    common_vendor.onShow(() => {
      routeBySession();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(statusText.value),
        b: showRetry.value
      }, showRetry.value ? {
        c: common_vendor.o(routeBySession, "82")
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/entry/index.js.map
