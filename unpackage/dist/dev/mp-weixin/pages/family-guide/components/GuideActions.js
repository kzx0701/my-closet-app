"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "GuideActions",
  emits: ["create-family", "join-family", "skip"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emit("create-family"), "77"),
        b: common_vendor.o(($event) => emit("join-family"), "50"),
        c: common_vendor.o(($event) => emit("skip"), "37")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/family-guide/components/GuideActions.js.map
