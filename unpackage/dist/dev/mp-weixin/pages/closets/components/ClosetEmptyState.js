"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ClosetEmptyState",
  props: {
    scopeType: {
      type: String,
      default: "personal"
    },
    canCreate: {
      type: Boolean,
      default: true
    },
    isFirstTime: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    titleText() {
      return this.scopeType === "family" ? "家庭空间还是空的" : "从这里开始整理";
    },
    descText() {
      return this.scopeType === "family" ? "创建一个共享衣橱，和家人一起管理四季衣物" : "创建一个专属衣橱，把散落的衣物归类整理";
    },
    buttonText() {
      return this.scopeType === "family" ? "创建家庭衣橱" : "创建第一个衣橱";
    }
  },
  methods: {
    handleCreate() {
      this.$emit("create");
    }
  }
};
if (!Array) {
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_line = common_vendor.resolveComponent("line");
  (_component_rect + _component_path + _component_svg + _component_line)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2"
    }),
    b: common_vendor.p({
      d: "M9 9h6v6H9z"
    }),
    c: common_vendor.p({
      d: "M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M1 9h3M20 15h3M1 15h3"
    }),
    d: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    e: common_vendor.t($options.titleText),
    f: common_vendor.t($options.descText),
    g: common_vendor.p({
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "2"
    }),
    h: common_vendor.p({
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "16"
    }),
    i: common_vendor.p({
      x1: "8",
      y1: "12",
      x2: "16",
      y2: "12"
    }),
    j: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    k: common_vendor.p({
      d: "M20.38 3.46 16 2a4 4 0 0 1-3.08 4.38"
    }),
    l: common_vendor.p({
      d: "M9.62 3.46 14 2a4 4 0 0 1 3.08 4.38"
    }),
    m: common_vendor.p({
      d: "M4.24 14.08c-1.24 1.37-1.1 3.5.3 4.7l3.6 3.2a3.1 3.1 0 0 0 4.2 0l3.6-3.2c1.4-1.2 1.54-3.33.3-4.7l-3.3-3.66a4 4 0 0 0-5.94 0Z"
    }),
    n: common_vendor.p({
      d: "M12 6v8"
    }),
    o: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    p: common_vendor.p({
      d: "M12 20h9"
    }),
    q: common_vendor.p({
      d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
    }),
    r: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    s: $props.isFirstTime
  }, $props.isFirstTime ? {} : {}, {
    t: $props.canCreate
  }, $props.canCreate ? {
    v: common_vendor.p({
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }),
    w: common_vendor.p({
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }),
    x: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    y: common_vendor.t($options.buttonText),
    z: common_vendor.o((...args) => $options.handleCreate && $options.handleCreate(...args), "45")
  } : {}, {
    A: $props.isFirstTime
  }, $props.isFirstTime ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3720155d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetEmptyState.js.map
