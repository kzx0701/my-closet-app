"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Math) {
  H5TabBar();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const nickname = common_vendor.ref("");
    const isFamilyMode = common_vendor.ref(false);
    const familyRecord = common_vendor.ref(null);
    const membershipRecord = common_vendor.ref(null);
    const hasSkippedFamilyGuide = common_vendor.ref(false);
    const closetCount = common_vendor.ref(0);
    const clothesCount = common_vendor.ref(0);
    const unassignedCount = common_vendor.ref(0);
    const fontsLoaded = common_vendor.ref(false);
    function loadCustomFonts() {
      if (fontsLoaded.value)
        return;
      common_vendor.index.loadFontFace({
        family: "Fraunces",
        source: 'url("https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.woff2")',
        global: false,
        success() {
          common_vendor.index.__f__("log", "at pages/home/index.vue:164", "Font loaded: Fraunces");
        },
        fail(err) {
          common_vendor.index.__f__("warn", "at pages/home/index.vue:167", "Font load failed: Fraunces", err);
        }
      });
      fontsLoaded.value = true;
    }
    const greetingText = common_vendor.computed(() => {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour < 6)
        return "Good night";
      if (hour < 12)
        return "Good morning";
      if (hour < 18)
        return "Good afternoon";
      return "Good evening";
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
    const scopeBadgeText = common_vendor.computed(() => {
      var _a;
      if (isFamilyMode.value) {
        const role = ((_a = membershipRecord.value) == null ? void 0 : _a.role) === "admin" ? "管理员" : "成员";
        return `Family Space · ${role}`;
      }
      return "Personal Space";
    });
    const scopeTitleMain = common_vendor.computed(() => {
      var _a, _b;
      return isFamilyMode.value ? ((_b = (_a = familyRecord.value) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) || "家" : "个人";
    });
    const scopeTitleSub = common_vendor.computed(() => {
      var _a, _b;
      return isFamilyMode.value ? ((_b = (_a = familyRecord.value) == null ? void 0 : _a.name) == null ? void 0 : _b.slice(1)) || "空间" : "空间";
    });
    const scopeDesc = common_vendor.computed(() => {
      if (isFamilyMode.value) {
        return "和家人一起管理家庭衣橱与衣物，协作收纳更有序。";
      }
      return "管理你自己的衣橱和衣物，随时可以创建或加入家庭。";
    });
    const scopeMetaItems = common_vendor.computed(() => {
      var _a, _b;
      if (isFamilyMode.value) {
        return [
          { key: "Role", val: "管理员", accent: ((_a = membershipRecord.value) == null ? void 0 : _a.role) === "admin" },
          { key: "Members", val: `${((_b = familyRecord.value) == null ? void 0 : _b.member_count) || 1} 位成员`, accent: false }
        ];
      }
      return [
        { key: "Mode", val: "个人模式", accent: false },
        { key: "Family", val: hasSkippedFamilyGuide.value ? "可随时加入" : "尚未加入", accent: false }
      ];
    });
    const summaryData = common_vendor.computed(() => ({
      closetCount: String(closetCount.value),
      clothesCount: String(clothesCount.value),
      unassignedCount: String(unassignedCount.value)
    }));
    async function syncClosetSummary() {
      try {
        const summary = await common_api_modules_closet.getHomeSummary({
          scopeType: isFamilyMode.value ? "family" : "personal"
        });
        closetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
        clothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
        unassignedCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/index.vue:269", "syncClosetSummary failed", error);
        closetCount.value = 0;
        clothesCount.value = 0;
        unassignedCount.value = 0;
      }
    }
    async function syncScopeStatus() {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin)
        return;
      try {
        const info = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if (info)
          nickname.value = info.nickname || info.username || "用户";
      } catch (e) {
        nickname.value = "用户";
      }
      const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
      if (membership.status !== "success")
        return;
      familyRecord.value = membership.familyRecord || null;
      membershipRecord.value = membership.membershipRecord || null;
      hasSkippedFamilyGuide.value = common_services_familyGuideState.getFamilyGuideSkipState(session.uid);
      if (membership.hasFamily) {
        isFamilyMode.value = true;
      } else {
        isFamilyMode.value = false;
      }
      await syncClosetSummary();
    }
    function goClosets() {
      const session = common_services_auth.getCurrentSession();
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, isFamilyMode.value ? "family" : "personal");
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.closets });
    }
    function goClothes() {
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.clothes });
    }
    function goCreateFamily() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyCreate });
    }
    function goJoinFamily() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
    }
    function copyInviteCode() {
      var _a;
      const code = (_a = familyRecord.value) == null ? void 0 : _a.invite_code;
      if (!code) {
        common_vendor.index.showToast({ title: "暂无邀请码", icon: "none" });
        return;
      }
      common_vendor.index.setClipboardData({
        data: code,
        success: () => common_vendor.index.showToast({ title: "邀请码已复制", icon: "success" })
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "退出后将回到登录页，是否继续？",
        success: async (res) => {
          if (!res.confirm)
            return;
          await uni_modules_uniIdPages_common_store.mutations.logout();
        }
      });
    }
    common_vendor.onShow(() => {
      loadCustomFonts();
      syncScopeStatus();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.t(greetingText.value),
        b: common_vendor.t(nickname.value),
        c: common_vendor.o(handleLogout, "3d"),
        d: common_vendor.t(scopeBadgeText.value),
        e: common_vendor.t(scopeTitleMain.value),
        f: common_vendor.t(scopeTitleSub.value),
        g: common_vendor.t(scopeDesc.value),
        h: common_vendor.f(scopeMetaItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.key),
            b: common_vendor.t(item.val),
            c: item.accent ? 1 : "",
            d: item.key
          };
        }),
        i: common_vendor.t(summaryData.value.closetCount),
        j: common_vendor.t(summaryData.value.clothesCount),
        k: common_vendor.t(summaryData.value.unassignedCount),
        l: common_vendor.t(summaryData.value.closetCount),
        m: common_vendor.t(isFamilyMode.value ? "家庭衣橱" : "我的衣橱"),
        n: common_vendor.o(goClosets, "21"),
        o: common_vendor.t(summaryData.value.clothesCount),
        p: common_vendor.t(isFamilyMode.value ? "家庭衣物" : "我的衣物"),
        q: common_vendor.o(goClothes, "c9"),
        r: isFamilyMode.value
      }, isFamilyMode.value ? {
        s: common_vendor.t(((_a = familyRecord.value) == null ? void 0 : _a.name) || "未命名家庭"),
        t: common_vendor.t(((_b = membershipRecord.value) == null ? void 0 : _b.role) === "admin" ? "Admin" : "Member"),
        v: common_vendor.t(((_c = familyRecord.value) == null ? void 0 : _c.invite_code) || "—"),
        w: common_vendor.o(copyInviteCode, "58"),
        x: common_vendor.t(((_d = familyRecord.value) == null ? void 0 : _d.member_count) || 1)
      } : {
        y: common_vendor.o(goCreateFamily, "28"),
        z: common_vendor.o(goJoinFamily, "f6")
      }, {
        A: common_vendor.t(seasonLabel.value),
        B: common_vendor.t(seasonTipText.value),
        C: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).home
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
