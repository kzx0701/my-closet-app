"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "HomeQuickActions",
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.items, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: common_vendor.t(item.tag || "待接入"),
            d: item.title,
            e: common_vendor.o(($event) => emit("select", item), item.title)
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/home/components/HomeQuickActions.js.map
