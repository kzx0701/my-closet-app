"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_image2 + _easycom_u_tag2 + _easycom_u_cell2 + _easycom_u_icon2 + _easycom_u_cell_group2 + _easycom_u_button2)();
}
const _easycom_u_image = () => "../../node-modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_tag = () => "../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_image + _easycom_u_tag + _easycom_u_cell + _easycom_u_icon + _easycom_u_cell_group + _easycom_u_button + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
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
    const avatarText = common_vendor.computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || "";
      return name.charAt(0).toUpperCase() || "U";
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
        common_vendor.index.__f__("error", "at pages/profile/index.vue:192", "loadUserInfo failed", error);
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
        common_vendor.index.__f__("error", "at pages/profile/index.vue:231", "loadFamilyMembers failed", error);
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
    function goFamilyGuide() {
      common_vendor.index.navigateTo({ url: common_constants_routes.ROUTES.familyGuide });
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
            common_vendor.index.__f__("error", "at pages/profile/index.vue:274", "leaveFamily failed", error);
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
            common_vendor.index.__f__("error", "at pages/profile/index.vue:298", "removeFamilyMember failed", error);
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
      loadUserInfo();
      loadFamilyInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(avatarText.value),
        b: common_vendor.p({
          src: userInfo.value.avatar || "/static/userImg/default.png",
          width: "120rpx",
          height: "120rpx",
          shape: "circle",
          bgColor: "#edf1ea"
        }),
        c: common_vendor.t(userInfo.value.nickname || "未设置昵称"),
        d: common_vendor.t(userInfo.value.username || "未设置用户名"),
        e: familyInfo.value.hasFamily
      }, familyInfo.value.hasFamily ? {
        f: common_vendor.p({
          text: familyInfo.value.role === "admin" ? "管理员" : "成员",
          size: "mini",
          type: "success",
          plain: true
        }),
        g: common_vendor.p({
          title: "家庭名称",
          value: familyInfo.value.name,
          border: false
        }),
        h: common_vendor.t(familyInfo.value.inviteCode),
        i: common_vendor.o(copyInviteCode, "a8"),
        j: common_vendor.p({
          name: "file-text",
          color: "#314033",
          size: "36"
        }),
        k: common_vendor.p({
          title: "邀请码",
          border: false
        }),
        l: common_vendor.p({
          title: "成员数量",
          value: `${familyMembers.value.length} 人`,
          border: false
        }),
        m: common_vendor.p({
          border: false
        })
      } : {}, {
        n: familyInfo.value.hasFamily && familyMembers.value.length > 0
      }, familyInfo.value.hasFamily && familyMembers.value.length > 0 ? {
        o: common_vendor.f(familyMembers.value, (member, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getMemberInitial(member)),
            b: "13fe27b6-7-" + i0,
            c: common_vendor.p({
              src: member.avatar || "/static/userImg/default.png",
              width: "72rpx",
              height: "72rpx",
              shape: "circle",
              bgColor: "#edf1ea"
            }),
            d: common_vendor.t(member.nickname || member.username || "未设置"),
            e: common_vendor.t(member.role === "admin" ? "管理员" : "成员"),
            f: familyInfo.value.role === "admin" && member.user_id !== currentUserId.value
          }, familyInfo.value.role === "admin" && member.user_id !== currentUserId.value ? {
            g: common_vendor.o(($event) => confirmRemoveMember(member), member.user_id),
            h: "13fe27b6-8-" + i0,
            i: common_vendor.p({
              size: "mini",
              type: "error",
              plain: true
            })
          } : {}, {
            j: member.user_id
          });
        })
      } : {}, {
        p: familyInfo.value.hasFamily && familyInfo.value.role !== "admin"
      }, familyInfo.value.hasFamily && familyInfo.value.role !== "admin" ? {
        q: common_vendor.p({
          name: "reload",
          color: "#dd524d",
          size: "40"
        }),
        r: common_vendor.o(confirmLeaveFamily, "88"),
        s: common_vendor.p({
          title: "退出家庭",
          border: false
        }),
        t: common_vendor.p({
          border: false
        })
      } : {
        v: common_vendor.p({
          name: "account-fill",
          size: "48",
          color: "#909399"
        }),
        w: common_vendor.o(goFamilyGuide, "d5"),
        x: common_vendor.p({
          type: "primary",
          size: "small",
          customStyle: "background: #314033; border-color: #314033;"
        })
      }, {
        y: common_vendor.p({
          name: "account",
          color: "#314033",
          size: "40"
        }),
        z: common_vendor.o(goUserInfo, "8d"),
        A: common_vendor.p({
          title: "账号信息",
          isLink: true,
          border: false
        }),
        B: common_vendor.p({
          name: "list",
          color: "#314033",
          size: "40"
        }),
        C: common_vendor.o(goClosets, "fc"),
        D: common_vendor.p({
          title: "我的衣橱",
          isLink: true,
          border: false
        }),
        E: common_vendor.p({
          name: "tags",
          color: "#314033",
          size: "40"
        }),
        F: common_vendor.o(goClothes, "62"),
        G: common_vendor.p({
          title: "我的衣物",
          isLink: true,
          border: false
        }),
        H: common_vendor.p({
          border: false
        }),
        I: common_vendor.p({
          name: "reload",
          color: "#dd524d",
          size: "40"
        }),
        J: common_vendor.o(handleLogout, "38"),
        K: common_vendor.p({
          title: "退出登录",
          border: false
        }),
        L: common_vendor.p({
          border: false
        }),
        M: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).profile
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
