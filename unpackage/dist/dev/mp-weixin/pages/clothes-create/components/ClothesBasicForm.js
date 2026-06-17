"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  (_easycom_u_input2 + _easycom_u_tag2 + _easycom_u_textarea2)();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_textarea = () => "../../../node-modules/uview-plus/components/u-textarea/u-textarea.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_tag + _easycom_u_textarea)();
}
const _sfc_main = {
  __name: "ClothesBasicForm",
  props: {
    name: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: ""
    },
    season: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    remark: {
      type: String,
      default: ""
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
  emits: ["update:name", "update:category", "update:season", "update:color", "update:remark"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:name", $event), "a5"),
        b: common_vendor.p({
          value: __props.name,
          maxlength: "50",
          placeholder: "例如：米白色针织衫",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        c: common_vendor.f(__props.categoryOptions, (item, k0, i0) => {
          return {
            a: item.code,
            b: common_vendor.o(($event) => emit("update:category", item.code), item.code),
            c: "7c5ad0db-1-" + i0,
            d: common_vendor.p({
              text: item.name,
              type: __props.category === item.code ? "primary" : "info",
              plain: __props.category !== item.code,
              shape: "circle",
              size: "mini",
              customStyle: __props.category === item.code ? "background: $color-primary; border-color: $color-primary;" : ""
            })
          };
        }),
        d: common_vendor.f(__props.seasonOptions, (item, k0, i0) => {
          return {
            a: item.code,
            b: common_vendor.o(($event) => emit("update:season", item.code), item.code),
            c: "7c5ad0db-2-" + i0,
            d: common_vendor.p({
              text: item.name,
              type: __props.season === item.code ? "primary" : "info",
              plain: __props.season !== item.code,
              shape: "circle",
              size: "mini",
              customStyle: __props.season === item.code ? "background: $color-primary; border-color: $color-primary;" : ""
            })
          };
        }),
        e: common_vendor.o(($event) => emit("update:color", $event), "70"),
        f: common_vendor.p({
          value: __props.color,
          maxlength: "20",
          placeholder: "例如：米白、深蓝、灰黑",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        g: common_vendor.o(($event) => emit("update:remark", $event), "a0"),
        h: common_vendor.p({
          value: __props.remark,
          maxlength: "500",
          placeholder: "可以补充材质、穿着场景或收纳提醒",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "22rpx 24rpx",
            minHeight: "180rpx"
          }
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes-create/components/ClothesBasicForm.js.map
