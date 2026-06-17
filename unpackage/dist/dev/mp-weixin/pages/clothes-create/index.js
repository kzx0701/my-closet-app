"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (ImageUploader + ClothesBasicForm + ClothesClosetPicker + _easycom_u_button)();
}
const ImageUploader = () => "../../common/components/ImageUploader.js";
const ClothesBasicForm = () => "./components/ClothesBasicForm.js";
const ClothesClosetPicker = () => "./components/ClothesClosetPicker.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    var _a, _b;
    const categoryOptions = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS;
    const seasonOptions = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS;
    const name = common_vendor.ref("");
    const category = common_vendor.ref(((_a = categoryOptions[0]) == null ? void 0 : _a.code) || "");
    const season = common_vendor.ref(((_b = seasonOptions[0]) == null ? void 0 : _b.code) || "");
    const color = common_vendor.ref("");
    const remark = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const closetId = common_vendor.ref("");
    const clothesId = common_vendor.ref("");
    const scopeType = common_vendor.ref("personal");
    const closetOptions = common_vendor.ref([]);
    const submitting = common_vendor.ref(false);
    const isEditMode = common_vendor.computed(() => Boolean(clothesId.value));
    const isFamilyScope = common_vendor.computed(() => scopeType.value === "family");
    const pageEyebrow = common_vendor.computed(() => isEditMode.value ? "EDIT CLOTHES" : "CREATE CLOTHES");
    const pageTitle = common_vendor.computed(() => {
      if (isEditMode.value) {
        return isFamilyScope.value ? "编辑家庭衣物" : "编辑个人衣物";
      }
      return isFamilyScope.value ? "新增家庭衣物" : "新增个人衣物";
    });
    const pageDesc = common_vendor.computed(
      () => isEditMode.value ? "你可以继续调整衣物名称、分类、季节和所属衣橱。" : isFamilyScope.value ? "为当前家庭空间新增一件衣物，后续家庭成员可以一起查看和管理。" : "先把个人空间的基础衣物记录跑通，支持可选绑定个人衣橱。"
    );
    const submitButtonText = common_vendor.computed(() => isEditMode.value ? "保存修改" : "创建衣物");
    async function loadClosetOptions() {
      try {
        const result = isFamilyScope.value ? await common_api_modules_closet.getFamilyClosetList({ pageSize: 100 }) : await common_api_modules_closet.getPersonalClosetList({ pageSize: 100 });
        closetOptions.value = (result == null ? void 0 : result.list) || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:89", "loadClosetOptions failed", error);
        closetOptions.value = [];
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣橱加载失败",
          icon: "none"
        });
      }
    }
    async function loadClothesDetail(targetClothesId) {
      var _a2, _b2;
      const result = await common_api_modules_clothes.getClothesDetail({ clothesId: targetClothesId });
      const clothes = result == null ? void 0 : result.clothes;
      if (!clothes) {
        throw new Error("衣物详情不存在");
      }
      scopeType.value = clothes.scope_type === "family" ? "family" : "personal";
      name.value = clothes.name || "";
      category.value = clothes.category || ((_a2 = categoryOptions[0]) == null ? void 0 : _a2.code) || "";
      season.value = clothes.season || ((_b2 = seasonOptions[0]) == null ? void 0 : _b2.code) || "";
      color.value = clothes.color || "";
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
            season: season.value,
            color: color.value.trim(),
            remark: remark.value.trim(),
            imageUrl: imageUrl.value,
            closetId: closetId.value
          });
        } else {
          await common_api_modules_clothes.createClothes({
            scopeType: scopeType.value,
            name: name.value.trim(),
            category: category.value,
            season: season.value,
            color: color.value.trim(),
            remark: remark.value.trim(),
            imageUrl: imageUrl.value,
            closetId: closetId.value
          });
        }
        common_vendor.index.showToast({
          title: isEditMode.value ? "衣物修改成功" : "衣物创建成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:170", "submitClothes failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || (isEditMode.value ? "衣物修改失败" : "衣物创建失败"),
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    }
    common_vendor.onLoad(async (options) => {
      scopeType.value = (options == null ? void 0 : options.scopeType) === "family" ? "family" : "personal";
      clothesId.value = String((options == null ? void 0 : options.clothesId) || "").trim();
      await loadClosetOptions();
      if (clothesId.value) {
        loadClothesDetail(clothesId.value).catch((error) => {
          common_vendor.index.__f__("error", "at pages/clothes-create/index.vue:188", "loadClothesDetail failed", error);
          common_vendor.index.showToast({
            title: (error == null ? void 0 : error.message) || "衣物详情加载失败",
            icon: "none"
          });
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(pageEyebrow.value),
        b: common_vendor.t(pageTitle.value),
        c: common_vendor.t(pageDesc.value),
        d: common_vendor.o(($event) => imageUrl.value = $event, "94"),
        e: common_vendor.p({
          imageUrl: imageUrl.value
        }),
        f: common_vendor.o(($event) => name.value = $event, "85"),
        g: common_vendor.o(($event) => category.value = $event, "1e"),
        h: common_vendor.o(($event) => season.value = $event, "a9"),
        i: common_vendor.o(($event) => color.value = $event, "8f"),
        j: common_vendor.o(($event) => remark.value = $event, "01"),
        k: common_vendor.p({
          name: name.value,
          category: category.value,
          season: season.value,
          color: color.value,
          remark: remark.value,
          ["category-options"]: common_vendor.unref(categoryOptions),
          ["season-options"]: common_vendor.unref(seasonOptions)
        }),
        l: common_vendor.o(($event) => closetId.value = $event, "fe"),
        m: common_vendor.p({
          options: closetOptions.value,
          modelValue: closetId.value
        }),
        n: common_vendor.t(submitButtonText.value),
        o: common_vendor.o(submitClothes, "50"),
        p: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: submitting.value,
          customStyle: "margin-top: 34rpx; background: $gradient-button; border: none;"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes-create/index.js.map
