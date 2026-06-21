"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_clothesOptions = require("../../../common/constants/clothes-options.js");
const common_constants_routes = require("../../../common/constants/routes.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "ClothesListCard",
  props: {
    clothes: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(__props) {
    const props = __props;
    const imageError = common_vendor.ref(false);
    common_vendor.watch(
      () => props.clothes.image_url,
      () => {
        imageError.value = false;
      }
    );
    function onImageError() {
      imageError.value = true;
    }
    const categoryName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === props.clothes.category)) == null ? void 0 : _a.name) || "未分类";
    });
    const seasonName = common_vendor.computed(() => {
      const codes = String(props.clothes.season || "").split(",").map((item) => item.trim()).filter(Boolean);
      if (!codes.length)
        return "";
      return codes.map((code) => {
        var _a;
        return ((_a = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)) == null ? void 0 : _a.name) || code;
      }).join("/");
    });
    const seasonClass = common_vendor.computed(() => {
      const codes = String(props.clothes.season || "").split(",").map((item) => item.trim()).filter(Boolean);
      const code = codes[0] || "all-season";
      return `season-${code}`;
    });
    const colorOption = common_vendor.computed(() => {
      const code = props.clothes.color;
      if (!code)
        return null;
      return common_constants_clothesOptions.CLOTHES_COLOR_OPTIONS.find((item) => item.code === code) || null;
    });
    const colorHex = common_vendor.computed(() => {
      var _a;
      return ((_a = colorOption.value) == null ? void 0 : _a.hex) || "";
    });
    const isMulticolor = common_vendor.computed(() => {
      var _a;
      return ((_a = colorOption.value) == null ? void 0 : _a.code) === "multicolor";
    });
    const colorDotStyle = common_vendor.computed(() => {
      if (!colorHex.value)
        return {};
      return { background: colorHex.value };
    });
    const subtitle = common_vendor.computed(() => {
      const parts = [categoryName.value];
      if (seasonName.value)
        parts.push(seasonName.value);
      return parts.join(" · ");
    });
    function goDetail() {
      var _a;
      const targetId = (_a = props.clothes) == null ? void 0 : _a._id;
      if (!targetId)
        return;
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesDetail}?clothesId=${targetId}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.clothes.image_url && !imageError.value
      }, __props.clothes.image_url && !imageError.value ? {
        b: __props.clothes.image_url,
        c: common_vendor.o(onImageError, "25")
      } : {
        d: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        e: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      }, {
        f: common_vendor.n(seasonClass.value),
        g: common_vendor.t(__props.clothes.name),
        h: colorHex.value
      }, colorHex.value ? {
        i: isMulticolor.value ? 1 : "",
        j: common_vendor.s(colorDotStyle.value)
      } : {}, {
        k: common_vendor.t(subtitle.value),
        l: common_vendor.o(goDetail, "00")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dc245d51"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesListCard.js.map
