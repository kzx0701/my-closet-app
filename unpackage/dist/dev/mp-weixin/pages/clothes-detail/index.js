"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
const common_constants_routes = require("../../common/constants/routes.js");
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_loading_icon = () => "../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const clothes = common_vendor.ref(null);
    const clothesId = common_vendor.ref("");
    const needsRefresh = common_vendor.ref(false);
    const categoryName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS.find((item) => {
        var _a2;
        return item.code === ((_a2 = clothes.value) == null ? void 0 : _a2.category);
      })) == null ? void 0 : _a.name) || "";
    });
    const seasonName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS.find((item) => {
        var _a2;
        return item.code === ((_a2 = clothes.value) == null ? void 0 : _a2.season);
      })) == null ? void 0 : _a.name) || "";
    });
    const closetName = common_vendor.computed(() => {
      var _a;
      return ((_a = clothes.value) == null ? void 0 : _a.closet_name) || "";
    });
    async function loadDetail() {
      if (!clothesId.value)
        return;
      try {
        const result = await common_api_modules_clothes.getClothesDetail({ clothesId: clothesId.value });
        clothes.value = (result == null ? void 0 : result.clothes) || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes-detail/index.vue:104", "loadClothesDetail failed", error);
        clothes.value = null;
      }
    }
    function formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    function previewImage() {
      var _a;
      if ((_a = clothes.value) == null ? void 0 : _a.image_url) {
        common_vendor.index.previewImage({
          urls: [clothes.value.image_url],
          current: clothes.value.image_url
        });
      }
    }
    function goEdit() {
      needsRefresh.value = true;
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesEdit}?clothesId=${clothesId.value}`
      });
    }
    function confirmDelete() {
      common_vendor.index.showModal({
        title: "删除衣物",
        content: "删除后这条衣物记录会被移出当前列表，是否继续？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_clothes.deleteClothes({ clothesId: clothesId.value });
            common_vendor.index.showToast({ title: "衣物已删除", icon: "success" });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 300);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/clothes-detail/index.vue:148", "deleteClothes failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "衣物删除失败",
              icon: "none"
            });
          }
        }
      });
    }
    common_vendor.onLoad((options) => {
      clothesId.value = String((options == null ? void 0 : options.clothesId) || "").trim();
    });
    common_vendor.onShow(async () => {
      if (!clothesId.value) {
        loading.value = false;
        return;
      }
      if (needsRefresh.value) {
        needsRefresh.value = false;
        await loadDetail();
      } else if (!clothes.value) {
        loading.value = true;
        await loadDetail();
        loading.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {
        b: common_vendor.p({
          mode: "circle"
        })
      } : clothes.value ? common_vendor.e({
        d: clothes.value.image_url
      }, clothes.value.image_url ? {
        e: clothes.value.image_url,
        f: common_vendor.o(previewImage, "03")
      } : {}, {
        g: common_vendor.p({
          text: categoryName.value,
          size: "mini",
          type: "primary",
          plain: true
        }),
        h: common_vendor.p({
          text: seasonName.value,
          size: "mini",
          type: "success",
          plain: true
        }),
        i: clothes.value.color
      }, clothes.value.color ? {
        j: common_vendor.p({
          text: clothes.value.color,
          size: "mini",
          type: "info",
          plain: true
        })
      } : {}, {
        k: common_vendor.t(clothes.value.name),
        l: common_vendor.t(closetName.value || "未绑定"),
        m: common_vendor.t(clothes.value.scope_type === "family" ? "家庭" : "个人"),
        n: clothes.value.scope_type === "family" && clothes.value.creator_name
      }, clothes.value.scope_type === "family" && clothes.value.creator_name ? {
        o: common_vendor.t(clothes.value.creator_name)
      } : {}, {
        p: common_vendor.t(formatTime(clothes.value.created_at)),
        q: clothes.value.remark
      }, clothes.value.remark ? {
        r: common_vendor.t(clothes.value.remark)
      } : {}, {
        s: common_vendor.o(goEdit, "4c"),
        t: common_vendor.p({
          type: "primary",
          shape: "circle",
          customStyle: "background: linear-gradient(135deg, #5a7351 0%, #738c67 100%); border: none;"
        }),
        v: common_vendor.o(confirmDelete, "6d"),
        w: common_vendor.p({
          type: "error",
          shape: "circle",
          plain: true
        })
      }) : {
        x: common_vendor.p({
          mode: "list",
          text: "衣物不存在或已删除"
        })
      }, {
        c: clothes.value
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes-detail/index.js.map
