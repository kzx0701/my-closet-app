"use strict";
const common_vendor = require("../../common/vendor.js");
const common_services_auth = require("../../common/services/auth.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
if (!Math) {
  (ScopeBadge + FamilyCreateForm)();
}
const ScopeBadge = () => "../../components/ScopeBadge.js";
const FamilyCreateForm = () => "./components/FamilyCreateForm.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const familyName = common_vendor.ref("");
    const familyDescription = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const step = common_vendor.ref("editing");
    const createdFamilyName = common_vendor.ref("");
    const createdInviteCode = common_vendor.ref("");
    const creatorText = common_vendor.ref("我 · Admin");
    async function loadCreator() {
      try {
        const session = common_services_auth.getCurrentSession();
        if (!session.uid)
          return;
        const info = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if ((info == null ? void 0 : info.nickname) || (info == null ? void 0 : info.username)) {
          creatorText.value = `${info.nickname || info.username} · Admin`;
        }
      } catch (e) {
      }
    }
    loadCreator();
    async function handleSubmit() {
      var _a, _b;
      const normalizedName = familyName.value.trim();
      if (!normalizedName) {
        common_vendor.index.showToast({
          title: "请输入家庭名称",
          icon: "none"
        });
        return;
      }
      if (normalizedName.length < 2) {
        common_vendor.index.showToast({
          title: "家庭名称至少 2 个字",
          icon: "none"
        });
        return;
      }
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        const payload = { name: normalizedName };
        if (familyDescription.value.trim()) {
          payload.description = familyDescription.value.trim();
        }
        const result = await common_api_modules_family.createFamily(payload);
        const session = common_services_auth.getCurrentSession();
        if (session.uid) {
          common_services_familyGuideState.clearFamilyGuideSkipState(session.uid);
        }
        createdFamilyName.value = ((_a = result == null ? void 0 : result.family) == null ? void 0 : _a.name) || normalizedName;
        createdInviteCode.value = ((_b = result == null ? void 0 : result.family) == null ? void 0 : _b.invite_code) || "";
        step.value = "success";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/family-create/index.vue:145", "createFamily failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "创建家庭失败",
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    }
    function copyInviteCode() {
      if (!createdInviteCode.value) {
        common_vendor.index.showToast({
          title: "邀请码暂不可用",
          icon: "none"
        });
        return;
      }
      common_vendor.index.setClipboardData({
        data: createdInviteCode.value,
        success: () => {
          common_vendor.index.showToast({
            title: "邀请码已复制",
            icon: "success"
          });
        }
      });
    }
    function enterHome() {
      common_vendor.index.switchTab({
        url: common_constants_routes.ROUTES.home
      });
    }
    function goBack() {
      common_vendor.index.navigateBack({
        fail() {
          common_vendor.index.reLaunch({
            url: common_constants_routes.ROUTES.familyGuide
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M15 18l-6-6 6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        c: common_vendor.o(goBack, "88"),
        d: step.value === "editing"
      }, step.value === "editing" ? {
        e: common_vendor.p({
          text: "Family · 创建"
        }),
        f: common_vendor.o(handleSubmit, "19"),
        g: common_vendor.o(($event) => familyName.value = $event, "b7"),
        h: common_vendor.o(($event) => familyDescription.value = $event, "a8"),
        i: common_vendor.p({
          loading: submitting.value,
          modelValue: familyName.value,
          description: familyDescription.value
        }),
        j: submitting.value,
        k: common_vendor.o(handleSubmit, "45")
      } : {
        l: common_vendor.t(createdFamilyName.value),
        m: common_vendor.t(creatorText.value),
        n: common_vendor.t(createdInviteCode.value || "—"),
        o: common_vendor.o(copyInviteCode, "b4"),
        p: common_vendor.o(copyInviteCode, "27"),
        q: common_vendor.o(enterHome, "82")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8dea95b8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/family-create/index.js.map
