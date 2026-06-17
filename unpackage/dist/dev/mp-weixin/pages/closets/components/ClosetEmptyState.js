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
  __name: "ClosetEmptyState",
  props: {
    scopeType: {
      type: String,
      default: "personal"
    },
    canCreate: {
      type: Boolean,
      default: true
    }
  },
  emits: ["create"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const descText = common_vendor.computed(() => {
      if (props.scopeType === "family") {
        return "当前家庭空间还没有衣橱，现在就可以先创建一个";
      }
      return "先创建一个属于你的衣橱，可以按房间、季节或使用场景来整理";
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.canCreate
      }, __props.canCreate ? {
        b: common_vendor.o(($event) => emit("create"), "55"),
        c: common_vendor.p({
          type: "primary",
          size: "small",
          shape: "circle",
          customStyle: "background: $color-primary; border-color: $color-primary;"
        })
      } : {}, {
        d: common_vendor.p({
          mode: "list",
          text: descText.value,
          iconSize: 160
        })
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetEmptyState.js.map
