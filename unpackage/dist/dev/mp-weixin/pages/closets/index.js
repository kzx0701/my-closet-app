"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_services_cacheService = require("../../common/services/cache-service.js");
if (!Array) {
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_component_circle + _component_line + _component_svg + _easycom_u_loadmore2)();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ScopeBadge + ClosetEmptyState + ClosetListCard + _easycom_u_loadmore + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ScopeBadge = () => "../../components/ScopeBadge.js";
const ClosetEmptyState = () => "./components/ClosetEmptyState.js";
const ClosetListCard = () => "./components/ClosetListCard.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const error = common_vendor.ref(false);
    const closets = common_vendor.ref([]);
    const scopeType = common_vendor.ref("personal");
    const hasFamily = common_vendor.ref(false);
    const familyName = common_vendor.ref("");
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const total = common_vendor.ref(0);
    const closetCount = common_vendor.ref(0);
    const clothesCount = common_vendor.ref(0);
    const unassignedCount = common_vendor.ref(0);
    const hasInitialized = common_vendor.ref(false);
    const needRefresh = common_vendor.ref(false);
    const searchKeyword = common_vendor.ref("");
    const filterKeyword = common_vendor.ref("");
    let currentRequestId = 0;
    let searchTimer = null;
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (closets.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const allowCreate = common_vendor.computed(() => scopeType.value === "personal" || hasFamily.value);
    const scopeBadgeText = common_vendor.computed(
      () => scopeType.value === "family" ? "Family · 家庭空间" : "Personal · 个人空间"
    );
    const pageTitle = common_vendor.computed(() => scopeType.value === "family" ? "家庭衣橱" : "我的衣橱");
    const pageDesc = common_vendor.computed(
      () => scopeType.value === "family" ? "管理家庭共享的衣橱，方便家庭成员协作管理。" : "管理你自己的衣橱与衣物"
    );
    const summaryData = common_vendor.computed(() => ({
      closetCount: String(closetCount.value),
      clothesCount: String(clothesCount.value),
      unassignedCount: String(unassignedCount.value)
    }));
    const displayClosets = common_vendor.computed(() => {
      const keyword = filterKeyword.value.trim().toLowerCase();
      if (!keyword)
        return closets.value;
      return closets.value.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const roomName = (item.room_name || "").toLowerCase();
        return name.includes(keyword) || roomName.includes(keyword);
      });
    });
    function getSearchStorageKey() {
      const session = common_services_auth.getCurrentSession();
      return `closets_search_${(session == null ? void 0 : session.uid) || "anonymous"}`;
    }
    function saveSearchState() {
      try {
        common_vendor.index.setStorageSync(getSearchStorageKey(), {
          keyword: searchKeyword.value
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:234", "saveSearchState failed", e);
      }
    }
    function restoreSearchState() {
      try {
        const saved = common_vendor.index.getStorageSync(getSearchStorageKey());
        if (saved) {
          searchKeyword.value = saved.keyword || "";
          filterKeyword.value = searchKeyword.value;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:246", "restoreSearchState failed", e);
      }
    }
    async function syncScopeType() {
      var _a, _b;
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid)) {
        hasFamily.value = false;
        scopeType.value = "personal";
        return;
      }
      const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
      if (membership.status !== "success") {
        const cachedFamily = common_services_cacheService.getFamilyInfoCache(session.uid);
        hasFamily.value = (cachedFamily == null ? void 0 : cachedFamily.hasFamily) || false;
        familyName.value = ((_a = cachedFamily == null ? void 0 : cachedFamily.familyRecord) == null ? void 0 : _a.name) || "未命名家庭";
        if (!hasFamily.value) {
          scopeType.value = "personal";
          common_services_closetScopeState.setClosetScopeState(session.uid, "personal");
          return;
        }
        scopeType.value = common_services_closetScopeState.getClosetScopeState(session.uid);
        return;
      }
      hasFamily.value = membership.hasFamily;
      if (hasFamily.value) {
        familyName.value = ((_b = membership.familyRecord) == null ? void 0 : _b.name) || "未命名家庭";
      } else {
        familyName.value = "";
      }
      if (!hasFamily.value) {
        scopeType.value = "personal";
        common_services_closetScopeState.setClosetScopeState(session.uid, "personal");
        return;
      }
      scopeType.value = common_services_closetScopeState.getClosetScopeState(session.uid);
    }
    function changeScope(nextScopeType) {
      if (nextScopeType === scopeType.value) {
        return;
      }
      if (nextScopeType === "family" && !hasFamily.value) {
        return;
      }
      const session = common_services_auth.getCurrentSession();
      scopeType.value = nextScopeType;
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, nextScopeType);
      currentPage.value = 1;
      searchKeyword.value = "";
      filterKeyword.value = "";
      if (searchTimer)
        clearTimeout(searchTimer);
      saveSearchState();
      loadClosets();
      loadSummary();
    }
    async function loadSummary() {
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      const cached = uid ? common_services_cacheService.getHomeSummaryCache(uid, scope) : null;
      if (cached) {
        closetCount.value = cached.closetCount || 0;
        clothesCount.value = cached.clothesCount || 0;
        unassignedCount.value = cached.unassignedClothesCount || 0;
      }
      try {
        const summary = await common_api_modules_closet.getHomeSummary({ scopeType: scope });
        closetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
        clothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
        unassignedCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
        if (uid && summary) {
          common_services_cacheService.setHomeSummaryCache(uid, scope, summary);
        }
      } catch (error2) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:336", "loadSummary failed", error2);
        if (!cached) {
          closetCount.value = 0;
          clothesCount.value = 0;
          unassignedCount.value = 0;
        }
      }
    }
    async function loadClosets(append = false) {
      loading.value = true;
      if (!append)
        error.value = false;
      const requestId = ++currentRequestId;
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      if (!append && uid) {
        const cached = common_services_cacheService.getClosetListCache(uid, scope);
        if (cached && cached.list) {
          closets.value = cached.list;
          total.value = cached.total || 0;
          loading.value = false;
        }
      }
      try {
        const payload = { page: currentPage.value, pageSize: pageSize.value };
        const result = scope === "family" ? await common_api_modules_closet.getFamilyClosetList(payload) : await common_api_modules_closet.getPersonalClosetList(payload);
        if (requestId !== currentRequestId)
          return;
        const list = (result == null ? void 0 : result.list) || [];
        if (append) {
          closets.value = [...closets.value, ...list];
        } else {
          closets.value = list;
        }
        total.value = (result == null ? void 0 : result.total) || 0;
        if (!append && uid && !searchKeyword.value && currentPage.value === 1) {
          common_services_cacheService.setClosetListCache(uid, scope, { list, total: total.value });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:386", "loadClosets failed", err);
        if (requestId !== currentRequestId)
          return;
        if (!append && closets.value.length === 0) {
          error.value = true;
          total.value = 0;
        }
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "衣橱列表加载失败",
          icon: "none"
        });
      } finally {
        if (requestId === currentRequestId) {
          loading.value = false;
        }
      }
    }
    function retryLoad() {
      currentPage.value = 1;
      loadClosets();
      loadSummary();
    }
    function goCreateCloset() {
      common_vendor.index.navigateTo({
        url: scopeType.value === "family" ? `${common_constants_routes.ROUTES.closetCreate}?scopeType=family` : common_constants_routes.ROUTES.closetCreate
      });
    }
    function onSearchInput(e) {
      searchKeyword.value = e.detail.value;
      if (searchTimer)
        clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        filterKeyword.value = searchKeyword.value;
        saveSearchState();
      }, 300);
    }
    function clearSearch() {
      searchKeyword.value = "";
      filterKeyword.value = "";
      if (searchTimer)
        clearTimeout(searchTimer);
      saveSearchState();
    }
    common_vendor.index.$on("closets:need-refresh", () => {
      needRefresh.value = true;
    });
    common_vendor.onPullDownRefresh(async () => {
      refreshing.value = true;
      currentPage.value = 1;
      await Promise.all([loadClosets(), loadSummary()]);
      refreshing.value = false;
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      if (loading.value || closets.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClosets(true);
    });
    common_vendor.onShow(async () => {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none", duration: 1500 });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.login });
        }, 500);
        return;
      }
      await syncScopeType();
      if (!hasInitialized.value) {
        restoreSearchState();
        currentPage.value = 1;
        loadClosets();
        loadSummary();
        hasInitialized.value = true;
      } else {
        loadSummary();
        if (needRefresh.value) {
          needRefresh.value = false;
          currentPage.value = 1;
          loadClosets();
        }
      }
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("closets:need-refresh");
      if (searchTimer)
        clearTimeout(searchTimer);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          text: scopeBadgeText.value
        }),
        b: common_vendor.t(pageTitle.value),
        c: common_vendor.t(pageDesc.value),
        d: common_vendor.t(summaryData.value.closetCount),
        e: common_vendor.t(summaryData.value.clothesCount),
        f: common_vendor.t(summaryData.value.unassignedCount),
        g: common_vendor.p({
          cx: "11",
          cy: "11",
          r: "8"
        }),
        h: common_vendor.p({
          x1: "21",
          y1: "21",
          x2: "16.65",
          y2: "16.65"
        }),
        i: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        j: searchKeyword.value,
        k: common_vendor.o(onSearchInput, "b7"),
        l: searchKeyword.value
      }, searchKeyword.value ? {
        m: common_vendor.p({
          x1: "18",
          y1: "6",
          x2: "6",
          y2: "18"
        }),
        n: common_vendor.p({
          x1: "6",
          y1: "6",
          x2: "18",
          y2: "18"
        }),
        o: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        p: common_vendor.o(clearSearch, "ff")
      } : {}, {
        q: scopeType.value === "personal" ? 1 : "",
        r: common_vendor.o(($event) => changeScope("personal"), "00"),
        s: hasFamily.value
      }, hasFamily.value ? {
        t: common_vendor.t(familyName.value),
        v: scopeType.value === "family" ? 1 : "",
        w: common_vendor.o(($event) => changeScope("family"), "a4")
      } : {}, {
        x: loading.value && closets.value.length === 0
      }, loading.value && closets.value.length === 0 ? {
        y: common_vendor.f(4, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : error.value ? {
        A: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        B: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        C: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        D: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        E: common_vendor.o(retryLoad, "57")
      } : closets.value.length === 0 ? {
        G: common_vendor.o(goCreateCloset, "a8"),
        H: common_vendor.p({
          ["scope-type"]: scopeType.value,
          ["can-create"]: allowCreate.value
        })
      } : displayClosets.value.length === 0 ? {
        J: common_vendor.o(clearSearch, "8e")
      } : common_vendor.e({
        K: common_vendor.f(displayClosets.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: "13ffa884-12-" + i0,
            c: common_vendor.p({
              closet: item
            })
          };
        }),
        L: allowCreate.value && !filterKeyword.value
      }, allowCreate.value && !filterKeyword.value ? {
        M: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        N: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        O: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        P: common_vendor.o(goCreateCloset, "0c")
      } : {}), {
        z: error.value,
        F: closets.value.length === 0,
        I: displayClosets.value.length === 0,
        Q: closets.value.length > 0 && !filterKeyword.value
      }, closets.value.length > 0 && !filterKeyword.value ? {
        R: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}, {
        S: allowCreate.value
      }, allowCreate.value ? {
        T: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        U: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        V: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        W: common_vendor.o(goCreateCloset, "70")
      } : {}, {
        X: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).closets
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13ffa884"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closets/index.js.map
