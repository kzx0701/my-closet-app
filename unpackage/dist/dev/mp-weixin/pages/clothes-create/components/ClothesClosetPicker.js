"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  (_easycom_u_icon2 + _easycom_u_cell2 + _easycom_u_cell_group2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_cell = () => "../../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_cell + _easycom_u_cell_group)();
}
const _sfc_main = {
  __name: "ClothesClosetPicker",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.modelValue === ""
      }, __props.modelValue === "" ? {
        b: common_vendor.p({
          name: "checkmark-circle-fill",
          color: "$color-primary",
          size: "40"
        })
      } : {}, {
        c: common_vendor.o(($event) => emit("update:modelValue", ""), "f1"),
        d: common_vendor.p({
          title: "暂不绑定衣橱",
          border: false,
          customStyle: __props.modelValue === "" ? "background: $color-bg-chip-active; border-radius: $radius-sm;" : ""
        }),
        e: common_vendor.f(__props.options, (item, k0, i0) => {
          return common_vendor.e({
            a: __props.modelValue === item._id
          }, __props.modelValue === item._id ? {
            b: "47f893f1-4-" + i0 + "," + ("47f893f1-3-" + i0),
            c: common_vendor.p({
              name: "checkmark-circle-fill",
              color: "$color-primary",
              size: "40"
            })
          } : {}, {
            d: item._id,
            e: common_vendor.o(($event) => emit("update:modelValue", item._id), item._id),
            f: "47f893f1-3-" + i0 + ",47f893f1-0",
            g: common_vendor.p({
              title: item.name,
              border: false,
              customStyle: __props.modelValue === item._id ? "background: $color-bg-chip-active; border-radius: $radius-sm;" : ""
            })
          });
        }),
        f: common_vendor.p({
          border: false,
          customStyle: "margin-top: 22rpx;"
        })
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes-create/components/ClothesClosetPicker.js.map
