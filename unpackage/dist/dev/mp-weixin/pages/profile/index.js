"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_line = common_vendor.resolveComponent("line");
  (_component_path + _component_circle + _component_svg + _component_rect + _component_line)();
}
if (!Math) {
  (ScopeBadge + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ScopeBadge = () => "../../components/ScopeBadge.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({
      nickname: "",
      username: "",
      avatar: ""
    });
    const familyInfo = common_vendor.ref({
      hasFamily: false,
      name: "",
      inviteCode: "",
      role: "",
      memberCount: 0
    });
    const familyMembers = common_vendor.ref([]);
    const currentUserId = common_vendor.ref("");
    const statusBarHeight = common_vendor.ref(20);
    const loading = common_vendor.ref(false);
    const stats = common_vendor.ref({
      closetCount: 0,
      clothesCount: 0,
      familySharedCount: 0
    });
    const cacheSize = common_vendor.ref("—");
    const appVersion = common_vendor.ref("v1.0.0");
    const avatarText = common_vendor.computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || "";
      return name.charAt(0).toUpperCase() || "U";
    });
    const metaText = common_vendor.computed(() => {
      if (familyInfo.value.hasFamily) {
        const role = familyInfo.value.role === "admin" ? "Admin" : "Member";
        return `Family · ${familyInfo.value.name || "家庭"} · ${role}`;
      }
      return "Personal · 个人空间";
    });
    async function loadUserInfo() {
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      currentUserId.value = session.uid;
      try {
        const info = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if (info) {
          userInfo.value = info;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:312", "loadUserInfo failed", error);
      }
    }
    async function loadStats() {
      try {
        const personalSummary = await common_api_modules_closet.getHomeSummary({ scopeType: "personal" });
        stats.value.closetCount = (personalSummary == null ? void 0 : personalSummary.closetCount) || 0;
        stats.value.clothesCount = (personalSummary == null ? void 0 : personalSummary.clothesCount) || 0;
        if (familyInfo.value.hasFamily) {
          const familySummary = await common_api_modules_closet.getHomeSummary({ scopeType: "family" });
          stats.value.familySharedCount = (familySummary == null ? void 0 : familySummary.clothesCount) || 0;
        } else {
          stats.value.familySharedCount = 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:329", "loadStats failed", error);
      }
    }
    async function loadFamilyInfo() {
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
      if (membership.status === "success" && membership.hasFamily) {
        const family = membership.familyRecord;
        const member = membership.membershipRecord;
        familyInfo.value = {
          hasFamily: true,
          name: (family == null ? void 0 : family.name) || "",
          inviteCode: (family == null ? void 0 : family.invite_code) || "",
          role: (member == null ? void 0 : member.role) || "",
          memberCount: (family == null ? void 0 : family.member_count) || 0
        };
        await loadFamilyMembers();
      } else {
        familyInfo.value = {
          hasFamily: false,
          name: "",
          inviteCode: "",
          role: "",
          memberCount: 0
        };
        familyMembers.value = [];
      }
    }
    async function loadFamilyMembers() {
      try {
        const result = await common_api_modules_family.getFamilyMembers();
        familyMembers.value = (result == null ? void 0 : result.members) || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:368", "loadFamilyMembers failed", error);
        familyMembers.value = [];
        common_vendor.index.showToast({
          title: "家庭成员加载失败",
          icon: "none"
        });
      }
    }
    function getMemberInitial(member) {
      const name = member.nickname || member.username || "";
      return name.charAt(0).toUpperCase() || "M";
    }
    function copyInviteCode() {
      if (!familyInfo.value.inviteCode) {
        common_vendor.index.showToast({ title: "暂无邀请码", icon: "none" });
        return;
      }
      common_vendor.index.setClipboardData({
        data: familyInfo.value.inviteCode,
        success: () => {
          common_vendor.index.showToast({ title: "邀请码已复制", icon: "success" });
        }
      });
    }
    function goFamilyManage() {
      if (familyInfo.value.hasFamily) {
        const isAdmin = familyInfo.value.role === "admin";
        const items = ["复制邀请码"];
        if (!isAdmin) {
          items.push("退出家庭");
        }
        common_vendor.index.showActionSheet({
          itemList: items,
          success: (res) => {
            const action = items[res.tapIndex];
            if (action === "复制邀请码") {
              copyInviteCode();
            } else if (action === "退出家庭") {
              confirmLeaveFamily();
            }
          }
        });
      } else {
        common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
      }
    }
    function confirmLeaveFamily() {
      common_vendor.index.showModal({
        title: "退出家庭",
        content: "退出后你将无法访问家庭空间的数据，是否继续？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_family.leaveFamily();
            common_vendor.index.showToast({ title: "已退出家庭", icon: "success" });
            await loadFamilyInfo();
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:430", "leaveFamily failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "退出家庭失败",
              icon: "none"
            });
          }
        }
      });
    }
    function confirmRemoveMember(member) {
      const memberName = member.nickname || member.username || "该成员";
      common_vendor.index.showModal({
        title: "移除成员",
        content: `确定要将 ${memberName} 移出家庭吗？`,
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_family.removeFamilyMember({ userId: member.user_id });
            common_vendor.index.showToast({ title: "已移除成员", icon: "success" });
            await loadFamilyMembers();
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:454", "removeFamilyMember failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "移除成员失败",
              icon: "none"
            });
          }
        }
      });
    }
    function goUserInfo() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
      });
    }
    function goClosets() {
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.closets });
    }
    function goClothes() {
      common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.clothes });
    }
    function goFamilyShared() {
      if (familyInfo.value.hasFamily) {
        const session = common_services_auth.getCurrentSession();
        common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, "family");
        common_vendor.index.switchTab({ url: common_constants_routes.ROUTES.clothes });
      } else {
        common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
      }
    }
    function goNotifications() {
      common_vendor.index.showToast({ title: "该功能即将上线", icon: "none" });
    }
    function formatStorageSize(bytes) {
      if (!bytes || bytes <= 0)
        return "0 KB";
      if (bytes < 1024)
        return `${bytes} B`;
      if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    function refreshCacheSize() {
      try {
        const info = common_vendor.index.getStorageInfoSync();
        cacheSize.value = formatStorageSize(info.currentSize * 1024);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:504", "getStorageInfoSync failed", e);
        cacheSize.value = "—";
      }
    }
    function handleClearCache() {
      common_vendor.index.showModal({
        title: "缓存清理",
        content: `当前缓存大小 ${cacheSize.value}，确定要清理吗？`,
        success: (res) => {
          if (!res.confirm)
            return;
          common_vendor.index.showLoading({ title: "清理中..." });
          try {
            common_vendor.index.clearStorageSync();
            refreshCacheSize();
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "缓存已清理", icon: "success" });
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:522", "clearStorageSync failed", e);
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "清理失败", icon: "none" });
          }
        }
      });
    }
    function goAbout() {
      common_vendor.index.showModal({
        title: "关于 四季衣橱",
        content: `四季衣橱 Season Closet ${appVersion.value}

一款帮你管理衣橱与衣物的轻量工具，支持个人空间与家庭共享，让收纳更从容。`,
        showCancel: false,
        confirmText: "知道了"
      });
    }
    function goAccountSecurity() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
        fail: () => {
          common_vendor.index.showToast({ title: "该功能即将上线", icon: "none" });
        }
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
          common_vendor.index.reLaunch({ url: common_constants_routes.ROUTES.entry });
        }
      });
    }
    common_vendor.onShow(async () => {
      const session = common_services_auth.getCurrentSession();
      if (!session.hasLogin) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none", duration: 1500 });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.login });
        }, 500);
        return;
      }
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      refreshCacheSize();
      loading.value = true;
      try {
        await loadUserInfo();
        await loadFamilyInfo();
        await loadStats();
      } finally {
        loading.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          text: "Profile · 个人中心"
        }),
        b: loading.value
      }, loading.value ? {} : {
        c: common_vendor.t(avatarText.value),
        d: common_vendor.t(userInfo.value.nickname || "未设置昵称"),
        e: common_vendor.t(metaText.value),
        f: common_vendor.t(stats.value.closetCount),
        g: common_vendor.o(goClosets, "15"),
        h: common_vendor.t(stats.value.clothesCount),
        i: common_vendor.o(goClothes, "e2"),
        j: common_vendor.t(stats.value.familySharedCount),
        k: common_vendor.o(goFamilyShared, "55")
      }, {
        l: statusBarHeight.value + "px",
        m: common_vendor.p({
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        n: common_vendor.p({
          cx: "12",
          cy: "7",
          r: "4"
        }),
        o: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        p: common_vendor.t(userInfo.value.nickname || "未设置"),
        q: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        r: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        s: common_vendor.o(goUserInfo, "d4"),
        t: common_vendor.p({
          x: "3",
          y: "11",
          width: "18",
          height: "11",
          rx: "2",
          ry: "2"
        }),
        v: common_vendor.p({
          d: "M7 11V7a5 5 0 0 1 10 0v4"
        }),
        w: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        x: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        y: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        z: common_vendor.o(goAccountSecurity, "a0"),
        A: common_vendor.p({
          d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        }),
        B: common_vendor.p({
          d: "M9 22V12h6v10"
        }),
        C: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        D: common_vendor.t(familyInfo.value.hasFamily ? familyInfo.value.name : "未加入"),
        E: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        F: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        G: common_vendor.o(goFamilyManage, "70"),
        H: familyInfo.value.hasFamily
      }, familyInfo.value.hasFamily ? {
        I: common_vendor.p({
          x: "9",
          y: "9",
          width: "13",
          height: "13",
          rx: "2",
          ry: "2"
        }),
        J: common_vendor.p({
          d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        }),
        K: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        L: common_vendor.t(familyInfo.value.inviteCode || "—"),
        M: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        N: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        O: common_vendor.o(copyInviteCode, "0e")
      } : {}, {
        P: familyInfo.value.hasFamily
      }, familyInfo.value.hasFamily ? {
        Q: common_vendor.p({
          d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        }),
        R: common_vendor.p({
          cx: "9",
          cy: "7",
          r: "4"
        }),
        S: common_vendor.p({
          d: "M23 21v-2a4 4 0 0 0-3-3.87"
        }),
        T: common_vendor.p({
          d: "M16 3.13a4 4 0 0 1 0 7.75"
        }),
        U: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        V: common_vendor.t(familyMembers.value.length)
      } : {}, {
        W: familyInfo.value.hasFamily && familyMembers.value.length > 0
      }, familyInfo.value.hasFamily && familyMembers.value.length > 0 ? {
        X: common_vendor.f(familyMembers.value, (member, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getMemberInitial(member)),
            b: common_vendor.t(member.nickname || member.username || "未设置"),
            c: common_vendor.t(member.role === "admin" ? "管理员" : "成员"),
            d: familyInfo.value.role === "admin" && member.user_id !== currentUserId.value
          }, familyInfo.value.role === "admin" && member.user_id !== currentUserId.value ? {
            e: common_vendor.o(($event) => confirmRemoveMember(member), member.user_id)
          } : {}, {
            f: member.user_id
          });
        })
      } : {}, {
        Y: familyInfo.value.hasFamily && familyInfo.value.role === "admin"
      }, familyInfo.value.hasFamily && familyInfo.value.role === "admin" ? {} : {}, {
        Z: familyInfo.value.hasFamily && familyInfo.value.role !== "admin"
      }, familyInfo.value.hasFamily && familyInfo.value.role !== "admin" ? {
        aa: common_vendor.p({
          d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        }),
        ab: common_vendor.p({
          d: "M16 17l5-5-5-5"
        }),
        ac: common_vendor.p({
          d: "M21 12H9"
        }),
        ad: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ae: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        af: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ag: common_vendor.o(confirmLeaveFamily, "a1")
      } : {}, {
        ah: common_vendor.p({
          d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        }),
        ai: common_vendor.p({
          d: "M13.73 21a2 2 0 0 1-3.46 0"
        }),
        aj: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ak: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        al: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        am: common_vendor.o(goNotifications, "bd"),
        an: common_vendor.p({
          d: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        }),
        ao: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ap: common_vendor.t(cacheSize.value),
        aq: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        ar: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        as: common_vendor.o(handleClearCache, "d8"),
        at: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        av: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12",
          y2: "12"
        }),
        aw: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12.01",
          y2: "8"
        }),
        ax: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ay: common_vendor.t(appVersion.value),
        az: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        aA: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        aB: common_vendor.o(goAbout, "2c"),
        aC: common_vendor.o(handleLogout, "59"),
        aD: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).profile
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
