"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_services_cacheService = require("../../common/services/cache-service.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_path + _component_svg + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const MAX_DISPLAY_MEMBERS = 4;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({
      nickname: "",
      username: "",
      avatar: "",
      mobile: "",
      email: ""
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
    const cacheSize = common_vendor.ref("—");
    const appVersion = common_vendor.ref("v1.0.0");
    const hasPassword = common_vendor.ref(false);
    const hasInitialized = common_vendor.ref(false);
    const displayMembers = common_vendor.computed(() => familyMembers.value.slice(0, MAX_DISPLAY_MEMBERS));
    const extraMemberCount = common_vendor.computed(() => Math.max(0, familyMembers.value.length - MAX_DISPLAY_MEMBERS));
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
      var _a, _b;
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      currentUserId.value = session.uid;
      try {
        const info = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if (info) {
          userInfo.value = info;
          if (info.nickname) {
            uni_modules_uniIdPages_common_store.mutations.setUserInfo({ nickname: info.nickname });
          }
        } else {
          const cached = uni_modules_uniIdPages_common_store.store.userInfo || {};
          if (cached && Object.keys(cached).length > 0) {
            userInfo.value = {
              nickname: cached.nickname || "",
              username: cached.username || "",
              avatar: ((_a = cached.avatar_file) == null ? void 0 : _a.url) || "",
              mobile: cached.mobile || "",
              email: cached.email || ""
            };
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:348", "loadUserInfo failed", error);
        const cached = uni_modules_uniIdPages_common_store.store.userInfo || {};
        if (cached && Object.keys(cached).length > 0) {
          userInfo.value = {
            nickname: cached.nickname || "",
            username: cached.username || "",
            avatar: ((_b = cached.avatar_file) == null ? void 0 : _b.url) || "",
            mobile: cached.mobile || "",
            email: cached.email || ""
          };
        }
      }
    }
    async function loadFamilyInfo() {
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      try {
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/index.vue:393", "loadFamilyInfo failed", error);
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
        common_vendor.index.__f__("error", "at pages/profile/index.vue:410", "loadFamilyMembers failed", error);
        familyMembers.value = [];
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
        if (isAdmin && familyMembers.value.length > 0) {
          items.push("管理成员");
        }
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
            } else if (action === "管理成员") {
              showMemberManagement();
            }
          }
        });
      } else {
        common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
      }
    }
    function showMemberManagement() {
      if (familyMembers.value.length === 0) {
        common_vendor.index.showToast({ title: "暂无其他成员", icon: "none" });
        return;
      }
      const otherMembers = familyMembers.value.filter((m) => m.user_id !== currentUserId.value);
      if (otherMembers.length === 0) {
        common_vendor.index.showToast({ title: "暂无其他成员", icon: "none" });
        return;
      }
      const memberNames = otherMembers.map((m) => m.nickname || m.username || "未设置");
      common_vendor.index.showActionSheet({
        itemList: memberNames,
        success: (res) => {
          confirmRemoveMember(otherMembers[res.tapIndex]);
        }
      });
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
            try {
              await loadFamilyInfo();
            } catch (refreshError) {
              common_vendor.index.__f__("error", "at pages/profile/index.vue:497", "loadFamilyInfo after leave failed", refreshError);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:500", "leaveFamily failed", error);
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
            try {
              await loadFamilyMembers();
            } catch (refreshError) {
              common_vendor.index.__f__("error", "at pages/profile/index.vue:526", "loadFamilyMembers after remove failed", refreshError);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:529", "removeFamilyMember failed", error);
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
        url: common_constants_routes.ROUTES.userInfo
      });
    }
    function goFamilyGuide() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
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
        common_vendor.index.__f__("error", "at pages/profile/index.vue:561", "getStorageInfoSync failed", e);
        cacheSize.value = "—";
      }
    }
    function handleClearCache() {
      common_vendor.index.showModal({
        title: "缓存清理",
        content: `当前缓存大小 ${cacheSize.value}，确定要清理吗？
（仅清理业务缓存，不影响登录状态）`,
        success: (res) => {
          if (!res.confirm)
            return;
          common_vendor.index.showLoading({ title: "清理中..." });
          try {
            const uid = currentUserId.value;
            if (uid) {
              common_services_cacheService.clearUserCache(uid);
            } else {
              const info = common_vendor.index.getStorageInfoSync();
              info.keys.forEach((key) => {
                if (key.startsWith("cache:")) {
                  common_vendor.index.removeStorageSync(key);
                }
              });
            }
            refreshCacheSize();
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "缓存已清理", icon: "success" });
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/profile/index.vue:591", "clearUserCache failed", e);
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "清理失败", icon: "none" });
          }
        }
      });
    }
    function handleDataExport() {
      common_vendor.index.showModal({
        title: "数据导出 / 备份",
        content: "该功能正在开发中，上线后可将衣橱、衣物等数据导出为本地文件备份。",
        showCancel: false,
        confirmText: "知道了"
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
    async function goAccountSecurity() {
      if (!hasPassword.value) {
        try {
          const uniIdCo = common_vendor._r.importObject("uni-id-co");
          const res = await uniIdCo.getAccountInfo();
          hasPassword.value = (res == null ? void 0 : res.isPasswordSet) || false;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/profile/index.vue:625", "getAccountInfo failed", e);
        }
      }
      const targetUrl = hasPassword.value ? "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd" : "/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd";
      common_vendor.index.navigateTo({
        url: targetUrl,
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
        }
      });
    }
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
      refreshCacheSize();
      if (!hasInitialized.value) {
        hasInitialized.value = true;
        hasPassword.value = false;
        loading.value = true;
        try {
          await loadUserInfo();
          await loadFamilyInfo();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/profile/index.vue:691", "profile onShow load failed", error);
        } finally {
          loading.value = false;
        }
      }
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
          d: "M 0 120 Q 187 90 375 120",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          d: "M 0 200 Q 187 170 375 200",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          viewBox: "0 0 375 280",
          preserveAspectRatio: "none"
        }),
        e: loading.value
      }, loading.value ? {} : common_vendor.e({
        f: userInfo.value.avatar
      }, userInfo.value.avatar ? {
        g: userInfo.value.avatar
      } : {
        h: common_vendor.t(avatarText.value)
      }, {
        i: common_vendor.t(userInfo.value.nickname || userInfo.value.username || "未设置昵称"),
        j: common_vendor.t(metaText.value)
      }), {
        k: statusBarHeight.value + "px",
        l: common_vendor.p({
          type: "person",
          size: "18",
          color: "#2D4334"
        }),
        m: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        n: common_vendor.o(goUserInfo, "bb"),
        o: common_vendor.p({
          type: "locked",
          size: "18",
          color: "#2D4334"
        }),
        p: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        q: common_vendor.o(goAccountSecurity, "79"),
        r: familyInfo.value.hasFamily
      }, familyInfo.value.hasFamily ? common_vendor.e({
        s: common_vendor.p({
          type: "home",
          size: "18",
          color: "#2D4334"
        }),
        t: common_vendor.t(familyInfo.value.name || "未命名家庭"),
        v: common_vendor.t(familyInfo.value.role === "admin" ? "Admin" : "Member"),
        w: common_vendor.f(displayMembers.value, (member, k0, i0) => {
          return {
            a: common_vendor.t(getMemberInitial(member)),
            b: member.user_id,
            c: member.role === "admin" ? 1 : ""
          };
        }),
        x: extraMemberCount.value > 0
      }, extraMemberCount.value > 0 ? {
        y: common_vendor.t(extraMemberCount.value)
      } : {}, {
        z: common_vendor.t(familyMembers.value.length),
        A: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        B: common_vendor.o(goFamilyManage, "56"),
        C: common_vendor.p({
          type: "paperclip",
          size: "18",
          color: "#2D4334"
        }),
        D: common_vendor.t(familyInfo.value.inviteCode || "—"),
        E: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        F: common_vendor.o(copyInviteCode, "a0"),
        G: familyInfo.value.role !== "admin"
      }, familyInfo.value.role !== "admin" ? {
        H: common_vendor.p({
          type: "redo",
          size: "18",
          color: "#B85C3A"
        }),
        I: common_vendor.o(confirmLeaveFamily, "c4")
      } : {
        J: common_vendor.p({
          type: "staff",
          size: "18",
          color: "#2D4334"
        }),
        K: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        L: common_vendor.o(showMemberManagement, "2e")
      }) : {
        M: common_vendor.p({
          type: "home",
          size: "22",
          color: "#2D4334"
        }),
        N: common_vendor.p({
          type: "right",
          size: "16",
          color: "#B8C4B0"
        }),
        O: common_vendor.o(goFamilyGuide, "a6")
      }, {
        P: common_vendor.p({
          type: "trash",
          size: "18",
          color: "#2D4334"
        }),
        Q: common_vendor.t(cacheSize.value),
        R: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        S: common_vendor.o(handleClearCache, "65"),
        T: common_vendor.p({
          type: "download",
          size: "18",
          color: "#2D4334"
        }),
        U: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        V: common_vendor.o(handleDataExport, "93"),
        W: common_vendor.p({
          type: "info",
          size: "18",
          color: "#2D4334"
        }),
        X: common_vendor.t(appVersion.value),
        Y: common_vendor.p({
          type: "right",
          size: "14",
          color: "#B8C4B0"
        }),
        Z: common_vendor.o(goAbout, "13"),
        aa: common_vendor.p({
          type: "undo",
          size: "16",
          color: "#B85C3A"
        }),
        ab: common_vendor.o(handleLogout, "97"),
        ac: common_vendor.t(appVersion.value),
        ad: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).profile
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
