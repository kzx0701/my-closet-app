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
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  (_component_path + _component_svg + _component_line + _component_circle + _component_rect + _component_polyline)();
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
    const hasInitialized = common_vendor.ref(false);
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
        common_vendor.index.__f__("error", "at pages/home/index.vue:681", "syncClosetSummary failed", error);
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
        common_vendor.index.__f__("error", "at pages/home/index.vue:722", "loadClothesForHome failed", error);
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
        common_vendor.index.__f__("error", "at pages/home/index.vue:758", "syncFamilySummary failed", error);
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
      common_vendor.index.hideTabBar({ animation: false });
    });
    let scrollThrottleTimer = null;
    let pendingScrollTop = 0;
    common_vendor.onPageScroll((e) => {
      pendingScrollTop = e.scrollTop;
      if (!scrollThrottleTimer) {
        scrollThrottleTimer = setTimeout(() => {
          scrollThrottleTimer = null;
          if (!isAnimating.value) {
            scrollY.value = pendingScrollTop;
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
            if (pendingScrollTop > triggers[key] && !sectionsVisible.value[key]) {
              sectionsVisible.value[key] = true;
            }
          });
        }, 50);
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar({ animation: false });
      loadCustomFonts();
      if (!hasInitialized.value) {
        hasInitialized.value = true;
        syncScopeStatus();
      }
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
        y: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "5"
        }),
        z: common_vendor.p({
          d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        }),
        A: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        B: common_vendor.t(greetingText.value),
        C: common_vendor.t(nickname.value),
        D: common_vendor.p({
          cx: "260",
          cy: "20",
          r: "60",
          fill: "rgba(255,255,255,0.04)"
        }),
        E: common_vendor.p({
          cx: "280",
          cy: "80",
          r: "40",
          fill: "rgba(255,255,255,0.03)"
        }),
        F: common_vendor.p({
          cx: "30",
          cy: "100",
          r: "30",
          fill: "rgba(255,255,255,0.02)"
        }),
        G: common_vendor.p({
          viewBox: "0 0 300 120"
        }),
        H: loading.value
      }, loading.value ? {} : loadError.value ? {
        J: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        K: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        L: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        M: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        N: common_vendor.o(retryLoad, "68")
      } : {
        O: common_vendor.t(summaryData.value.closetCount),
        P: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        Q: common_vendor.p({
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12"
        }),
        R: common_vendor.p({
          x1: "12",
          y1: "3",
          x2: "12",
          y2: "21"
        }),
        S: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        T: common_vendor.o(goClosets, "e0"),
        U: common_vendor.t(summaryData.value.clothesCount),
        V: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        W: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        X: common_vendor.o(goClothes, "a5"),
        Y: common_vendor.t(summaryData.value.unassignedCount),
        Z: common_vendor.p({
          d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        }),
        aa: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      }, {
        I: loadError.value,
        ab: statusBarHeight.value + 24 + "px",
        ac: !loading.value && !loadError.value && unassignedCount.value > 0
      }, !loading.value && !loadError.value && unassignedCount.value > 0 ? {
        ad: common_vendor.p({
          d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        }),
        ae: common_vendor.p({
          points: "3.27 6.96 12 12.01 20.73 6.96"
        }),
        af: common_vendor.p({
          x1: "12",
          y1: "22.08",
          x2: "12",
          y2: "12"
        }),
        ag: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ah: common_vendor.t(unassignedCount.value),
        ai: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        aj: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ak: common_vendor.o(goClothes, "1a")
      } : {}, {
        al: sectionsVisible.value.stats ? 1 : "",
        am: clothesLoading.value
      }, clothesLoading.value ? {
        an: common_vendor.f(5, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : distributionTotal.value === 0 ? {} : {
        ap: common_vendor.f(distributionData.value, (item, idx, i0) => {
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
        ao: distributionTotal.value === 0,
        aq: sectionsVisible.value.distribution ? 1 : "",
        ar: recentClothes.value.length > 0
      }, recentClothes.value.length > 0 ? {
        as: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        at: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        av: common_vendor.o(goClothes, "51")
      } : {}, {
        aw: !clothesLoading.value && recentClothes.value.length === 0
      }, !clothesLoading.value && recentClothes.value.length === 0 ? {
        ax: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        ay: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        az: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aA: common_vendor.o(goCreateClothes, "02")
      } : common_vendor.e({
        aB: clothesLoading.value
      }, clothesLoading.value ? {
        aC: common_vendor.f(4, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : {
        aD: common_vendor.f(recentClothes.value, (item, k0, i0) => {
          return {
            a: "4978fed5-42-" + i0,
            b: common_vendor.p({
              clothes: item
            }),
            c: item._id
          };
        })
      }), {
        aE: sectionsVisible.value.recent ? 1 : "",
        aF: common_vendor.p({
          x1: "0",
          y1: "0",
          x2: "200",
          y2: "200",
          stroke: "rgba(255,255,255,0.04)",
          ["stroke-width"]: "1"
        }),
        aG: common_vendor.p({
          x1: "60",
          y1: "0",
          x2: "200",
          y2: "140",
          stroke: "rgba(255,255,255,0.03)",
          ["stroke-width"]: "1"
        }),
        aH: common_vendor.p({
          x1: "120",
          y1: "0",
          x2: "200",
          y2: "80",
          stroke: "rgba(255,255,255,0.02)",
          ["stroke-width"]: "1"
        }),
        aI: common_vendor.p({
          x1: "0",
          y1: "60",
          x2: "140",
          y2: "200",
          stroke: "rgba(255,255,255,0.03)",
          ["stroke-width"]: "1"
        }),
        aJ: common_vendor.p({
          x1: "0",
          y1: "120",
          x2: "80",
          y2: "200",
          stroke: "rgba(255,255,255,0.02)",
          ["stroke-width"]: "1"
        }),
        aK: common_vendor.p({
          viewBox: "0 0 200 200"
        }),
        aL: common_vendor.t(summaryData.value.closetCount),
        aM: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        aN: common_vendor.p({
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12"
        }),
        aO: common_vendor.p({
          x1: "12",
          y1: "3",
          x2: "12",
          y2: "21"
        }),
        aP: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aQ: common_vendor.p({
          d: "M7 17L17 7M17 7H8M17 7v9"
        }),
        aR: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aS: common_vendor.o(goClosets, "d8"),
        aT: common_vendor.p({
          cx: "160",
          cy: "40",
          r: "50",
          fill: "rgba(184,92,58,0.04)"
        }),
        aU: common_vendor.p({
          cx: "180",
          cy: "160",
          r: "30",
          fill: "rgba(184,92,58,0.03)"
        }),
        aV: common_vendor.p({
          viewBox: "0 0 200 200"
        }),
        aW: common_vendor.t(summaryData.value.clothesCount),
        aX: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        aY: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aZ: common_vendor.p({
          d: "M7 17L17 7M17 7H8M17 7v9"
        }),
        ba: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        bb: common_vendor.o(goClothes, "2d"),
        bc: sectionsVisible.value.actions ? 1 : "",
        bd: isFamilyMode.value
      }, isFamilyMode.value ? common_vendor.e({
        be: common_vendor.t(((_a = familyRecord.value) == null ? void 0 : _a.name) || "未命名家庭"),
        bf: common_vendor.t(((_b = membershipRecord.value) == null ? void 0 : _b.role) === "admin" ? "Admin" : "Member"),
        bg: common_vendor.t(familySummaryData.value.closetCount),
        bh: common_vendor.o(goFamilyClosets, "a6"),
        bi: common_vendor.t(familySummaryData.value.clothesCount),
        bj: common_vendor.o(goFamilyClothes, "ac"),
        bk: common_vendor.f(displayMembers.value, (member, k0, i0) => {
          return {
            a: common_vendor.t(getAvatarText(member.nickname || member.username)),
            b: member.role === "admin" ? 1 : "",
            c: member.user_id
          };
        }),
        bl: extraMemberCount.value > 0
      }, extraMemberCount.value > 0 ? {
        bm: common_vendor.t(extraMemberCount.value)
      } : {}, {
        bn: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        bo: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        bp: common_vendor.o(goFamilyManage, "3e")
      }) : {
        bq: common_vendor.o(goCreateFamily, "93"),
        br: common_vendor.o(goJoinFamily, "ee")
      }, {
        bs: sectionsVisible.value.family ? 1 : "",
        bt: common_vendor.p({
          d: "M30 5 Q 40 20 30 35 Q 20 20 30 5Z",
          fill: "rgba(184,92,58,0.08)"
        }),
        bv: common_vendor.p({
          d: "M30 25 Q 40 40 30 55 Q 20 40 30 25Z",
          fill: "rgba(184,92,58,0.05)"
        }),
        bw: common_vendor.p({
          viewBox: "0 0 60 60"
        }),
        bx: common_vendor.t(seasonLabel.value),
        by: common_vendor.t(seasonTipText.value),
        bz: sectionsVisible.value.season ? 1 : "",
        bA: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).home
        }),
        bB: common_vendor.o(onTouchStart, "4e"),
        bC: common_vendor.o(onTouchEnd, "14")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
