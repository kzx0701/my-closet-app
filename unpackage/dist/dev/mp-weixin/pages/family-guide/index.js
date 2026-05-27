"use strict";
const common_vendor = require("../../common/vendor.js");
const common_services_auth = require("../../common/services/auth.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
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
        common_vendor.index.__f__("error", "at pages/family-guide/index.vue:121", "joinFamilyByInviteCode failed", error);
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
        a: common_vendor.o(handleCreateFamily, "7b"),
        b: common_vendor.o(handleJoinFamily, "a9"),
        c: common_vendor.o(handleSkip, "31"),
        d: showJoinForm.value
      }, showJoinForm.value ? {
        e: inviteCode.value,
        f: common_vendor.o(handleInviteCodeInput, "d9"),
        g: joining.value,
        h: common_vendor.o(submitJoinFamily, "33"),
        i: joining.value,
        j: common_vendor.o(cancelJoinFamily, "76")
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/family-guide/index.js.map
