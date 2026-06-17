"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-cell",
  data() {
    return {};
  },
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$10],
  computed: {
    titleTextStyle() {
      return common_vendor.addStyle(this.titleStyle);
    },
    cellDisabledColor() {
      return this.upThemeVar("--up-disabled-color", "#c8c9cc");
    },
    cellTitleDynamicStyle() {
      return {
        color: this.upThemeVar("--up-main-color", "#303133")
      };
    },
    cellLabelDynamicStyle() {
      return {
        color: this.upThemeVar("--up-tips-color", "#909399")
      };
    },
    cellValueDynamicStyle() {
      return {
        color: this.upThemeVar("--up-content-color", "#606266")
      };
    }
  },
  emits: ["click"],
  methods: {
    addStyle: common_vendor.addStyle,
    testEmpty: common_vendor.test.empty,
    // 点击cell
    clickHandler(e) {
      if (this.disabled)
        return;
      this.$emit("click", {
        name: this.name
      });
      this.openPage();
      this.stop && this.preventEvent(e);
    }
  }
};
if (!Array) {
  const _component_up_icon = common_vendor.resolveComponent("up-icon");
  const _easycom_u_line2 = common_vendor.resolveComponent("u-line");
  (_component_up_icon + _easycom_u_line2)();
}
const _easycom_u_line = () => "../u-line/u-line.js";
if (!Math) {
  _easycom_u_line();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.$slots.icon || _ctx.icon
  }, _ctx.$slots.icon || _ctx.icon ? common_vendor.e({
    b: _ctx.$slots.icon
  }, _ctx.$slots.icon ? {} : {
    c: common_vendor.p({
      name: _ctx.icon,
      ["custom-style"]: _ctx.iconStyle,
      size: _ctx.size === "large" ? 22 : 18
    })
  }) : {}, {
    d: _ctx.$slots.title || !_ctx.title
  }, _ctx.$slots.title || !_ctx.title ? {} : {
    e: common_vendor.t(_ctx.title),
    f: common_vendor.s($options.titleTextStyle),
    g: common_vendor.s($options.cellTitleDynamicStyle),
    h: common_vendor.n(_ctx.required && "u-cell--required"),
    i: common_vendor.n(_ctx.disabled && "u-cell--disabled"),
    j: common_vendor.n(_ctx.size === "large" && "u-cell__title-text--large")
  }, {
    k: _ctx.label
  }, _ctx.label ? {
    l: common_vendor.t(_ctx.label),
    m: common_vendor.s($options.cellLabelDynamicStyle),
    n: common_vendor.n(_ctx.disabled && "u-cell--disabled"),
    o: common_vendor.n(_ctx.size === "large" && "u-cell__label--large")
  } : {}, {
    p: !$options.testEmpty(_ctx.value)
  }, !$options.testEmpty(_ctx.value) ? {
    q: common_vendor.t(_ctx.value),
    r: common_vendor.s($options.cellValueDynamicStyle),
    s: common_vendor.n(_ctx.disabled && "u-cell--disabled"),
    t: common_vendor.n(_ctx.size === "large" && "u-cell__value--large")
  } : {}, {
    v: _ctx.$slots["right-icon"] || _ctx.isLink
  }, _ctx.$slots["right-icon"] || _ctx.isLink ? common_vendor.e({
    w: _ctx.rightIcon && !_ctx.$slots["right-icon"]
  }, _ctx.rightIcon && !_ctx.$slots["right-icon"] ? {
    x: common_vendor.p({
      name: _ctx.rightIcon,
      ["custom-style"]: _ctx.rightIconStyle,
      color: _ctx.disabled ? $options.cellDisabledColor : "info",
      size: _ctx.size === "large" ? 18 : 16
    })
  } : {}, {
    y: common_vendor.n(`u-cell__right-icon-wrap--${_ctx.arrowDirection}`)
  }) : {}, {
    z: _ctx.$slots["righticon"]
  }, _ctx.$slots["righticon"] ? {
    A: common_vendor.n(`u-cell__right-icon-wrap--${_ctx.arrowDirection}`)
  } : {}, {
    B: common_vendor.n(_ctx.center && "u-cell--center"),
    C: common_vendor.n(_ctx.size === "large" && "u-cell__body--large"),
    D: _ctx.border
  }, _ctx.border ? {} : {}, {
    E: common_vendor.n(_ctx.customClass),
    F: common_vendor.s($options.addStyle(_ctx.customStyle)),
    G: !_ctx.disabled && (_ctx.clickable || _ctx.isLink) ? "u-cell--clickable" : "",
    H: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args), "64")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b4243719"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/uview-plus/components/u-cell/u-cell.js.map
