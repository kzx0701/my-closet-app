"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_sessionRouter = require("../../common/services/session-router.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  (_component_path + _component_svg + _component_circle + _component_line)();
}
const MAX_AUTO_RETRIES = 3;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const isRouting = common_vendor.ref(false);
    const progressPercent = common_vendor.ref(0);
    const statusBarHeight = common_vendor.ref(44);
    const showError = common_vendor.ref(false);
    let progressTimer = null;
    let retryTimer = null;
    let retryCount = 0;
    function getRetryDelay(attempt) {
      return Math.min(1e3 * Math.pow(2, attempt), 4e3);
    }
    function startProgressSimulation() {
      progressPercent.value = 0;
      let current = 0;
      if (progressTimer)
        clearInterval(progressTimer);
      progressTimer = setInterval(() => {
        if (current < 85) {
          current += Math.random() * 12 + 3;
          if (current > 85)
            current = 85;
          progressPercent.value = current;
        }
      }, 200);
    }
    function completeProgress() {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      progressPercent.value = 100;
    }
    function resetProgress() {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      progressPercent.value = 0;
    }
    async function routeBySession() {
      if (isRouting.value)
        return;
      isRouting.value = true;
      showError.value = false;
      startProgressSimulation();
      try {
        const result = await common_services_sessionRouter.resolveLaunchTarget();
        if (result.target === common_constants_routes.ROUTE_TARGETS.error) {
          resetProgress();
          retryCount++;
          if (retryCount >= MAX_AUTO_RETRIES) {
            if (tryDegradedEntry())
              return;
            showError.value = true;
            isRouting.value = false;
          } else {
            if (retryTimer)
              clearTimeout(retryTimer);
            retryTimer = setTimeout(() => {
              isRouting.value = false;
              routeBySession();
            }, getRetryDelay(retryCount - 1));
          }
          return;
        }
        completeProgress();
        await delay(500);
        if (result.target === common_constants_routes.ROUTE_TARGETS.home) {
          return common_vendor.index.switchTab({ url: result.url });
        }
        return common_vendor.index.reLaunch({ url: result.url });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/entry/index.vue:163", "routeBySession failed", error);
        resetProgress();
        retryCount++;
        if (retryCount >= MAX_AUTO_RETRIES) {
          if (tryDegradedEntry())
            return;
          showError.value = true;
          isRouting.value = false;
        } else {
          if (retryTimer)
            clearTimeout(retryTimer);
          retryTimer = setTimeout(() => {
            isRouting.value = false;
            routeBySession();
          }, getRetryDelay(retryCount - 1));
        }
      } finally {
        isRouting.value = false;
      }
    }
    function tryDegradedEntry() {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin)
        return false;
      completeProgress();
      setTimeout(() => {
        common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.home });
      }, 300);
      return true;
    }
    function manualRetry() {
      retryCount = 0;
      routeBySession();
    }
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    common_vendor.onLoad(() => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 44;
      } catch (e) {
        statusBarHeight.value = 44;
      }
    });
    common_vendor.onShow(() => {
      retryCount = 0;
      routeBySession();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M 0 180 Q 187 120 375 180",
          fill: "none",
          stroke: "rgba(244,239,230,0.06)",
          ["stroke-width"]: "1"
        }),
        b: common_vendor.p({
          d: "M 0 240 Q 187 180 375 240",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          d: "M 0 600 Q 187 540 375 600",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          d: "M 0 660 Q 187 600 375 660",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        e: common_vendor.p({
          viewBox: "0 0 375 812",
          preserveAspectRatio: "none"
        }),
        f: statusBarHeight.value + 20 + "px",
        g: common_vendor.p({
          d: "M100 30 Q90 10 80 30 Q70 50 100 60 L100 90 L40 110 L160 110 L100 90"
        }),
        h: common_vendor.p({
          cx: "100",
          cy: "20",
          r: "6"
        }),
        i: common_vendor.p({
          x1: "40",
          y1: "110",
          x2: "160",
          y2: "110"
        }),
        j: common_vendor.p({
          viewBox: "0 0 200 120",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          stroke: "rgba(244,239,230,0.22)",
          ["stroke-width"]: "1.2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        k: !showError.value
      }, !showError.value ? {
        l: progressPercent.value + "%"
      } : {
        m: common_vendor.o(manualRetry, "2d")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ced29d0a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/entry/index.js.map
