"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_services_cacheService = require("../../common/services/cache-service.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_component_path + _component_svg + _component_circle + _component_line + _component_polyline + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _easycom_u_loadmore2)();
}
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ClosetEmptyState + ClosetListCard + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_u_loadmore + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ClosetEmptyState = () => "./components/ClosetEmptyState.js";
const ClosetListCard = () => "./components/ClosetListCard.js";
const SWIPE_HINT_KEY = "closets_swipe_hint_closed";
const SEARCH_HISTORY_KEY = "closets_search_history";
const SEARCH_HISTORY_MAX = 8;
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
    const isSearching = common_vendor.ref(false);
    const sortBy = common_vendor.ref("default");
    const filterRoom = common_vendor.ref("");
    const statusBarHeight = common_vendor.ref(20);
    const isFirstEmpty = common_vendor.ref(false);
    const showSwipeHint = common_vendor.ref(false);
    const isSearchFocused = common_vendor.ref(false);
    const searchHistory = common_vendor.ref([]);
    const SORT_OPTIONS = [
      { value: "default", label: "默认" },
      { value: "created_at_desc", label: "最新创建" },
      { value: "created_at_asc", label: "最早创建" },
      { value: "name_asc", label: "名称 A-Z" },
      { value: "name_desc", label: "名称 Z-A" },
      { value: "clothes_count_desc", label: "衣物最多" },
      { value: "clothes_count_asc", label: "衣物最少" }
    ];
    const HOT_SEARCH_KEYWORDS = ["主卧", "次卧", "客厅", "儿童房", "玄关"];
    const SWIPE_OPTIONS = [
      {
        text: "编辑",
        style: {
          backgroundColor: "#3a5443",
          color: "#f8f4ec",
          fontSize: "14px",
          width: "64px"
        }
      },
      {
        text: "删除",
        style: {
          backgroundColor: "#c45c3e",
          color: "#f8f4ec",
          fontSize: "14px",
          width: "64px"
        }
      }
    ];
    let currentRequestId = 0;
    let searchTimer = null;
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (closets.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const showLoadProgress = common_vendor.computed(() => total.value > pageSize.value && closets.value.length > 0 && !filterKeyword.value);
    const loadProgressPercent = common_vendor.computed(() => {
      if (total.value <= 0)
        return 0;
      return Math.min(100, Math.round(closets.value.length / total.value * 100));
    });
    const loadProgressText = common_vendor.computed(() => {
      if (loading.value) {
        return `正在加载… 已加载 ${closets.value.length} / ${total.value} 个衣橱`;
      }
      if (closets.value.length >= total.value) {
        return `已全部加载 ${total.value} 个衣橱`;
      }
      return `已加载 ${closets.value.length} / ${total.value} 个衣橱`;
    });
    const allowCreate = common_vendor.computed(() => scopeType.value === "personal" || hasFamily.value);
    const showSearchHistory = common_vendor.computed(() => isSearchFocused.value && !searchKeyword.value);
    function getSearchHistoryStorageKey() {
      const session = common_services_auth.getCurrentSession();
      return `${SEARCH_HISTORY_KEY}_${(session == null ? void 0 : session.uid) || "anonymous"}`;
    }
    function loadSearchHistory() {
      try {
        const saved = common_vendor.index.getStorageSync(getSearchHistoryStorageKey());
        if (Array.isArray(saved)) {
          searchHistory.value = saved.slice(0, SEARCH_HISTORY_MAX);
        } else {
          searchHistory.value = [];
        }
      } catch (e) {
        searchHistory.value = [];
      }
    }
    function saveSearchHistoryToStorage() {
      try {
        common_vendor.index.setStorageSync(getSearchHistoryStorageKey(), searchHistory.value.slice(0, SEARCH_HISTORY_MAX));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:438", "saveSearchHistory failed", e);
      }
    }
    function pushSearchHistory(keyword) {
      const normalized = String(keyword || "").trim();
      if (!normalized)
        return;
      const next = [normalized, ...searchHistory.value.filter((item) => item !== normalized)];
      searchHistory.value = next.slice(0, SEARCH_HISTORY_MAX);
      saveSearchHistoryToStorage();
    }
    function clearSearchHistory() {
      searchHistory.value = [];
      try {
        common_vendor.index.removeStorageSync(getSearchHistoryStorageKey());
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:455", "clearSearchHistory failed", e);
      }
    }
    function applySearchKeyword(keyword) {
      searchKeyword.value = keyword;
      filterKeyword.value = keyword;
      isSearchFocused.value = false;
      pushSearchHistory(keyword);
    }
    function onSearchFocus() {
      loadSearchHistory();
      isSearchFocused.value = true;
    }
    let searchBlurTimer = null;
    function onSearchBlur() {
      searchBlurTimer = setTimeout(() => {
        isSearchFocused.value = false;
      }, 200);
    }
    function onSearchHistoryTouchStart() {
      if (searchBlurTimer)
        clearTimeout(searchBlurTimer);
    }
    const pageTitle = common_vendor.computed(() => scopeType.value === "family" ? "家庭衣橱" : "我的衣橱");
    const pageDesc = common_vendor.computed(
      () => scopeType.value === "family" ? "管理家庭共享的衣橱空间" : "管理你自己的衣橱与衣物"
    );
    const summaryData = common_vendor.computed(() => ({
      closetCount: String(closetCount.value),
      clothesCount: String(clothesCount.value),
      unassignedCount: String(unassignedCount.value)
    }));
    const swipeOptions = common_vendor.computed(() => SWIPE_OPTIONS);
    const roomOptions = common_vendor.computed(() => {
      const rooms = /* @__PURE__ */ new Set();
      closets.value.forEach((item) => {
        if (item.room_name)
          rooms.add(item.room_name);
      });
      return ["", ...Array.from(rooms).sort()];
    });
    const displayRoomOptions = common_vendor.computed(
      () => roomOptions.value.map((room) => room ? room : "全部房间")
    );
    const roomFilterText = common_vendor.computed(() => {
      if (roomOptions.value.length <= 1)
        return "暂无房间";
      return filterRoom.value || "全部房间";
    });
    const showClothesCountSortHint = common_vendor.computed(() => sortBy.value.includes("clothes_count"));
    const displayClosets = common_vendor.computed(() => {
      let result = closets.value;
      const room = filterRoom.value;
      if (room) {
        result = result.filter((item) => item.room_name === room);
      }
      const keyword = filterKeyword.value.trim().toLowerCase();
      if (keyword) {
        result = result.filter((item) => {
          const name = (item.name || "").toLowerCase();
          const roomName = (item.room_name || "").toLowerCase();
          return name.includes(keyword) || roomName.includes(keyword);
        });
      }
      const sort = sortBy.value;
      if (sort === "clothes_count_desc") {
        result = [...result].sort((a, b) => (b.clothes_count || 0) - (a.clothes_count || 0));
      } else if (sort === "clothes_count_asc") {
        result = [...result].sort((a, b) => (a.clothes_count || 0) - (b.clothes_count || 0));
      }
      return result;
    });
    function getSearchStorageKey() {
      const session = common_services_auth.getCurrentSession();
      return `closets_search_${(session == null ? void 0 : session.uid) || "anonymous"}`;
    }
    function restoreSwipeHintState() {
      try {
        showSwipeHint.value = !common_vendor.index.getStorageSync(SWIPE_HINT_KEY);
      } catch (e) {
        showSwipeHint.value = true;
      }
    }
    function closeSwipeHint() {
      showSwipeHint.value = false;
      try {
        common_vendor.index.setStorageSync(SWIPE_HINT_KEY, true);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:565", "closeSwipeHint save failed", e);
      }
    }
    function saveSearchState() {
      try {
        common_vendor.index.setStorageSync(getSearchStorageKey(), { keyword: searchKeyword.value });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:572", "saveSearchState failed", e);
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
        common_vendor.index.__f__("error", "at pages/closets/index.vue:582", "restoreSearchState failed", e);
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
      familyName.value = membership.hasFamily ? ((_b = membership.familyRecord) == null ? void 0 : _b.name) || "未命名家庭" : "";
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
      saveSearchState();
      loadClosets();
    }
    async function loadClosets(append = false) {
      loading.value = true;
      if (!append)
        error.value = false;
      const requestId = ++currentRequestId;
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      const hasCustomSort = sortBy.value !== "default";
      const hasRoomFilter = !!filterRoom.value;
      if (!append && uid && !hasCustomSort && !hasRoomFilter) {
        const cached = common_services_cacheService.getClosetListCache(uid, scope);
        const cachedSummary = common_services_cacheService.getHomeSummaryCache(uid, scope);
        if (cached == null ? void 0 : cached.list) {
          closets.value = cached.list;
          total.value = cached.total || 0;
          loading.value = false;
        }
        if (cachedSummary) {
          closetCount.value = cachedSummary.closetCount || 0;
          clothesCount.value = cachedSummary.clothesCount || 0;
          unassignedCount.value = cachedSummary.unassignedClothesCount || 0;
        }
      }
      try {
        await executeLoad(append, requestId);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:648", "loadClosets failed", err);
        if (requestId !== currentRequestId)
          return;
        if (!append && closets.value.length === 0) {
          error.value = true;
          total.value = 0;
        }
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || "衣橱列表加载失败", icon: "none" });
      } finally {
        if (requestId === currentRequestId)
          loading.value = false;
      }
    }
    async function executeLoad(append, requestId, attempt = 1) {
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const scope = scopeType.value;
      const hasCustomSort = sortBy.value !== "default";
      const hasRoomFilter = !!filterRoom.value;
      const payload = {
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        roomName: filterRoom.value
      };
      let result;
      try {
        if (append) {
          result = scope === "family" ? await common_api_modules_closet.getFamilyClosetList(payload) : await common_api_modules_closet.getPersonalClosetList(payload);
        } else {
          result = await common_api_modules_closet.getClosetListWithSummary({ ...payload, scopeType: scope });
        }
      } catch (err) {
        if (!append && attempt < 3 && requestId === currentRequestId) {
          const delay = Math.min(1e3 * Math.pow(2, attempt - 1), 4e3);
          await new Promise((resolve) => setTimeout(resolve, delay));
          if (requestId !== currentRequestId)
            return;
          return executeLoad(append, requestId, attempt + 1);
        }
        throw err;
      }
      if (requestId !== currentRequestId)
        return;
      if (!append) {
        const summary = result == null ? void 0 : result.summary;
        if (summary) {
          closetCount.value = summary.closetCount || 0;
          clothesCount.value = summary.clothesCount || 0;
          unassignedCount.value = summary.unassignedClothesCount || 0;
          if (uid)
            common_services_cacheService.setHomeSummaryCache(uid, scope, summary);
        }
      }
      const list = (result == null ? void 0 : result.list) || [];
      closets.value = append ? [...closets.value, ...list] : list;
      total.value = (result == null ? void 0 : result.total) || 0;
      if (!append && closets.value.length === 0) {
        isFirstEmpty.value = true;
      }
      if (!append && uid && !searchKeyword.value && !hasCustomSort && !hasRoomFilter && currentPage.value === 1) {
        common_services_cacheService.setClosetListCache(uid, scope, { list, total: total.value });
      }
    }
    function retryLoad() {
      currentPage.value = 1;
      loadClosets();
    }
    function goCreateCloset() {
      common_vendor.index.navigateTo({ url: scopeType.value === "family" ? `${common_constants_routes.ROUTES.closetCreate}?scopeType=family` : common_constants_routes.ROUTES.closetCreate });
    }
    function goCreateWithKeyword() {
      const keyword = encodeURIComponent(filterKeyword.value.trim());
      const scopeParam = scopeType.value === "family" ? "&scopeType=family" : "";
      common_vendor.index.navigateTo({ url: `${common_constants_routes.ROUTES.closetCreate}?name=${keyword}${scopeParam}` });
    }
    function onSearchInput(e) {
      searchKeyword.value = e.detail.value;
      if (searchTimer)
        clearTimeout(searchTimer);
      isSearching.value = true;
      if (searchBlurTimer)
        clearTimeout(searchBlurTimer);
      searchTimer = setTimeout(() => {
        filterKeyword.value = searchKeyword.value;
        isSearching.value = false;
        saveSearchState();
        pushSearchHistory(searchKeyword.value);
      }, 300);
    }
    function clearSearch() {
      searchKeyword.value = "";
      filterKeyword.value = "";
      isSearching.value = false;
      if (searchTimer)
        clearTimeout(searchTimer);
      saveSearchState();
    }
    function changeSort(value) {
      if (sortBy.value === value)
        return;
      sortBy.value = value;
      currentPage.value = 1;
      loadClosets();
    }
    function onRoomChange(e) {
      const index = Number(e.detail.value);
      const selected = roomOptions.value[index] || "";
      if (filterRoom.value === selected)
        return;
      filterRoom.value = selected;
      currentPage.value = 1;
      loadClosets();
    }
    function onSwipeClick(e, closet) {
      var _a;
      const action = (_a = e == null ? void 0 : e.content) == null ? void 0 : _a.text;
      if (action === "编辑") {
        common_vendor.index.navigateTo({ url: `${common_constants_routes.ROUTES.closetCreate}?closetId=${closet._id}` });
      } else if (action === "删除") {
        confirmDeleteCloset(closet);
      }
    }
    function confirmDeleteCloset(closet) {
      common_vendor.index.showModal({
        title: "删除衣橱",
        content: `确定删除「${closet.name || "未命名衣橱"}」吗？该衣橱下的衣物将变为未归类。`,
        confirmColor: "#c45c3e",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            common_vendor.index.showLoading({ title: "删除中" });
            await common_api_modules_closet.deleteCloset({ closetId: closet._id });
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: `已删除「${closet.name || "未命名衣橱"}」`, icon: "success", duration: 2e3 });
            currentPage.value = 1;
            loadClosets();
          } catch (err) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || "删除失败", icon: "none" });
          }
        }
      });
    }
    common_vendor.index.$on("closets:need-refresh", () => {
      needRefresh.value = true;
    });
    common_vendor.onPullDownRefresh(async () => {
      refreshing.value = true;
      currentPage.value = 1;
      await loadClosets();
      refreshing.value = false;
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      if (loading.value || closets.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClosets(true);
    });
    common_vendor.onLoad(() => {
      common_vendor.index.hideTabBar({ animation: false });
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
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
      restoreSwipeHintState();
      if (!hasInitialized.value) {
        restoreSearchState();
        currentPage.value = 1;
        loadClosets();
        hasInitialized.value = true;
      } else {
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
      if (searchBlurTimer)
        clearTimeout(searchBlurTimer);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M 0 60 Q 187 30 375 60",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        b: common_vendor.p({
          d: "M 0 140 Q 187 110 375 140",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          d: "M 0 220 Q 187 190 375 220",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          viewBox: "0 0 375 280",
          preserveAspectRatio: "none"
        }),
        e: common_vendor.t(pageTitle.value),
        f: common_vendor.t(pageDesc.value),
        g: common_vendor.t(summaryData.value.closetCount),
        h: common_vendor.t(summaryData.value.clothesCount),
        i: common_vendor.t(summaryData.value.unassignedCount),
        j: statusBarHeight.value + 20 + "px",
        k: refreshing.value
      }, refreshing.value ? {} : {}, {
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
        p: common_vendor.o(onSearchInput, "ef"),
        q: common_vendor.o(onSearchFocus, "26"),
        r: common_vendor.o(onSearchBlur, "76"),
        s: isSearching.value
      }, isSearching.value ? {} : searchKeyword.value ? {
        v: common_vendor.p({
          x1: "18",
          y1: "6",
          x2: "6",
          y2: "18"
        }),
        w: common_vendor.p({
          x1: "6",
          y1: "6",
          x2: "18",
          y2: "18"
        }),
        x: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        y: common_vendor.o(clearSearch, "fb")
      } : {}, {
        t: searchKeyword.value,
        z: showSearchHistory.value
      }, showSearchHistory.value ? common_vendor.e({
        A: common_vendor.f(HOT_SEARCH_KEYWORDS, (item, index, i0) => {
          return {
            a: "13ffa884-11-" + i0 + "," + ("13ffa884-10-" + i0),
            b: "13ffa884-10-" + i0,
            c: common_vendor.t(item),
            d: `hot-${index}`,
            e: common_vendor.o(($event) => applySearchKeyword(item), `hot-${index}`)
          };
        }),
        B: common_vendor.p({
          d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z"
        }),
        C: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        D: searchHistory.value.length > 0
      }, searchHistory.value.length > 0 ? {
        E: common_vendor.p({
          points: "3 6 5 6 21 6"
        }),
        F: common_vendor.p({
          d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        }),
        G: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        H: common_vendor.o(clearSearchHistory, "20"),
        I: common_vendor.f(searchHistory.value, (item, index, i0) => {
          return {
            a: "13ffa884-16-" + i0 + "," + ("13ffa884-15-" + i0),
            b: "13ffa884-17-" + i0 + "," + ("13ffa884-15-" + i0),
            c: "13ffa884-15-" + i0,
            d: common_vendor.t(item),
            e: `recent-${index}`,
            f: common_vendor.o(($event) => applySearchKeyword(item), `recent-${index}`)
          };
        }),
        J: common_vendor.p({
          cx: "11",
          cy: "11",
          r: "8"
        }),
        K: common_vendor.p({
          x1: "21",
          y1: "21",
          x2: "16.65",
          y2: "16.65"
        }),
        L: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      } : {}, {
        M: common_vendor.o(onSearchHistoryTouchStart, "07")
      }) : {}, {
        N: common_vendor.f(SORT_OPTIONS, (option, k0, i0) => {
          return {
            a: common_vendor.t(option.label),
            b: option.value,
            c: sortBy.value === option.value ? 1 : "",
            d: common_vendor.o(($event) => changeSort(option.value), option.value)
          };
        }),
        O: common_vendor.t(roomFilterText.value),
        P: common_vendor.p({
          points: "6 9 12 15 18 9"
        }),
        Q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        R: roomOptions.value.length <= 1 ? 1 : "",
        S: displayRoomOptions.value,
        T: roomOptions.value.indexOf(filterRoom.value),
        U: roomOptions.value.length <= 1,
        V: common_vendor.o(onRoomChange, "cf"),
        W: showClothesCountSortHint.value
      }, showClothesCountSortHint.value ? {
        X: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        Y: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12",
          y2: "12"
        }),
        Z: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12.01",
          y2: "8"
        }),
        aa: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      } : {}, {
        ab: hasFamily.value
      }, hasFamily.value ? common_vendor.e({
        ac: common_vendor.p({
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        ad: common_vendor.p({
          cx: "12",
          cy: "7",
          r: "4"
        }),
        ae: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        af: scopeType.value === "personal" ? 1 : "",
        ag: common_vendor.o(($event) => changeScope("personal"), "11"),
        ah: hasFamily.value
      }, hasFamily.value ? {
        ai: common_vendor.p({
          d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        }),
        aj: common_vendor.p({
          cx: "9",
          cy: "7",
          r: "4"
        }),
        ak: common_vendor.p({
          d: "M23 21v-2a4 4 0 0 0-3-3.87"
        }),
        al: common_vendor.p({
          d: "M16 3.13a4 4 0 0 1 0 7.75"
        }),
        am: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        an: common_vendor.t(familyName.value),
        ao: scopeType.value === "family" ? 1 : "",
        ap: common_vendor.o(($event) => changeScope("family"), "03")
      } : {}) : {}, {
        aq: loading.value && closets.value.length === 0
      }, loading.value && closets.value.length === 0 ? {
        ar: common_vendor.f(3, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : error.value ? {
        at: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        av: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        aw: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        ax: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ay: common_vendor.p({
          points: "23 4 23 10 17 10"
        }),
        az: common_vendor.p({
          d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
        }),
        aA: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aB: common_vendor.o(retryLoad, "6f")
      } : closets.value.length === 0 ? {
        aD: common_vendor.o(goCreateCloset, "75"),
        aE: common_vendor.p({
          ["scope-type"]: scopeType.value,
          ["can-create"]: allowCreate.value,
          ["is-first-time"]: isFirstEmpty.value
        })
      } : displayClosets.value.length === 0 ? common_vendor.e({
        aG: common_vendor.p({
          cx: "11",
          cy: "11",
          r: "8"
        }),
        aH: common_vendor.p({
          x1: "21",
          y1: "21",
          x2: "16.65",
          y2: "16.65"
        }),
        aI: common_vendor.p({
          x1: "8",
          y1: "11",
          x2: "14",
          y2: "11"
        }),
        aJ: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aK: common_vendor.t(filterKeyword.value),
        aL: common_vendor.o(clearSearch, "ed"),
        aM: allowCreate.value
      }, allowCreate.value ? {
        aN: common_vendor.o(goCreateWithKeyword, "a2")
      } : {}) : common_vendor.e({
        aO: showSwipeHint.value && displayClosets.value.length > 0
      }, showSwipeHint.value && displayClosets.value.length > 0 ? {
        aP: common_vendor.p({
          d: "M17 8l4 4-4 4"
        }),
        aQ: common_vendor.p({
          d: "M3 12h18"
        }),
        aR: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aS: common_vendor.p({
          x1: "18",
          y1: "6",
          x2: "6",
          y2: "18"
        }),
        aT: common_vendor.p({
          x1: "6",
          y1: "6",
          x2: "18",
          y2: "18"
        }),
        aU: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aV: common_vendor.o(closeSwipeHint, "0c")
      } : {}, {
        aW: common_vendor.f(displayClosets.value, (item, k0, i0) => {
          return {
            a: "13ffa884-52-" + i0 + "," + ("13ffa884-51-" + i0),
            b: common_vendor.p({
              closet: item
            }),
            c: item._id,
            d: common_vendor.o(($event) => onSwipeClick($event, item), item._id),
            e: "13ffa884-51-" + i0 + ",13ffa884-50"
          };
        }),
        aX: common_vendor.p({
          ["right-options"]: swipeOptions.value,
          ["auto-close"]: true
        }),
        aY: allowCreate.value && !filterKeyword.value
      }, allowCreate.value && !filterKeyword.value ? {
        aZ: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        ba: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        bb: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        bc: common_vendor.o(goCreateCloset, "7c")
      } : {}, {
        bd: showLoadProgress.value
      }, showLoadProgress.value ? {
        be: loadProgressPercent.value + "%",
        bf: common_vendor.t(loadProgressText.value)
      } : {}, {
        bg: loading.value && closets.value.length > 0
      }, loading.value && closets.value.length > 0 ? {} : {}, {
        bh: closets.value.length > 0 && !filterKeyword.value
      }, closets.value.length > 0 && !filterKeyword.value ? {
        bi: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}), {
        as: error.value,
        aC: closets.value.length === 0,
        aF: displayClosets.value.length === 0,
        bj: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).closets
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13ffa884"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closets/index.js.map
