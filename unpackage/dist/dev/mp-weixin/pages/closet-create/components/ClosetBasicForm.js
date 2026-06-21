"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ClosetBasicForm",
  props: {
    roomName: {
      type: String,
      default: ""
    },
    scopeType: {
      type: String,
      default: "personal"
    },
    familyName: {
      type: String,
      default: ""
    },
    hideScope: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:roomName", "update:scopeType"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const roomFocused = common_vendor.ref(false);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: roomFocused.value ? 1 : "",
        b: __props.roomName,
        c: common_vendor.o(($event) => roomFocused.value = true, "6c"),
        d: common_vendor.o(($event) => roomFocused.value = false, "47"),
        e: common_vendor.o(($event) => emit("update:roomName", $event.detail.value), "be"),
        f: !__props.hideScope
      }, !__props.hideScope ? common_vendor.e({
        g: __props.scopeType === "personal" ? 1 : "",
        h: common_vendor.o(($event) => emit("update:scopeType", "personal"), "99"),
        i: __props.familyName
      }, __props.familyName ? {
        j: common_vendor.t(__props.familyName),
        k: __props.scopeType === "family" ? 1 : "",
        l: common_vendor.o(($event) => emit("update:scopeType", "family"), "ad")
      } : {}) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45564414"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetBasicForm.js.map
