"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = {
  __name: "ClothesEmptyState",
  emits: ["create"],
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => _ctx.$emit("create"), "52"),
        b: common_vendor.p({
          type: "primary",
          size: "small",
          shape: "circle",
          customStyle: "background: #314033; border-color: #314033;"
        }),
        c: common_vendor.p({
          mode: "list",
          text: "还没有衣物记录，先从最常穿的衣物开始整理",
          iconSize: 160
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesEmptyState.js.map
