"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_clothesOptions = require("../../../common/constants/clothes-options.js");
const _sfc_main = {
  __name: "ClothesFilterBar",
  props: {
    activeCategory: {
      type: String,
      default: "all"
    },
    activeSeason: {
      type: String,
      default: "all"
    }
  },
  emits: ["update:activeCategory", "update:activeSeason"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const categoryOptions = [
      { code: "all", name: "全部" },
      ...common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS
    ];
    const seasonOptions = [
      { code: "all", name: "全部季节" },
      ...common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS
    ];
    function selectCategory(code) {
      if (code === props.activeCategory)
        return;
      emit("update:activeCategory", code);
    }
    function selectSeason(code) {
      if (code === props.activeSeason)
        return;
      emit("update:activeSeason", code);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(categoryOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.code,
            c: __props.activeCategory === item.code ? 1 : "",
            d: common_vendor.o(($event) => selectCategory(item.code), item.code)
          };
        }),
        b: common_vendor.f(seasonOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.code,
            c: __props.activeSeason === item.code ? 1 : "",
            d: common_vendor.o(($event) => selectSeason(item.code), item.code)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-28054c8c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesFilterBar.js.map
