"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  (_easycom_u_button2 + _easycom_u_tag2)();
}
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
if (!Math) {
  (_easycom_u_button + _easycom_u_tag)();
}
const _sfc_main = {
  __name: "ClothesFilterBar",
  props: {
    filters: {
      type: Object,
      default() {
        return {
          closetId: "",
          category: "",
          season: ""
        };
      }
    },
    closetOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    categoryOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    seasonOptions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ["update:filters", "reset"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function updateFilter(key, value) {
      emit("update:filters", {
        ...props.filters,
        [key]: value
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => _ctx.$emit("reset"), "e2"),
        b: common_vendor.p({
          size: "mini",
          shape: "circle",
          customStyle: "background: #eef2eb; border: none; color: #6c786b;"
        }),
        c: common_vendor.o(($event) => updateFilter("closetId", ""), "7c"),
        d: common_vendor.p({
          text: "全部",
          type: __props.filters.closetId === "" ? "primary" : "info",
          plain: __props.filters.closetId !== "",
          shape: "circle",
          size: "mini",
          customStyle: __props.filters.closetId === "" ? "background: #314033; border-color: #314033;" : ""
        }),
        e: common_vendor.f(__props.closetOptions, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(($event) => updateFilter("closetId", item._id), item._id),
            c: "945118e2-2-" + i0,
            d: common_vendor.p({
              text: item.name,
              type: __props.filters.closetId === item._id ? "primary" : "info",
              plain: __props.filters.closetId !== item._id,
              shape: "circle",
              size: "mini",
              customStyle: __props.filters.closetId === item._id ? "background: #314033; border-color: #314033;" : ""
            })
          };
        }),
        f: common_vendor.o(($event) => updateFilter("category", ""), "24"),
        g: common_vendor.p({
          text: "全部",
          type: __props.filters.category === "" ? "primary" : "info",
          plain: __props.filters.category !== "",
          shape: "circle",
          size: "mini",
          customStyle: __props.filters.category === "" ? "background: #314033; border-color: #314033;" : ""
        }),
        h: common_vendor.f(__props.categoryOptions, (item, k0, i0) => {
          return {
            a: item.code,
            b: common_vendor.o(($event) => updateFilter("category", item.code), item.code),
            c: "945118e2-4-" + i0,
            d: common_vendor.p({
              text: item.name,
              type: __props.filters.category === item.code ? "primary" : "info",
              plain: __props.filters.category !== item.code,
              shape: "circle",
              size: "mini",
              customStyle: __props.filters.category === item.code ? "background: #314033; border-color: #314033;" : ""
            })
          };
        }),
        i: common_vendor.o(($event) => updateFilter("season", ""), "a1"),
        j: common_vendor.p({
          text: "全部",
          type: __props.filters.season === "" ? "primary" : "info",
          plain: __props.filters.season !== "",
          shape: "circle",
          size: "mini",
          customStyle: __props.filters.season === "" ? "background: #314033; border-color: #314033;" : ""
        }),
        k: common_vendor.f(__props.seasonOptions, (item, k0, i0) => {
          return {
            a: item.code,
            b: common_vendor.o(($event) => updateFilter("season", item.code), item.code),
            c: "945118e2-6-" + i0,
            d: common_vendor.p({
              text: item.name,
              type: __props.filters.season === item.code ? "primary" : "info",
              plain: __props.filters.season !== item.code,
              shape: "circle",
              size: "mini",
              customStyle: __props.filters.season === item.code ? "background: #314033; border-color: #314033;" : ""
            })
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesFilterBar.js.map
