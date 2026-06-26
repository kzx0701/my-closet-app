"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_circle + _component_svg)();
}
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
        c: common_vendor.o(($event) => roomFocused.value = true, "01"),
        d: common_vendor.o(($event) => roomFocused.value = false, "48"),
        e: common_vendor.o(($event) => emit("update:roomName", $event.detail.value), "c4"),
        f: !__props.hideScope
      }, !__props.hideScope ? common_vendor.e({
        g: common_vendor.p({
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        h: common_vendor.p({
          cx: "12",
          cy: "7",
          r: "4"
        }),
        i: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        j: __props.scopeType === "personal" ? 1 : "",
        k: common_vendor.o(($event) => emit("update:scopeType", "personal"), "00"),
        l: __props.familyName
      }, __props.familyName ? {
        m: common_vendor.p({
          d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        }),
        n: common_vendor.p({
          cx: "9",
          cy: "7",
          r: "4"
        }),
        o: common_vendor.p({
          d: "M23 21v-2a4 4 0 0 0-3-3.87"
        }),
        p: common_vendor.p({
          d: "M16 3.13a4 4 0 0 1 0 7.75"
        }),
        q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        r: common_vendor.t(__props.familyName),
        s: __props.scopeType === "family" ? 1 : "",
        t: common_vendor.o(($event) => emit("update:scopeType", "family"), "dd")
      } : {}) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45564414"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetBasicForm.js.map
