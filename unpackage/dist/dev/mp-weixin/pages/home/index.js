"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Math) {
  (ScopeStatusCard + HomeQuickActions + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const HomeQuickActions = () => "./components/HomeQuickActions.js";
const ScopeStatusCard = () => "./components/ScopeStatusCard.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const scopeTitle = common_vendor.ref("个人空间");
    const scopeDesc = common_vendor.ref("你当前还没有加入家庭，可以先管理自己的衣橱和衣物。");
    const scopeBadge = common_vendor.ref("个人模式");
    const scopeMetaItems = common_vendor.ref([]);
    const quickActions = common_vendor.ref([]);
    const summaryItems = common_vendor.ref([]);
    const collaborationTitle = common_vendor.ref("家庭协作");
    const collaborationDesc = common_vendor.ref("你还没有加入家庭，可以先创建家庭，或通过邀请码加入已有家庭。");
    const collaborationActions = common_vendor.ref([]);
    const noticeItems = common_vendor.ref([]);
    const isFamilyMode = common_vendor.ref(false);
    const familyRecord = common_vendor.ref(null);
    const membershipRecord = common_vendor.ref(null);
    const hasSkippedFamilyGuide = common_vendor.ref(false);
    const personalClosetCount = common_vendor.ref(0);
    const familyClosetCount = common_vendor.ref(0);
    const personalClothesCount = common_vendor.ref(0);
    const familyClothesCount = common_vendor.ref(0);
    const personalUnassignedClothesCount = common_vendor.ref(0);
    const familyUnassignedClothesCount = common_vendor.ref(0);
    function buildPageSections() {
      var _a, _b, _c, _d;
      scopeMetaItems.value = isFamilyMode.value ? [
        {
          label: "家庭名称",
          value: ((_a = familyRecord.value) == null ? void 0 : _a.name) || "未命名家庭"
        },
        {
          label: "我的角色",
          value: ((_b = membershipRecord.value) == null ? void 0 : _b.role) === "admin" ? "管理员" : "成员"
        }
      ] : [
        {
          label: "当前模式",
          value: "个人空间"
        },
        {
          label: "家庭状态",
          value: hasSkippedFamilyGuide.value ? "可随时加入家庭" : "尚未加入家庭"
        }
      ];
      quickActions.value = isFamilyMode.value ? [
        { title: "衣橱管理", desc: "查看和管理当前家庭下的衣橱。", tag: "下一步", action: "wardrobes" },
        { title: "衣物管理", desc: "查看家庭衣物列表与详情。", tag: "下一步", action: "clothes" },
        { title: "创建衣橱", desc: "为家庭空间新增一个衣橱。", tag: "已可用", action: "create-wardrobe" },
        { title: "添加衣物", desc: "把新的衣物记录到家庭空间。", tag: "待接入", action: "create-clothing" }
      ] : [
        { title: "衣橱管理", desc: "查看和管理个人空间下的衣橱。", tag: "下一步", action: "wardrobes" },
        { title: "衣物管理", desc: "查看个人衣物列表与详情。", tag: "下一步", action: "clothes" },
        { title: "创建家庭", desc: "创建一个家庭并邀请家人加入。", tag: "已可用", action: "create-family" },
        { title: "加入家庭", desc: "通过邀请码加入已有家庭。", tag: "已可用", action: "join-family" }
      ];
      summaryItems.value = isFamilyMode.value ? [
        { value: String(familyClosetCount.value), label: "家庭衣橱", desc: "当前家庭下的衣橱数量" },
        { value: String(familyClothesCount.value), label: "家庭衣物", desc: "当前家庭下的衣物数量" },
        { value: String(familyUnassignedClothesCount.value), label: "未归类衣物", desc: "暂未放入衣橱的衣物" },
        {
          value: String(((_c = familyRecord.value) == null ? void 0 : _c.member_count) || 1),
          label: "家庭成员",
          desc: "当前已加入家庭的人数"
        }
      ] : [
        { value: String(personalClosetCount.value), label: "个人衣橱", desc: "当前个人空间下的衣橱数量" },
        { value: String(personalClothesCount.value), label: "个人衣物", desc: "当前个人空间下的衣物数量" },
        { value: String(personalUnassignedClothesCount.value), label: "未归类衣物", desc: "暂未放入衣橱的衣物" },
        { value: "0", label: "待加入家庭", desc: "加入家庭后可开启协作模式" }
      ];
      if (isFamilyMode.value) {
        collaborationTitle.value = "家庭协作";
        collaborationDesc.value = ((_d = familyRecord.value) == null ? void 0 : _d.invite_code) ? `当前家庭邀请码：${familyRecord.value.invite_code}，你可以发给家人邀请他们加入。` : "当前家庭已创建，后续可以继续完善成员与邀请码相关能力。";
        collaborationActions.value = [
          { title: "查看家庭信息", action: "family-info" },
          { title: "复制邀请码", action: "copy-invite" }
        ];
        noticeItems.value = [
          {
            title: "先创建第一个家庭衣橱",
            desc: "家庭空间适合按卧室、季节或成员来划分衣橱。"
          },
          {
            title: "邀请家人加入",
            desc: "把邀请码发给家人后，就能共同维护家庭空间的数据。"
          }
        ];
        return;
      }
      collaborationTitle.value = "家庭协作";
      collaborationDesc.value = hasSkippedFamilyGuide.value ? "你当前正在使用个人模式。准备好后，可以随时创建家庭或通过邀请码加入已有家庭。" : "加入家庭后，可以和家人共享衣橱与衣物数据，也能按角色协作管理。";
      collaborationActions.value = [
        { title: "创建家庭", action: "create-family" },
        { title: "加入家庭", action: "join-family" }
      ];
      noticeItems.value = [
        {
          title: "先创建你的第一个衣橱",
          desc: "可以先按收纳位置、季节或使用场景来划分个人衣橱。"
        },
        {
          title: "个人与家庭数据并存",
          desc: "加入家庭后，个人空间的数据仍会独立保留，不会自动迁移。"
        }
      ];
    }
    async function syncClosetSummary() {
      try {
        const summary = await common_api_modules_closet.getHomeSummary({
          scopeType: isFamilyMode.value ? "family" : "personal"
        });
        if (isFamilyMode.value) {
          familyClosetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
          familyClothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
          familyUnassignedClothesCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
        } else {
          personalClosetCount.value = (summary == null ? void 0 : summary.closetCount) || 0;
          personalClothesCount.value = (summary == null ? void 0 : summary.clothesCount) || 0;
          personalUnassignedClothesCount.value = (summary == null ? void 0 : summary.unassignedClothesCount) || 0;
        }
        buildPageSections();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/index.vue:230", "syncClosetSummary failed", error);
        personalClosetCount.value = 0;
        familyClosetCount.value = 0;
        personalClothesCount.value = 0;
        familyClothesCount.value = 0;
        personalUnassignedClothesCount.value = 0;
        familyUnassignedClothesCount.value = 0;
        buildPageSections();
      }
    }
    async function syncScopeStatus() {
      var _a, _b;
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin) {
        isFamilyMode.value = false;
        scopeTitle.value = "访客状态";
        scopeDesc.value = "当前未获取到有效登录态，首页仅展示静态骨架内容。";
        scopeBadge.value = "未登录";
        familyRecord.value = null;
        membershipRecord.value = null;
        hasSkippedFamilyGuide.value = false;
        personalClosetCount.value = 0;
        familyClosetCount.value = 0;
        personalClothesCount.value = 0;
        familyClothesCount.value = 0;
        personalUnassignedClothesCount.value = 0;
        familyUnassignedClothesCount.value = 0;
        buildPageSections();
        return;
      }
      const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
      if (membership.status === "failed") {
        isFamilyMode.value = false;
        scopeTitle.value = "状态检查失败";
        scopeDesc.value = membership.errorMessage || "家庭状态查询失败，请稍后重试。";
        scopeBadge.value = "需重试";
        familyRecord.value = null;
        membershipRecord.value = null;
        hasSkippedFamilyGuide.value = false;
        personalClosetCount.value = 0;
        familyClosetCount.value = 0;
        personalClothesCount.value = 0;
        familyClothesCount.value = 0;
        personalUnassignedClothesCount.value = 0;
        familyUnassignedClothesCount.value = 0;
        buildPageSections();
        return;
      }
      if (membership.status === "unauthorized") {
        isFamilyMode.value = false;
        scopeTitle.value = "登录已失效";
        scopeDesc.value = "当前登录态已失效，请重新登录后继续。";
        scopeBadge.value = "需登录";
        familyRecord.value = null;
        membershipRecord.value = null;
        hasSkippedFamilyGuide.value = false;
        personalClosetCount.value = 0;
        familyClosetCount.value = 0;
        personalClothesCount.value = 0;
        familyClothesCount.value = 0;
        personalUnassignedClothesCount.value = 0;
        familyUnassignedClothesCount.value = 0;
        buildPageSections();
        return;
      }
      familyRecord.value = membership.familyRecord || null;
      membershipRecord.value = membership.membershipRecord || null;
      hasSkippedFamilyGuide.value = common_services_familyGuideState.getFamilyGuideSkipState(session.uid);
      if (membership.hasFamily) {
        isFamilyMode.value = true;
        scopeTitle.value = ((_a = familyRecord.value) == null ? void 0 : _a.name) || "家庭空间";
        scopeDesc.value = "你当前正在家庭空间中，后续可以和家人一起管理家庭衣橱与衣物。";
        scopeBadge.value = ((_b = membershipRecord.value) == null ? void 0 : _b.role) === "admin" ? "管理员" : "家庭成员";
        buildPageSections();
        await syncClosetSummary();
        return;
      }
      isFamilyMode.value = false;
      scopeTitle.value = "个人空间";
      scopeDesc.value = hasSkippedFamilyGuide.value ? "你已跳过家庭引导，当前以个人模式进入首页，后续仍可创建或加入家庭。" : "你当前还没有加入家庭，可以先在个人空间里管理自己的衣橱和衣物。";
      scopeBadge.value = hasSkippedFamilyGuide.value ? "已跳过家庭引导" : "个人模式";
      buildPageSections();
      await syncClosetSummary();
    }
    function handleQuickAction(item) {
      if (item.action === "wardrobes") {
        const session = common_services_auth.getCurrentSession();
        common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, isFamilyMode.value ? "family" : "personal");
        return common_vendor.index.switchTab({
          url: common_constants_routes.ROUTES.closets
        });
      }
      if (item.action === "clothes") {
        return common_vendor.index.switchTab({
          url: common_constants_routes.ROUTES.clothes
        });
      }
      if (item.action === "create-wardrobe") {
        return common_vendor.index.navigateTo({
          url: isFamilyMode.value ? `${common_constants_routes.ROUTES.closetCreate}?scopeType=family` : common_constants_routes.ROUTES.closetCreate
        });
      }
      if (item.action === "create-family") {
        return common_vendor.index.navigateTo({
          url: common_constants_routes.ROUTES.familyCreate
        });
      }
      if (item.action === "join-family") {
        return common_vendor.index.navigateTo({
          url: common_constants_routes.ROUTES.familyGuide
        });
      }
      common_vendor.index.showToast({
        title: "该功能将在下一批接入",
        icon: "none"
      });
    }
    function handlePanelAction(item) {
      var _a;
      if (item.action === "family-info") {
        return common_vendor.index.switchTab({
          url: common_constants_routes.ROUTES.profile
        });
      }
      if (item.action === "create-family") {
        return common_vendor.index.navigateTo({
          url: common_constants_routes.ROUTES.familyCreate
        });
      }
      if (item.action === "join-family") {
        return common_vendor.index.navigateTo({
          url: common_constants_routes.ROUTES.familyGuide
        });
      }
      if (item.action === "copy-invite") {
        if (!((_a = familyRecord.value) == null ? void 0 : _a.invite_code)) {
          common_vendor.index.showToast({
            title: "当前还没有可用邀请码",
            icon: "none"
          });
          return;
        }
        return common_vendor.index.setClipboardData({
          data: familyRecord.value.invite_code,
          success: () => {
            common_vendor.index.showToast({
              title: "邀请码已复制",
              icon: "success"
            });
          }
        });
      }
      common_vendor.index.showToast({
        title: "该功能将在下一批接入",
        icon: "none"
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "退出后将回到登录页，是否继续？",
        success: async (res) => {
          if (!res.confirm) {
            return;
          }
          await uni_modules_uniIdPages_common_store.mutations.logout();
        }
      });
    }
    common_vendor.onShow(() => {
      syncScopeStatus();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleLogout, "96"),
        b: common_vendor.p({
          title: scopeTitle.value,
          desc: scopeDesc.value,
          badge: scopeBadge.value,
          ["meta-items"]: scopeMetaItems.value
        }),
        c: common_vendor.o(handleQuickAction, "68"),
        d: common_vendor.p({
          items: quickActions.value
        }),
        e: common_vendor.f(summaryItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.value),
            b: common_vendor.t(item.label),
            c: common_vendor.t(item.desc),
            d: item.label
          };
        }),
        f: common_vendor.t(collaborationTitle.value),
        g: common_vendor.t(collaborationDesc.value),
        h: common_vendor.f(collaborationActions.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.title,
            c: common_vendor.o(($event) => handlePanelAction(item), item.title)
          };
        }),
        i: common_vendor.f(noticeItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: item.title
          };
        }),
        j: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).home
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
