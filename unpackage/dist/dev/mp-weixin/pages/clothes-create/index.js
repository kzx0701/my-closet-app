"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_utils_navHelper = require("../../common/utils/nav-helper.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
if (!Math) {
  (ScopeBadge + ImageUploader + ClothesBasicForm + ClothesClosetPicker)();
}
const ImageUploader = () => "../../common/components/ImageUploader.js";
const ScopeBadge = () => "../../components/ScopeBadge.js";
const ClothesBasicForm = () => "./components/ClothesBasicForm.js";
const ClothesClosetPicker = () => "./components/ClothesClosetPicker.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    var _a;
    const categoryOptions = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS;
    const colorOptions = common_constants_clothesOptions.CLOTHES_COLOR_OPTIONS;
    const seasonOptions = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS;
    const name = common_vendor.ref("");
    const category = common_vendor.ref(((_a = categoryOptions[0]) == null ? void 0 : _a.code) || "");
    const color = common_vendor.ref("");
    const season = common_vendor.ref("");
    const remark = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const closetId = common_vendor.ref("");
    const clothesId = common_vendor.ref("");
    const scopeType = common_vendor.ref("personal");
    const hasFamily = common_vendor.ref(false);
    const familyName = common_vendor.ref("");
    const closetOptions = common_vendor.ref([]);
    const submitting = common_vendor.ref(false);
    const statusBarHeight = common_vendor.ref(20);
    const remarkFocused = common_vendor.ref(false);
    const isEditMode = common_vendor.computed(() => Boolean(clothesId.value));
    const isFamilyScope = common_vendor.computed(() => scopeType.value === "family");
    const pageTitle = common_vendor.computed(() => isEditMode.value ? "编辑衣物" : "新增衣物");
    const pageDesc = common_vendor.computed(
      () => isEditMode.value ? "你可以继续调整衣物名称、分类、季节和所属衣橱。" : "上传一张衣物照片，填写基础信息。"
    );
    const submitButtonText = common_vendor.computed(() => isEditMode.value ? "保存修改" : "保存衣物");
    async function loadClosetOptions() {
      try {
        const result = isFamilyScope.value ? await common_api_modules_closet.getFamilyClosetList({ pageSize: 100 }) : await common_api_modules_closet.getPersonalClosetList({ pageSize: 100 });
        closetOptions.value = (result == null ? void 0 : result.list) || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:159", "loadClosetOptions failed", error);
        closetOptions.value = [];
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣橱加载失败",
          icon: "none"
        });
      }
    }
    function changeScopeType(nextScopeType) {
      if (nextScopeType === scopeType.value)
        return;
      if (nextScopeType === "family" && !hasFamily.value)
        return;
      scopeType.value = nextScopeType;
      closetId.value = "";
      loadClosetOptions();
    }
    async function loadClothesDetail(targetClothesId) {
      const result = await common_api_modules_clothes.getClothesDetail({ clothesId: targetClothesId });
      const clothes = result == null ? void 0 : result.clothes;
      if (!clothes) {
        throw new Error("衣物详情不存在");
      }
      scopeType.value = clothes.scope_type === "family" ? "family" : "personal";
      name.value = clothes.name || "";
      category.value = clothes.category || "";
      color.value = clothes.color || "";
      season.value = clothes.season || "";
      remark.value = clothes.remark || "";
      imageUrl.value = clothes.image_url || "";
      closetId.value = clothes.closet_id || "";
    }
    async function submitClothes() {
      if (!name.value.trim()) {
        common_vendor.index.showToast({ title: "请输入衣物名称", icon: "none" });
        return;
      }
      if (!category.value) {
        common_vendor.index.showToast({ title: "请选择衣物分类", icon: "none" });
        return;
      }
      if (!season.value) {
        common_vendor.index.showToast({ title: "请选择适用季节", icon: "none" });
        return;
      }
      if (submitting.value)
        return;
      submitting.value = true;
      try {
        if (isEditMode.value) {
          await common_api_modules_clothes.updateClothes({
            clothesId: clothesId.value,
            name: name.value.trim(),
            category: category.value,
            color: color.value,
            season: season.value,
            remark: remark.value.trim(),
            imageUrl: imageUrl.value,
            closetId: closetId.value
          });
        } else {
          await common_api_modules_clothes.createClothes({
            scopeType: scopeType.value,
            name: name.value.trim(),
            category: category.value,
            color: color.value,
            season: season.value,
            remark: remark.value.trim(),
            imageUrl: imageUrl.value,
            closetId: closetId.value
          });
        }
        common_vendor.index.showToast({
          title: isEditMode.value ? "衣物修改成功" : "衣物创建成功",
          icon: "success"
        });
        common_vendor.index.$emit("clothes:need-refresh");
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:251", "submitClothes failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || (isEditMode.value ? "衣物修改失败" : "衣物创建失败"),
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    }
    function goBack() {
      common_utils_navHelper.safeNavigateBack(common_constants_routes.ROUTES.clothes);
    }
    common_vendor.onLoad(async (options) => {
      var _a2;
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      scopeType.value = (options == null ? void 0 : options.scopeType) === "family" ? "family" : "personal";
      clothesId.value = String((options == null ? void 0 : options.clothesId) || "").trim();
      const session = common_services_auth.getCurrentSession();
      if (session == null ? void 0 : session.uid) {
        try {
          const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
          hasFamily.value = membership.status === "success" && membership.hasFamily;
          if (hasFamily.value) {
            familyName.value = ((_a2 = membership.familyRecord) == null ? void 0 : _a2.name) || "未命名家庭";
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:286", "loadFamilyStatus failed", e);
        }
      }
      if (clothesId.value) {
        try {
          await loadClothesDetail(clothesId.value);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:294", "loadClothesDetail failed", error);
          common_vendor.index.showToast({
            title: (error == null ? void 0 : error.message) || "衣物详情加载失败",
            icon: "none"
          });
        }
      }
      await loadClosetOptions();
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
        d: statusBarHeight.value + "px",
        e: common_vendor.p({
          text: "Add · 新增"
        }),
        f: common_vendor.t(pageTitle.value),
        g: common_vendor.t(pageDesc.value),
        h: !isEditMode.value
      }, !isEditMode.value ? common_vendor.e({
        i: scopeType.value === "personal" ? 1 : "",
        j: common_vendor.o(($event) => changeScopeType("personal"), "4e"),
        k: hasFamily.value
      }, hasFamily.value ? {
        l: common_vendor.t(familyName.value),
        m: scopeType.value === "family" ? 1 : "",
        n: common_vendor.o(($event) => changeScopeType("family"), "35")
      } : {}) : {}, {
        o: common_vendor.o(($event) => imageUrl.value = $event, "45"),
        p: common_vendor.p({
          season: season.value,
          imageUrl: imageUrl.value
        }),
        q: common_vendor.o(($event) => name.value = $event, "cf"),
        r: common_vendor.o(($event) => category.value = $event, "b7"),
        s: common_vendor.o(($event) => color.value = $event, "bf"),
        t: common_vendor.o(($event) => season.value = $event, "c7"),
        v: common_vendor.p({
          name: name.value,
          category: category.value,
          color: color.value,
          season: season.value,
          ["category-options"]: common_vendor.unref(categoryOptions),
          ["color-options"]: common_vendor.unref(colorOptions),
          ["season-options"]: common_vendor.unref(seasonOptions)
        }),
        w: common_vendor.o(($event) => closetId.value = $event, "6c"),
        x: common_vendor.p({
          options: closetOptions.value,
          modelValue: closetId.value
        }),
        y: remarkFocused.value ? 1 : "",
        z: remark.value,
        A: common_vendor.o(($event) => remarkFocused.value = true, "6c"),
        B: common_vendor.o(($event) => remarkFocused.value = false, "a5"),
        C: common_vendor.o(($event) => remark.value = $event.detail.value, "cf"),
        D: common_vendor.t(submitButtonText.value),
        E: submitting.value,
        F: submitting.value,
        G: common_vendor.o(submitClothes, "27")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b70609bb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes-create/index.js.map
