"use strict";
const common_vendor = require("../../common/vendor.js");
const common_services_auth = require("../../common/services/auth.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
if (!Math) {
  (GuideHero + GuideActions)();
}
const GuideActions = () => "./components/GuideActions.js";
const GuideHero = () => "./components/GuideHero.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const showJoinForm = common_vendor.ref(false);
    const inviteCode = common_vendor.ref("");
    const joining = common_vendor.ref(false);
    const statusBarHeight = common_vendor.ref(20);
    function goBack() {
      common_vendor.index.navigateBack({
        fail() {
          common_vendor.index.reLaunch({ url: common_constants_routes.ROUTES.home });
        }
      });
    }
    common_vendor.onLoad(() => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
    });
    function handleCreateFamily() {
      common_vendor.index.navigateTo({
        url: common_constants_routes.ROUTES.familyCreate
      });
    }
    function handleJoinFamily() {
      showJoinForm.value = true;
    }
    function handleSkip() {
      const session = common_services_auth.getCurrentSession();
      if (session.uid) {
        common_services_familyGuideState.setFamilyGuideSkipState(session.uid, true);
      }
      common_vendor.index.switchTab({
        url: common_constants_routes.ROUTES.home
      });
    }
    function handleInviteCodeInput(event) {
      inviteCode.value = String(event.detail.value || "").toUpperCase();
    }
    function cancelJoinFamily() {
      if (joining.value) {
        return;
      }
      showJoinForm.value = false;
      inviteCode.value = "";
    }
    async function submitJoinFamily() {
      const normalizedInviteCode = inviteCode.value.trim().toUpperCase();
      if (!normalizedInviteCode) {
        common_vendor.index.showToast({
          title: "请输入邀请码",
          icon: "none"
        });
        return;
      }
      if (joining.value) {
        return;
      }
      joining.value = true;
      try {
        await common_api_modules_family.joinFamilyByInviteCode({
          inviteCode: normalizedInviteCode
        });
        const session = common_services_auth.getCurrentSession();
        if (session.uid) {
          common_services_familyGuideState.clearFamilyGuideSkipState(session.uid);
        }
        common_vendor.index.showToast({
          title: "加入家庭成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: common_constants_routes.ROUTES.home
          });
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/family-guide/index.vue:160", "joinFamilyByInviteCode failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "加入家庭失败",
          icon: "none"
        });
      } finally {
        joining.value = false;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M15 18l-6-6 6-6"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        c: common_vendor.o(goBack, "b3"),
        d: statusBarHeight.value + "px",
        e: common_vendor.o(handleCreateFamily, "ea"),
        f: common_vendor.o(handleJoinFamily, "d4"),
        g: common_vendor.o(handleSkip, "68"),
        h: showJoinForm.value
      }, showJoinForm.value ? {
        i: common_vendor.o(cancelJoinFamily, "fe"),
        j: inviteCode.value,
        k: common_vendor.o(handleInviteCodeInput, "2e"),
        l: joining.value,
        m: common_vendor.o(cancelJoinFamily, "80"),
        n: joining.value,
        o: common_vendor.o(submitJoinFamily, "92"),
        p: common_vendor.o(() => {
        }, "ba"),
        q: common_vendor.o(cancelJoinFamily, "ae")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d7fa870b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/family-guide/index.js.map
