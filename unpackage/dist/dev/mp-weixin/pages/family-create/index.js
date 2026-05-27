"use strict";
const common_vendor = require("../../common/vendor.js");
const common_services_auth = require("../../common/services/auth.js");
const common_api_modules_family = require("../../common/api/modules/family.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_familyGuideState = require("../../common/services/family-guide-state.js");
if (!Math) {
  FamilyCreateForm();
}
const FamilyCreateForm = () => "./components/FamilyCreateForm.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const NAME_SUGGESTIONS = ["温馨一家", "四季衣橱", "我们的家", "小家收纳站"];
    const familyName = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const step = common_vendor.ref("editing");
    const createdFamilyName = common_vendor.ref("");
    const createdInviteCode = common_vendor.ref("");
    const nameSuggestions = common_vendor.ref(NAME_SUGGESTIONS);
    const helperText = common_vendor.computed(() => {
      const normalizedName = familyName.value.trim();
      if (!normalizedName) {
        return "建议用一个全家人都容易识别的名称，比如家庭昵称、住处名或收纳主题。";
      }
      if (normalizedName.length < 2) {
        return "名称再具体一点会更好，方便家人快速识别。";
      }
      if (normalizedName.length > 24) {
        return "名称有点长，适当精简后在家庭列表里会更清晰。";
      }
      return "这个名称看起来不错，创建后你还会拿到一个可分享的邀请码。";
    });
    function applySuggestion(name) {
      familyName.value = name;
    }
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
        const result = await common_api_modules_family.createFamily({
          name: normalizedName
        });
        const session = common_services_auth.getCurrentSession();
        if (session.uid) {
          common_services_familyGuideState.clearFamilyGuideSkipState(session.uid);
        }
        createdFamilyName.value = ((_a = result == null ? void 0 : result.family) == null ? void 0 : _a.name) || normalizedName;
        createdInviteCode.value = ((_b = result == null ? void 0 : result.family) == null ? void 0 : _b.invite_code) || "";
        step.value = "success";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/family-create/index.vue:124", "createFamily failed", error);
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: step.value === "editing"
      }, step.value === "editing" ? {} : {}, {
        b: step.value === "editing"
      }, step.value === "editing" ? {
        c: common_vendor.o(applySuggestion, "fb"),
        d: common_vendor.o(handleSubmit, "77"),
        e: common_vendor.o(($event) => familyName.value = $event, "c2"),
        f: common_vendor.p({
          loading: submitting.value,
          suggestions: nameSuggestions.value,
          ["helper-text"]: helperText.value,
          modelValue: familyName.value
        })
      } : {
        g: common_vendor.t(createdFamilyName.value),
        h: common_vendor.t(createdInviteCode.value),
        i: common_vendor.o(copyInviteCode, "e1"),
        j: common_vendor.o(enterHome, "67")
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/family-create/index.js.map
