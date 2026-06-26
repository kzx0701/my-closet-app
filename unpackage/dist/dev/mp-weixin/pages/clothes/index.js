"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_services_cacheService = require("../../common/services/cache-service.js");
if (!Array) {
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_path = common_vendor.resolveComponent("path");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_component_circle + _component_line + _component_svg + _component_path + _easycom_u_loadmore2)();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ScopeBadge + ClothesFilterBar + ClothesEmptyState + ClothesListCard + _easycom_u_loadmore + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ScopeBadge = () => "../../components/ScopeBadge.js";
const ClothesFilterBar = () => "./components/ClothesFilterBar.js";
const ClothesListCard = () => "./components/ClothesListCard.js";
const ClothesEmptyState = () => "./components/ClothesEmptyState.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(false);
    const clothes = common_vendor.ref([]);
    const activeCategory = common_vendor.ref("all");
    const activeSeason = common_vendor.ref("all");
    const searchKeyword = common_vendor.ref("");
    const scopeType = common_vendor.ref("personal");
    const hasFamily = common_vendor.ref(false);
    const familyName = common_vendor.ref("");
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const total = common_vendor.ref(0);
    const totalCount = common_vendor.ref(0);
    const unassignedCount = common_vendor.ref(0);
    const hasInitialized = common_vendor.ref(false);
    const needRefresh = common_vendor.ref(false);
    const filterKeyword = common_vendor.ref("");
    const sortMode = common_vendor.ref("time");
    let currentRequestId = 0;
    let searchTimer = null;
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (clothes.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const scopeBadgeText = common_vendor.computed(
      () => scopeType.value === "family" ? "Family · 家庭衣物" : "Personal · 个人衣物"
    );
    const pageTitle = common_vendor.computed(
      () => scopeType.value === "family" ? "家庭衣物" : "我的衣物"
    );
    const pageDesc = common_vendor.computed(
      () => scopeType.value === "family" ? "管理家庭共享的衣物，按类别和季节快速查找。" : "管理你自己的衣物，按类别和季节快速查找。"
    );
    const sortLabel = common_vendor.computed(() => {
      if (sortMode.value === "name")
        return "按名称";
      if (sortMode.value === "category")
        return "按分类";
      return "按添加时间";
    });
    const displayClothes = common_vendor.computed(() => {
      const keyword = filterKeyword.value.trim().toLowerCase();
      let result = keyword ? clothes.value.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const remark = (item.remark || "").toLowerCase();
        return name.includes(keyword) || remark.includes(keyword);
      }) : [...clothes.value];
      if (sortMode.value === "name") {
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      } else if (sortMode.value === "category") {
        result.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
      } else {
        result.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      }
      return result;
    });
    function getFilterStorageKey() {
      const session = common_services_auth.getCurrentSession();
      return `clothes_filter_${(session == null ? void 0 : session.uid) || "anonymous"}`;
    }
    function saveFilterState() {
      try {
        common_vendor.index.setStorageSync(getFilterStorageKey(), {
          category: activeCategory.value,
          season: activeSeason.value,
          keyword: searchKeyword.value,
          sortMode: sortMode.value
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:257", "saveFilterState failed", e);
      }
    }
    function restoreFilterState() {
      try {
        const saved = common_vendor.index.getStorageSync(getFilterStorageKey());
        if (saved) {
          activeCategory.value = saved.category || "all";
          activeSeason.value = saved.season || "all";
          searchKeyword.value = saved.keyword || "";
          filterKeyword.value = searchKeyword.value;
          const savedSort = saved.sortMode;
          sortMode.value = savedSort === "name" || savedSort === "category" ? savedSort : "time";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:273", "restoreFilterState failed", e);
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
      if (nextScopeType === scopeType.value)
        return;
      if (nextScopeType === "family" && !hasFamily.value)
        return;
      const session = common_services_auth.getCurrentSession();
      scopeType.value = nextScopeType;
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, nextScopeType);
      currentPage.value = 1;
      searchKeyword.value = "";
      filterKeyword.value = "";
      if (searchTimer)
        clearTimeout(searchTimer);
      saveFilterState();
      loadClothes();
      loadSummary();
    }
    async function loadSummary() {
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      const cached = uid ? common_services_cacheService.getHomeSummaryCache(uid, scope) : null;
      if (cached) {
        totalCount.value = cached.clothesCount || 0;
        unassignedCount.value = cached.unassignedClothesCount || 0;
      }
      try {
        const summary = await common_api_modules_closet.getHomeSummary({ scopeType: scope });
        totalCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
        unassignedCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
        if (uid && summary) {
          common_services_cacheService.setHomeSummaryCache(uid, scope, summary);
        }
      } catch (error2) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:355", "loadSummary failed", error2);
        if (!cached) {
          totalCount.value = 0;
          unassignedCount.value = 0;
        }
      }
    }
    async function loadClothes(append = false) {
      loading.value = true;
      if (!append)
        error.value = false;
      const requestId = ++currentRequestId;
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      if (!append && uid) {
        const cached = common_services_cacheService.getClothesListCache(uid, scope);
        if (cached && cached.list) {
          clothes.value = cached.list;
          total.value = cached.total || 0;
          loading.value = false;
        }
      }
      try {
        const payload = {
          page: currentPage.value,
          pageSize: pageSize.value
        };
        if (activeCategory.value !== "all") {
          payload.category = activeCategory.value;
        }
        if (activeSeason.value !== "all") {
          payload.season = activeSeason.value;
        }
        const result = scope === "family" ? await common_api_modules_clothes.getFamilyClothesList(payload) : await common_api_modules_clothes.getPersonalClothesList(payload);
        if (requestId !== currentRequestId)
          return;
        const list = (result == null ? void 0 : result.list) || [];
        if (append) {
          clothes.value = [...clothes.value, ...list];
        } else {
          clothes.value = list;
        }
        total.value = (result == null ? void 0 : result.total) || 0;
        if (!append && uid && activeCategory.value === "all" && activeSeason.value === "all" && currentPage.value === 1) {
          common_services_cacheService.setClothesListCache(uid, scope, { list, total: total.value });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:416", "loadClothes failed", err);
        if (requestId !== currentRequestId)
          return;
        if (!append && clothes.value.length === 0) {
          error.value = true;
          total.value = 0;
        }
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "衣物列表加载失败",
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
      loadClothes();
      loadSummary();
    }
    function onCategoryChange(code) {
      activeCategory.value = code;
      currentPage.value = 1;
      saveFilterState();
      loadClothes();
    }
    function onSeasonChange(code) {
      activeSeason.value = code;
      currentPage.value = 1;
      saveFilterState();
      loadClothes();
    }
    function onSearchInput(e) {
      searchKeyword.value = e.detail.value;
      if (searchTimer)
        clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        filterKeyword.value = searchKeyword.value;
        saveFilterState();
      }, 300);
    }
    function clearSearch() {
      searchKeyword.value = "";
      filterKeyword.value = "";
      if (searchTimer)
        clearTimeout(searchTimer);
      saveFilterState();
    }
    function toggleSortMode() {
      const modes = ["time", "name", "category"];
      const currentIndex = modes.indexOf(sortMode.value);
      sortMode.value = modes[(currentIndex + 1) % modes.length];
      saveFilterState();
    }
    function goCreateClothes() {
      common_vendor.index.navigateTo({
        url: scopeType.value === "family" ? `${common_constants_routes.ROUTES.clothesCreate}?scopeType=family` : common_constants_routes.ROUTES.clothesCreate
      });
    }
    common_vendor.index.$on("clothes:need-refresh", () => {
      needRefresh.value = true;
    });
    common_vendor.onPullDownRefresh(async () => {
      currentPage.value = 1;
      await Promise.all([loadClothes(), loadSummary()]);
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      if (loading.value || clothes.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClothes(true);
    });
    common_vendor.onLoad(() => {
      common_vendor.index.hideTabBar({ animation: false });
    });
    common_vendor.onShow(async () => {
      common_vendor.index.hideTabBar({ animation: false });
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
        restoreFilterState();
        currentPage.value = 1;
        loadClothes();
        loadSummary();
        hasInitialized.value = true;
      } else {
        loadSummary();
        if (needRefresh.value) {
          needRefresh.value = false;
          currentPage.value = 1;
          loadClothes();
        }
      }
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("clothes:need-refresh");
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
        d: common_vendor.t(totalCount.value),
        e: common_vendor.t(unassignedCount.value),
        f: scopeType.value === "personal" ? 1 : "",
        g: common_vendor.o(($event) => changeScope("personal"), "d3"),
        h: hasFamily.value
      }, hasFamily.value ? {
        i: common_vendor.t(familyName.value),
        j: scopeType.value === "family" ? 1 : "",
        k: common_vendor.o(($event) => changeScope("family"), "f3")
      } : {}, {
        l: common_vendor.p({
          cx: "11",
          cy: "11",
          r: "8"
        }),
        m: common_vendor.p({
          x1: "21",
          y1: "21",
          x2: "16.65",
          y2: "16.65"
        }),
        n: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        o: searchKeyword.value,
        p: common_vendor.o(onSearchInput, "c8"),
        q: searchKeyword.value
      }, searchKeyword.value ? {
        r: common_vendor.p({
          x1: "18",
          y1: "6",
          x2: "6",
          y2: "18"
        }),
        s: common_vendor.p({
          x1: "6",
          y1: "6",
          x2: "18",
          y2: "18"
        }),
        t: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        v: common_vendor.o(clearSearch, "41")
      } : {}, {
        w: common_vendor.o(onCategoryChange, "4d"),
        x: common_vendor.o(onSeasonChange, "2a"),
        y: common_vendor.p({
          ["active-category"]: activeCategory.value,
          ["active-season"]: activeSeason.value
        }),
        z: common_vendor.t(displayClothes.value.length),
        A: common_vendor.t(sortLabel.value),
        B: common_vendor.p({
          d: "M6 9l6 6 6-6"
        }),
        C: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        D: common_vendor.o(toggleSortMode, "85"),
        E: loading.value && clothes.value.length === 0
      }, loading.value && clothes.value.length === 0 ? {
        F: common_vendor.f(6, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : error.value ? {
        H: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        I: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        J: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        K: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        L: common_vendor.o(retryLoad, "3f")
      } : clothes.value.length === 0 ? {
        N: common_vendor.o(goCreateClothes, "18"),
        O: common_vendor.p({
          ["scope-type"]: scopeType.value
        })
      } : displayClothes.value.length === 0 ? {
        Q: common_vendor.t(searchKeyword.value),
        R: common_vendor.o(clearSearch, "79")
      } : {
        S: common_vendor.f(displayClothes.value, (item, k0, i0) => {
          return {
            a: "859382c8-15-" + i0,
            b: common_vendor.p({
              clothes: item
            }),
            c: item._id
          };
        })
      }, {
        G: error.value,
        M: clothes.value.length === 0,
        P: displayClothes.value.length === 0,
        T: clothes.value.length > 0
      }, clothes.value.length > 0 ? {
        U: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}, {
        V: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        W: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        X: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        Y: common_vendor.o(goCreateClothes, "92"),
        Z: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).clothes
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-859382c8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes/index.js.map
