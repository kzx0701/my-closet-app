"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_services_auth = require("../../common/services/auth.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_services_cacheService = require("../../common/services/cache-service.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _component_rect = common_vendor.resolveComponent("rect");
  (_component_path + _component_svg + _component_line + _component_circle + _component_polyline + _component_rect)();
}
if (!Math) {
  (ClothesListCard + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ClothesListCard = () => "../clothes/components/ClothesListCard.js";
const MAX_DISPLAY_MEMBERS = 4;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const nickname = common_vendor.ref("");
    const isFamilyMode = common_vendor.ref(false);
    const familyRecord = common_vendor.ref(null);
    const membershipRecord = common_vendor.ref(null);
    const familyMembers = common_vendor.ref([]);
    const closetCount = common_vendor.ref(0);
    const clothesCount = common_vendor.ref(0);
    const unassignedCount = common_vendor.ref(0);
    const familyClosetCount = common_vendor.ref(0);
    const familyClothesCount = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const loadError = common_vendor.ref(false);
    const summaryError = common_vendor.ref(false);
    const clothesError = common_vendor.ref(false);
    const familyError = common_vendor.ref(false);
    const isDegraded = common_vendor.ref(false);
    const isGuest = common_vendor.ref(false);
    const clothesList = common_vendor.ref([]);
    const clothesLoading = common_vendor.ref(false);
    const scrollY = common_vendor.ref(0);
    const windowHeight = common_vendor.ref(812);
    const statusBarHeight = common_vendor.ref(44);
    const isAnimating = common_vendor.ref(false);
    let touchStartY = 0;
    let touchStartTime = 0;
    const sectionsVisible = common_vendor.ref({
      stats: false,
      distribution: false,
      recent: false,
      actions: false,
      family: false,
      season: false
    });
    const DISTRIBUTION_CATEGORIES = [
      { code: "top", name: "上装", enName: "Top" },
      { code: "bottom", name: "下装", enName: "Bottom" },
      { code: "outerwear", name: "外套", enName: "Outerwear" },
      { code: "shoes", name: "鞋子", enName: "Shoes" },
      { code: "accessory", name: "配饰", enName: "Accessory" }
    ];
    const fontsLoaded = common_vendor.ref(false);
    function loadCustomFont(family, source) {
      return new Promise((resolve) => {
        common_vendor.index.loadFontFace({
          family,
          source,
          global: false,
          success() {
            resolve(true);
          },
          fail() {
            resolve(false);
          }
        });
      });
    }
    async function loadCustomFonts() {
      if (fontsLoaded.value)
        return;
      await Promise.all([
        loadCustomFont("Fraunces", 'url("https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.ttf")'),
        loadCustomFont("Manrope", 'url("https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-400-normal.ttf")'),
        loadCustomFont("JetBrains Mono", 'url("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf")')
      ]);
      fontsLoaded.value = true;
    }
    const heroScreenStyle = common_vendor.computed(() => {
      const progress = Math.min(scrollY.value / windowHeight.value, 1);
      return {
        opacity: `${1 - progress * 0.85}`
      };
    });
    const heroBgStyle = common_vendor.computed(() => ({
      transform: `translateY(${scrollY.value * 0.4}px) scale(${1 + scrollY.value * 5e-4})`
    }));
    const heroDecoStyle = common_vendor.computed(() => ({
      transform: `translateY(${scrollY.value * 0.2}px)`,
      opacity: Math.max(0, 1 - scrollY.value / 500)
    }));
    const heroTopbarStyle = common_vendor.computed(() => ({
      opacity: Math.max(0, 1 - scrollY.value / 200),
      transform: `translateY(${-scrollY.value * 0.15}px)`
    }));
    const heroContentStyle = common_vendor.computed(() => ({
      transform: `translate(-50%, calc(-50% + ${-scrollY.value * 0.25}px))`,
      opacity: Math.max(0, 1 - scrollY.value / 500)
    }));
    const scrollHintStyle = common_vendor.computed(() => ({
      opacity: Math.max(0, 1 - scrollY.value / 150),
      transform: `translateX(-50%) translateY(${-scrollY.value * 0.1}px)`
    }));
    const greetingText = common_vendor.computed(() => {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour < 6)
        return "夜深了";
      if (hour < 12)
        return "早上好";
      if (hour < 18)
        return "下午好";
      return "晚上好";
    });
    const currentSeason = common_vendor.computed(() => {
      const month = (/* @__PURE__ */ new Date()).getMonth() + 1;
      if (month >= 3 && month <= 5)
        return "spring";
      if (month >= 6 && month <= 8)
        return "summer";
      if (month >= 9 && month <= 11)
        return "autumn";
      return "winter";
    });
    const seasonLabel = common_vendor.computed(() => {
      const labels = {
        spring: "Spring · 春日提示",
        summer: "Summer · 夏日提示",
        autumn: "Autumn · 秋日提示",
        winter: "Winter · 冬日提示"
      };
      return labels[currentSeason.value];
    });
    const seasonTipText = common_vendor.computed(() => {
      const tips = {
        spring: "「春天来了，整理一下薄外套，把厚冬装收起来吧。」",
        summer: "「夏天到了，检查一下透气凉爽的衣物是否齐全。」",
        autumn: "「入秋了，把薄外套翻出来，检查去年的冬装是否还能穿。」",
        winter: "「冬天来了，检查冬装是否齐全，别等降温了再翻箱倒柜。」"
      };
      return tips[currentSeason.value];
    });
    const summaryData = common_vendor.computed(() => ({
      closetCount: String(closetCount.value),
      clothesCount: String(clothesCount.value),
      unassignedCount: String(unassignedCount.value)
    }));
    const distributionData = common_vendor.computed(() => {
      const counts = {};
      DISTRIBUTION_CATEGORIES.forEach((cat) => {
        counts[cat.code] = 0;
      });
      clothesList.value.forEach((item) => {
        if (counts[item.category] !== void 0) {
          counts[item.category]++;
        }
      });
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const max = Math.max(...Object.values(counts), 1);
      return DISTRIBUTION_CATEGORIES.map((cat) => ({
        ...cat,
        count: counts[cat.code],
        percent: total > 0 ? Math.round(counts[cat.code] / total * 100) : 0,
        barWidth: max > 0 ? counts[cat.code] / max * 100 : 0
      }));
    });
    const distributionTotal = common_vendor.computed(
      () => distributionData.value.reduce((sum, item) => sum + item.count, 0)
    );
    const recentClothes = common_vendor.computed(() => clothesList.value.slice(0, 6));
    const familySummaryData = common_vendor.computed(() => ({
      closetCount: String(familyClosetCount.value),
      clothesCount: String(familyClothesCount.value)
    }));
    const displayMembers = common_vendor.computed(() => familyMembers.value.slice(0, MAX_DISPLAY_MEMBERS));
    const extraMemberCount = common_vendor.computed(() => Math.max(0, familyMembers.value.length - MAX_DISPLAY_MEMBERS));
    function getAvatarText(name) {
      if (!name)
        return "?";
      const trimmed = name.trim();
      return trimmed.charAt(0).toUpperCase();
    }
    async function syncClosetSummary() {
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const cached = uid ? common_services_cacheService.getHomeSummaryCache(uid, "personal") : null;
      if (cached) {
        closetCount.value = cached.closetCount || 0;
        clothesCount.value = cached.clothesCount || 0;
        unassignedCount.value = cached.unassignedClothesCount || 0;
        loading.value = false;
      } else {
        loading.value = true;
      }
      summaryError.value = false;
      try {
        const summary = await common_api_modules_closet.getHomeSummary({ scopeType: "personal" });
        closetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
        clothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
        unassignedCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
        if (uid && summary) {
          common_services_cacheService.setHomeSummaryCache(uid, "personal", summary);
        }
        loadError.value = false;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/index.vue:621", "syncClosetSummary failed", error);
        if (!cached) {
          closetCount.value = 0;
          clothesCount.value = 0;
          unassignedCount.value = 0;
        }
        summaryError.value = true;
        loadError.value = !cached;
      } finally {
        loading.value = false;
      }
    }
    function retryLoad() {
      syncClosetSummary();
      loadClothesForHome();
    }
    async function loadClothesForHome() {
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const cached = uid ? common_services_cacheService.getHomeClothesCache(uid) : null;
      if (cached && Array.isArray(cached)) {
        clothesList.value = cached;
        clothesLoading.value = false;
      } else {
        clothesLoading.value = true;
      }
      clothesError.value = false;
      try {
        const result = await common_api_modules_clothes.getPersonalClothesList({ page: 1, pageSize: 100 });
        const list = (result == null ? void 0 : result.list) || [];
        clothesList.value = list;
        if (uid && list.length > 0) {
          common_services_cacheService.setHomeClothesCache(uid, list);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/index.vue:662", "loadClothesForHome failed", error);
        if (!cached) {
          clothesList.value = [];
        }
        clothesError.value = true;
      } finally {
        clothesLoading.value = false;
      }
    }
    async function syncFamilySummary() {
      if (!isFamilyMode.value) {
        familyClosetCount.value = 0;
        familyClothesCount.value = 0;
        return;
      }
      const session = common_services_auth.getCurrentSession();
      const uid = session == null ? void 0 : session.uid;
      const cached = uid ? common_services_cacheService.getHomeSummaryCache(uid, "family") : null;
      if (cached) {
        familyClosetCount.value = cached.closetCount || 0;
        familyClothesCount.value = cached.clothesCount || 0;
      }
      try {
        const summary = await common_api_modules_closet.getHomeSummary({ scopeType: "family" });
        familyClosetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
        familyClothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
        if (uid && summary) {
          common_services_cacheService.setHomeSummaryCache(uid, "family", summary);
        }
        familyError.value = false;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/index.vue:698", "syncFamilySummary failed", error);
        if (!cached) {
          familyClosetCount.value = 0;
          familyClothesCount.value = 0;
        }
        familyError.value = true;
      }
    }
    async function syncScopeStatus() {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin) {
        isGuest.value = true;
        nickname.value = "游客";
        loading.value = false;
        clothesLoading.value = false;
        return;
      }
      isGuest.value = false;
      const uid = session.uid;
      const cachedUserInfo = common_services_cacheService.getUserInfoCache(uid);
      if (cachedUserInfo) {
        nickname.value = cachedUserInfo.nickname || cachedUserInfo.username || "用户";
      }
      try {
        const info = await common_api_modules_auth.getCurrentUserInfo(uid);
        if (info) {
          nickname.value = info.nickname || info.username || "用户";
          common_services_cacheService.setUserInfoCache(uid, info);
        }
      } catch (e) {
        if (!cachedUserInfo)
          nickname.value = "用户";
      }
      const membership = await common_services_familyMembership.getFamilyMembership(uid);
      if (membership.status !== "success") {
        isDegraded.value = true;
        const cachedFamily = common_services_cacheService.getFamilyInfoCache(uid);
        if (cachedFamily) {
          familyRecord.value = cachedFamily.familyRecord || null;
          membershipRecord.value = cachedFamily.membershipRecord || null;
          isFamilyMode.value = cachedFamily.hasFamily || false;
          familyMembers.value = cachedFamily.members || [];
        }
        await syncClosetSummary();
        loadClothesForHome();
        if (isFamilyMode.value) {
          syncFamilySummary();
        }
        return;
      }
      isDegraded.value = false;
      familyRecord.value = membership.familyRecord || null;
      membershipRecord.value = membership.membershipRecord || null;
      if (membership.hasFamily) {
        common_services_cacheService.setFamilyInfoCache(uid, {
          hasFamily: true,
          familyRecord: membership.familyRecord,
          membershipRecord: membership.membershipRecord
        });
      }
      if (membership.hasFamily) {
        isFamilyMode.value = true;
        try {
          const membersRes = await common_api_modules_family.getFamilyMembers();
          familyMembers.value = (membersRes == null ? void 0 : membersRes.members) || [];
          common_services_cacheService.setFamilyInfoCache(uid, {
            hasFamily: true,
            familyRecord: membership.familyRecord,
            membershipRecord: membership.membershipRecord,
            members: familyMembers.value
          });
        } catch (error) {
          familyMembers.value = [];
        }
        await syncFamilySummary();
      } else {
        isFamilyMode.value = false;
        familyMembers.value = [];
        familyClosetCount.value = 0;
        familyClothesCount.value = 0;
      }
      await syncClosetSummary();
      loadClothesForHome();
    }
    function requireLogin(actionName) {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin) {
        common_vendor.index.showToast({
          title: actionName ? `请先登录后再${actionName}` : "请先登录",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.login });
        }, 800);
        return false;
      }
      return true;
    }
    function goLogin() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.login });
    }
    function goClosets() {
      if (!requireLogin("查看衣橱"))
        return;
      const session = common_services_auth.getCurrentSession();
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, "personal");
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.closets });
    }
    function goFamilyClosets() {
      if (!requireLogin("查看家庭衣橱"))
        return;
      const session = common_services_auth.getCurrentSession();
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, "family");
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.closets });
    }
    function goFamilyClothes() {
      if (!requireLogin("查看家庭衣物"))
        return;
      const session = common_services_auth.getCurrentSession();
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, "family");
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.clothes });
    }
    function goClothes() {
      if (!requireLogin("查看衣物"))
        return;
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.clothes });
    }
    function goCreateClothes() {
      if (!requireLogin("添加衣物"))
        return;
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.clothesCreate });
    }
    function goCreateFamily() {
      if (!requireLogin("创建家庭"))
        return;
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyCreate });
    }
    function goJoinFamily() {
      if (!requireLogin("加入家庭"))
        return;
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
    }
    function goFamilyManage() {
      if (!requireLogin("管理家庭"))
        return;
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.profile });
    }
    function onTouchStart(e) {
      if (isAnimating.value) {
        isAnimating.value = false;
      }
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
    function onTouchEnd(e) {
      if (isAnimating.value)
        return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const duration = Date.now() - touchStartTime;
      const wh = windowHeight.value;
      const currentScroll = scrollY.value;
      if (currentScroll >= wh * 1.3)
        return;
      const isSwipe = Math.abs(deltaY) > 40 || duration < 300 && Math.abs(deltaY) > 15;
      let target = currentScroll;
      if (isSwipe) {
        target = deltaY > 0 ? wh : 0;
      } else {
        target = currentScroll > wh * 0.5 ? wh : 0;
      }
      if (Math.abs(target - currentScroll) > 5) {
        snapTo(target);
      }
    }
    function snapTo(target) {
      if (isAnimating.value)
        return;
      isAnimating.value = true;
      const startScroll = scrollY.value;
      const distance = target - startScroll;
      const startTime = Date.now();
      const wh = windowHeight.value;
      const duration = Math.min(800, Math.max(500, Math.abs(distance) / wh * 800));
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }
      function step() {
        if (!isAnimating.value)
          return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const currentScroll = startScroll + distance * eased;
        scrollY.value = currentScroll;
        common_vendor.index.pageScrollTo({
          scrollTop: currentScroll,
          duration: 0
        });
        if (progress < 1) {
          setTimeout(step, 16);
        } else {
          scrollY.value = target;
          common_vendor.index.pageScrollTo({
            scrollTop: target,
            duration: 0
          });
          isAnimating.value = false;
        }
      }
      step();
    }
    common_vendor.onLoad(() => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        windowHeight.value = sysInfo.windowHeight || 812;
        statusBarHeight.value = sysInfo.statusBarHeight || 44;
      } catch (e) {
        windowHeight.value = 812;
        statusBarHeight.value = 44;
      }
    });
    common_vendor.onPageScroll((e) => {
      if (!isAnimating.value) {
        scrollY.value = e.scrollTop;
      }
      const wh = windowHeight.value;
      const triggers = {
        stats: wh * 0.3,
        distribution: wh * 0.5,
        recent: wh * 0.7,
        actions: wh * 0.85,
        family: wh * 1,
        season: wh * 1.15
      };
      Object.keys(triggers).forEach((key) => {
        if (e.scrollTop > triggers[key] && !sectionsVisible.value[key]) {
          sectionsVisible.value[key] = true;
        }
      });
    });
    common_vendor.onShow(() => {
      loadCustomFonts();
      syncScopeStatus();
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.s(heroBgStyle.value),
        c: common_vendor.p({
          d: "M 0 180 Q 187 120 375 180",
          fill: "none",
          stroke: "rgba(244,239,230,0.06)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          d: "M 0 240 Q 187 180 375 240",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        e: common_vendor.p({
          d: "M 0 600 Q 187 540 375 600",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        f: common_vendor.p({
          d: "M 0 660 Q 187 600 375 660",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        g: common_vendor.p({
          viewBox: "0 0 375 812",
          preserveAspectRatio: "none"
        }),
        h: common_vendor.s(heroDecoStyle.value),
        i: common_vendor.s(heroTopbarStyle.value),
        j: common_vendor.s({
          paddingTop: statusBarHeight.value + 20 + "px"
        }),
        k: common_vendor.s(heroContentStyle.value),
        l: common_vendor.s(scrollHintStyle.value),
        m: common_vendor.s(heroScreenStyle.value),
        n: isDegraded.value
      }, isDegraded.value ? {
        o: common_vendor.p({
          d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        }),
        p: common_vendor.p({
          x1: "12",
          y1: "9",
          x2: "12",
          y2: "13"
        }),
        q: common_vendor.p({
          x1: "12",
          y1: "17",
          x2: "12.01",
          y2: "17"
        }),
        r: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      } : {}, {
        s: isGuest.value
      }, isGuest.value ? {
        t: common_vendor.p({
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        v: common_vendor.p({
          cx: "12",
          cy: "7",
          r: "4"
        }),
        w: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        x: common_vendor.o(goLogin, "a8")
      } : {}, {
        y: common_vendor.t(greetingText.value),
        z: common_vendor.t(nickname.value),
        A: loading.value
      }, loading.value ? {} : loadError.value ? {
        C: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        D: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        E: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        F: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        G: common_vendor.o(retryLoad, "9e")
      } : {
        H: common_vendor.t(summaryData.value.closetCount),
        I: common_vendor.o(goClosets, "c6"),
        J: common_vendor.t(summaryData.value.clothesCount),
        K: common_vendor.o(goClothes, "ab"),
        L: common_vendor.t(summaryData.value.unassignedCount)
      }, {
        B: loadError.value,
        M: !loading.value && !loadError.value && unassignedCount.value > 0
      }, !loading.value && !loadError.value && unassignedCount.value > 0 ? {
        N: common_vendor.p({
          d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        }),
        O: common_vendor.p({
          points: "3.27 6.96 12 12.01 20.73 6.96"
        }),
        P: common_vendor.p({
          x1: "12",
          y1: "22.08",
          x2: "12",
          y2: "12"
        }),
        Q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        R: common_vendor.t(unassignedCount.value),
        S: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        T: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        U: common_vendor.o(goClothes, "13")
      } : {}, {
        V: sectionsVisible.value.stats ? 1 : "",
        W: clothesLoading.value
      }, clothesLoading.value ? {
        X: common_vendor.f(5, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : distributionTotal.value === 0 ? {} : {
        Z: common_vendor.f(distributionData.value, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.enName),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.count),
            d: common_vendor.t(item.percent),
            e: common_vendor.n("bar-" + item.code),
            f: item.barWidth + "%",
            g: item.code,
            h: 0.1 + idx * 0.06 + "s"
          };
        })
      }, {
        Y: distributionTotal.value === 0,
        aa: sectionsVisible.value.distribution ? 1 : "",
        ab: recentClothes.value.length > 0
      }, recentClothes.value.length > 0 ? {
        ac: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        ad: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ae: common_vendor.o(goClothes, "d8")
      } : {}, {
        af: !clothesLoading.value && recentClothes.value.length === 0
      }, !clothesLoading.value && recentClothes.value.length === 0 ? {
        ag: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        ah: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        ai: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aj: common_vendor.o(goCreateClothes, "65")
      } : common_vendor.e({
        ak: clothesLoading.value
      }, clothesLoading.value ? {
        al: common_vendor.f(4, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : {
        am: common_vendor.f(recentClothes.value, (item, k0, i0) => {
          return {
            a: "4978fed5-27-" + i0,
            b: common_vendor.p({
              clothes: item
            }),
            c: item._id
          };
        })
      }), {
        an: sectionsVisible.value.recent ? 1 : "",
        ao: common_vendor.t(summaryData.value.closetCount),
        ap: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        aq: common_vendor.p({
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12"
        }),
        ar: common_vendor.p({
          x1: "12",
          y1: "3",
          x2: "12",
          y2: "21"
        }),
        as: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        at: common_vendor.p({
          d: "M7 17L17 7M17 7H8M17 7v9"
        }),
        av: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aw: common_vendor.o(goClosets, "1b"),
        ax: common_vendor.t(summaryData.value.clothesCount),
        ay: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        az: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aA: common_vendor.p({
          d: "M7 17L17 7M17 7H8M17 7v9"
        }),
        aB: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aC: common_vendor.o(goClothes, "6a"),
        aD: sectionsVisible.value.actions ? 1 : "",
        aE: isFamilyMode.value
      }, isFamilyMode.value ? common_vendor.e({
        aF: common_vendor.t(((_a = familyRecord.value) == null ? void 0 : _a.name) || "未命名家庭"),
        aG: common_vendor.t(((_b = membershipRecord.value) == null ? void 0 : _b.role) === "admin" ? "Admin" : "Member"),
        aH: common_vendor.t(familySummaryData.value.closetCount),
        aI: common_vendor.o(goFamilyClosets, "1e"),
        aJ: common_vendor.t(familySummaryData.value.clothesCount),
        aK: common_vendor.o(goFamilyClothes, "28"),
        aL: common_vendor.f(displayMembers.value, (member, k0, i0) => {
          return {
            a: common_vendor.t(getAvatarText(member.nickname || member.username)),
            b: member.role === "admin" ? 1 : "",
            c: member.user_id
          };
        }),
        aM: extraMemberCount.value > 0
      }, extraMemberCount.value > 0 ? {
        aN: common_vendor.t(extraMemberCount.value)
      } : {}, {
        aO: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        aP: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aQ: common_vendor.o(goFamilyManage, "bd")
      }) : {
        aR: common_vendor.o(goCreateFamily, "d8"),
        aS: common_vendor.o(goJoinFamily, "64")
      }, {
        aT: sectionsVisible.value.family ? 1 : "",
        aU: common_vendor.t(seasonLabel.value),
        aV: common_vendor.t(seasonTipText.value),
        aW: sectionsVisible.value.season ? 1 : "",
        aX: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).home
        }),
        aY: common_vendor.o(onTouchStart, "4e"),
        aZ: common_vendor.o(onTouchEnd, "14")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
