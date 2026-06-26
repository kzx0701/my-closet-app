"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_sessionRouter = require("../../common/services/session-router.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  (_component_path + _component_svg + _component_line + _component_polyline)();
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
    const loadingTexts = [
      "正在初始化...",
      "加载配置中...",
      "准备就绪"
    ];
    const loadingText = common_vendor.computed(() => {
      if (progressPercent.value < 30)
        return loadingTexts[0];
      if (progressPercent.value < 70)
        return loadingTexts[1];
      return loadingTexts[2];
    });
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
        common_vendor.index.__f__("error", "at pages/entry/index.vue:182", "routeBySession failed", error);
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
          d: "M 0 160 Q 187 110 375 160",
          fill: "none",
          stroke: "rgba(244,239,230,0.06)",
          ["stroke-width"]: "1"
        }),
        b: common_vendor.p({
          d: "M 0 220 Q 187 170 375 220",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          d: "M 0 580 Q 187 530 375 580",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          d: "M 0 640 Q 187 590 375 640",
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
          d: "M24 6 C24 6 22 4 20 4 C18 4 16 6 16 6"
        }),
        h: common_vendor.p({
          x1: "24",
          y1: "6",
          x2: "24",
          y2: "12"
        }),
        i: common_vendor.p({
          d: "M24 12 L14 18 L8 16 L6 20 L14 24 L14 40 L34 40 L34 24 L42 20 L40 16 L34 18 Z"
        }),
        j: common_vendor.p({
          d: "M20 12 L24 18 L28 12"
        }),
        k: common_vendor.p({
          viewBox: "0 0 48 48",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        l: !showError.value
      }, !showError.value ? {
        m: common_vendor.t(loadingText.value),
        n: progressPercent.value + "%"
      } : {
        o: common_vendor.p({
          points: "23 4 23 10 17 10"
        }),
        p: common_vendor.p({
          d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
        }),
        q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        r: common_vendor.o(manualRetry, "67")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ced29d0a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/entry/index.js.map
