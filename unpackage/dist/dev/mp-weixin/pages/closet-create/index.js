"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_closetOptions = require("../../common/constants/closet-options.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_utils_navHelper = require("../../common/utils/nav-helper.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
if (!Math) {
  (ScopeBadge + ClosetStylePicker + ClosetColorPicker + ClosetBasicForm)();
}
const ScopeBadge = () => "../../components/ScopeBadge.js";
const ClosetBasicForm = () => "./components/ClosetBasicForm.js";
const ClosetColorPicker = () => "./components/ClosetColorPicker.js";
const ClosetStylePicker = () => "./components/ClosetStylePicker.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    var _a, _b;
    const styleOptions = common_constants_closetOptions.CLOSET_STYLE_OPTIONS;
    const colorOptions = common_constants_closetOptions.CLOSET_COLOR_OPTIONS;
    const styleCode = common_vendor.ref(((_a = styleOptions[0]) == null ? void 0 : _a.code) || "");
    const colorCode = common_vendor.ref(((_b = colorOptions[0]) == null ? void 0 : _b.code) || "");
    const name = common_vendor.ref("");
    const roomName = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const scopeType = common_vendor.ref("personal");
    const closetId = common_vendor.ref("");
    const familyName = common_vendor.ref("");
    const statusBarHeight = common_vendor.ref(20);
    const nameFocused = common_vendor.ref(false);
    const isEditMode = common_vendor.computed(() => Boolean(closetId.value));
    const pageTitle = common_vendor.computed(() => isEditMode.value ? "编辑衣橱" : "新建衣橱");
    const pageDesc = common_vendor.computed(
      () => isEditMode.value ? "你可以继续调整衣橱样式、配色、名称和房间信息。" : "选择样式与配色，记录衣橱所在房间。"
    );
    const submitButtonText = common_vendor.computed(() => isEditMode.value ? "保存修改" : "创建衣橱");
    async function loadFamilyName() {
      var _a2;
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      try {
        const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
        if (membership.status === "success" && membership.hasFamily) {
          familyName.value = ((_a2 = membership.familyRecord) == null ? void 0 : _a2.name) || "家庭空间";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/closet-create/index.vue:133", "loadFamilyName failed", error);
      }
    }
    async function loadClosetDetail(targetClosetId) {
      var _a2, _b2;
      const result = await common_api_modules_closet.getClosetDetail({
        closetId: targetClosetId
      });
      const closet = result == null ? void 0 : result.closet;
      if (!closet) {
        throw new Error("衣橱详情不存在");
      }
      scopeType.value = closet.scope_type === "family" ? "family" : "personal";
      styleCode.value = closet.style_code || ((_a2 = styleOptions[0]) == null ? void 0 : _a2.code) || "";
      colorCode.value = closet.color_code || ((_b2 = colorOptions[0]) == null ? void 0 : _b2.code) || "";
      name.value = closet.name || "";
      roomName.value = closet.room_name || "";
    }
    async function submitCloset() {
      if (!name.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入衣橱名称",
          icon: "none"
        });
        return;
      }
      if (!styleCode.value) {
        common_vendor.index.showToast({
          title: "请选择衣橱样式",
          icon: "none"
        });
        return;
      }
      if (!colorCode.value) {
        common_vendor.index.showToast({
          title: "请选择衣橱颜色",
          icon: "none"
        });
        return;
      }
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        if (isEditMode.value) {
          await common_api_modules_closet.updateCloset({
            closetId: closetId.value,
            name: name.value.trim(),
            roomName: roomName.value.trim(),
            styleCode: styleCode.value,
            colorCode: colorCode.value
          });
        } else {
          await common_api_modules_closet.createCloset({
            scopeType: scopeType.value,
            name: name.value.trim(),
            roomName: roomName.value.trim(),
            styleCode: styleCode.value,
            colorCode: colorCode.value
          });
        }
        common_vendor.index.showToast({
          title: isEditMode.value ? "衣橱修改成功" : "衣橱创建成功",
          icon: "success"
        });
        common_vendor.index.$emit("closets:need-refresh");
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/closet-create/index.vue:216", "createCloset failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣橱创建失败",
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    }
    function goBack() {
      common_utils_navHelper.safeNavigateBack(common_constants_routes.ROUTES.closets);
    }
    function handleDelete() {
      if (!closetId.value)
        return;
      common_vendor.index.showModal({
        title: "删除衣橱",
        content: "删除后衣橱内衣物的归属信息将被清除，是否继续？",
        confirmColor: "#b85c3a",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_closet.deleteCloset({ closetId: closetId.value });
            common_vendor.index.showToast({ title: "衣橱已删除", icon: "success" });
            common_vendor.index.$emit("closets:need-refresh");
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 300);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/closet-create/index.vue:249", "deleteCloset failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "删除失败",
              icon: "none"
            });
          }
        }
      });
    }
    common_vendor.onLoad((options) => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      scopeType.value = (options == null ? void 0 : options.scopeType) === "family" ? "family" : "personal";
      closetId.value = String((options == null ? void 0 : options.closetId) || "").trim();
      const presetName = String((options == null ? void 0 : options.name) || "").trim();
      if (presetName && !closetId.value) {
        name.value = presetName;
      }
      loadFamilyName();
      if (closetId.value) {
        loadClosetDetail(closetId.value).catch((error) => {
          common_vendor.index.__f__("error", "at pages/closet-create/index.vue:279", "loadClosetDetail failed", error);
          common_vendor.index.showToast({
            title: (error == null ? void 0 : error.message) || "衣橱详情加载失败",
            icon: "none"
          });
        });
      }
    });
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
        c: common_vendor.o(goBack, "e6"),
        d: common_vendor.t(pageTitle.value),
        e: statusBarHeight.value + "px",
        f: common_vendor.p({
          text: "Add · 新建衣橱"
        }),
        g: common_vendor.t(pageTitle.value),
        h: common_vendor.t(pageDesc.value),
        i: nameFocused.value ? 1 : "",
        j: name.value,
        k: common_vendor.o(($event) => nameFocused.value = true, "27"),
        l: common_vendor.o(($event) => nameFocused.value = false, "0e"),
        m: common_vendor.o(($event) => name.value = $event.detail.value, "36"),
        n: common_vendor.o(($event) => styleCode.value = $event, "1d"),
        o: common_vendor.p({
          options: common_vendor.unref(styleOptions),
          modelValue: styleCode.value
        }),
        p: common_vendor.o(($event) => colorCode.value = $event, "ba"),
        q: common_vendor.p({
          options: common_vendor.unref(colorOptions),
          modelValue: colorCode.value
        }),
        r: common_vendor.o(($event) => roomName.value = $event, "8e"),
        s: common_vendor.o(($event) => scopeType.value = $event, "ec"),
        t: common_vendor.p({
          ["room-name"]: roomName.value,
          ["scope-type"]: scopeType.value,
          ["family-name"]: familyName.value,
          ["hide-scope"]: isEditMode.value
        }),
        v: common_vendor.t(submitButtonText.value),
        w: isEditMode.value ? 1 : "",
        x: submitting.value,
        y: submitting.value,
        z: common_vendor.o(submitCloset, "df"),
        A: isEditMode.value
      }, isEditMode.value ? {
        B: submitting.value,
        C: common_vendor.o(handleDelete, "53")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1e56e140"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closet-create/index.js.map
