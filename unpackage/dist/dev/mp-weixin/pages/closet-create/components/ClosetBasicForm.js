"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  (_easycom_u_input2 + _easycom_u_textarea2)();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_textarea = () => "../../../node-modules/uview-plus/components/u-textarea/u-textarea.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_textarea)();
}
const _sfc_main = {
  __name: "ClosetBasicForm",
  props: {
    name: {
      type: String,
      default: ""
    },
    roomName: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  emits: ["update:name", "update:roomName", "update:description"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("update:name", $event), "d8"),
        b: common_vendor.p({
          value: __props.name,
          maxlength: "30",
          placeholder: "例如：主卧大衣柜",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        c: common_vendor.o(($event) => emit("update:roomName", $event), "ef"),
        d: common_vendor.p({
          value: __props.roomName,
          maxlength: "30",
          placeholder: "例如：主卧、次卧、客房",
          shape: "circle",
          bgColor: "#f2f5ef",
          customStyle: {
            padding: "0 24rpx"
          }
        }),
        e: common_vendor.o(($event) => emit("update:description", $event), "3f"),
        f: common_vendor.p({
          value: __props.description,
          maxlength: "200",
          placeholder: "可以补充这个衣橱的用途或收纳特点",
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
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetBasicForm.js.map
