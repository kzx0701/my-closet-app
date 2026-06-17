"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-textarea",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$17],
  data() {
    return {
      // 输入框的值
      innerValue: "",
      // 是否处于获得焦点状态
      focused: false,
      // value是否第一次变化，在watch中，由于加入immediate属性，会在第一次触发，此时不应该认为value发生了变化
      firstChange: true,
      // value绑定值的变化是由内部还是外部引起的
      changeFromInner: false,
      // 过滤处理方法
      innerFormatter: (value) => value
    };
  },
  created() {
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal, oldVal) {
        this.innerValue = newVal;
        this.firstChange = false;
        this.changeFromInner = false;
      }
    }
  },
  computed: {
    placeholderStyleInner() {
      var _a, _b;
      if (this.placeholderStyle) {
        return common_vendor.addStyle(this.placeholderStyle, typeof this.placeholderStyle === "string" ? "string" : "object");
      }
      return `color: ${this.upThemeVar("--up-tips-color", ((_b = (_a = this.$u) == null ? void 0 : _a.color) == null ? void 0 : _b.tipsColor) || "#909399")}`;
    },
    countStyle() {
      if (this.disabled)
        return { backgroundColor: "transparent" };
      return {
        backgroundColor: this.upThemeVar("--up-card-bg-color", "#ffffff"),
        color: this.upThemeVar("--up-tips-color", "#909193")
      };
    },
    fieldStyle() {
      const style = {
        height: common_vendor.addUnit(this.height),
        backgroundColor: "transparent",
        color: this.upThemeVar("--up-content-color", "#606266"),
        caretColor: this.upThemeVar("--up-main-color", "#303133")
      };
      if (this.autoHeight) {
        style["height"] = "auto";
        style["minHeight"] = common_vendor.addUnit(this.height);
      }
      return style;
    },
    // 组件的类名
    textareaClass() {
      let classes = [], { border, disabled } = this;
      border === "surround" && (classes = classes.concat(["u-textarea--radius"]));
      border === "bottom" && (classes = classes.concat([
        "u-textarea--no-radius"
      ]));
      disabled && classes.push("u-textarea--disabled");
      return classes.join(" ");
    },
    textareaBorderColor() {
      const lightBorder = this.upThemeVar("--up-border-color", "#dadbde");
      return this.upThemeVar(
        "--up-input-border-color",
        this.upThemeIsDark ? "rgba(255, 255, 255, 0.08)" : lightBorder
      );
    },
    // 组件的样式
    textareaStyle() {
      const style = {};
      style.backgroundColor = this.disabled ? this.upThemeVar("--up-bg-color", "#f5f7fa") : this.upThemeVar("--up-card-bg-color", "#ffffff");
      style.color = this.upThemeVar("--up-content-color", "#606266");
      if (this.border === "surround") {
        style.borderWidth = "0.5px";
        style.borderStyle = "solid";
        style.borderColor = this.textareaBorderColor;
      }
      if (this.border === "bottom") {
        style.borderBottomWidth = "0.5px";
        style.borderBottomStyle = "solid";
        style.borderBottomColor = this.textareaBorderColor;
      }
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    }
  },
  emits: ["update:modelValue", "linechange", "focus", "blur", "change", "confirm", "keyboardheightchange"],
  methods: {
    addStyle: common_vendor.addStyle,
    addUnit: common_vendor.addUnit,
    // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
    setFormatter(e) {
      this.innerFormatter = e;
    },
    onFocus(e) {
      this.$emit("focus", e);
    },
    onBlur(e) {
      this.$emit("blur", e);
      common_vendor.formValidate(this, "blur");
    },
    onLinechange(e) {
      this.$emit("linechange", e);
    },
    onInput(e) {
      let { value = "" } = e.detail || {};
      const formatter = this.formatter || this.innerFormatter;
      const formatValue = formatter(value);
      this.innerValue = value;
      this.$nextTick(() => {
        this.innerValue = formatValue;
        this.valueChange();
      });
    },
    // 内容发生变化，进行处理
    valueChange() {
      const value = this.innerValue;
      this.$nextTick(() => {
        this.$emit("update:modelValue", value);
        this.changeFromInner = true;
        this.$emit("change", value);
        common_vendor.formValidate(this, "change");
      });
    },
    onConfirm(e) {
      this.$emit("confirm", e);
    },
    onKeyboardheightchange(e) {
      this.$emit("keyboardheightchange", e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.innerValue,
    b: common_vendor.s($options.fieldStyle),
    c: _ctx.placeholder,
    d: $options.placeholderStyleInner,
    e: _ctx.placeholderClass,
    f: _ctx.disabled,
    g: _ctx.focus,
    h: _ctx.autoHeight,
    i: _ctx.fixed,
    j: _ctx.cursorSpacing,
    k: _ctx.cursor,
    l: _ctx.showConfirmBar,
    m: _ctx.selectionStart,
    n: _ctx.selectionEnd,
    o: _ctx.adjustPosition,
    p: _ctx.disableDefaultPadding,
    q: _ctx.holdKeyboard,
    r: _ctx.maxlength,
    s: _ctx.confirmType,
    t: _ctx.ignoreCompositionEvent,
    v: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args), "67"),
    w: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args), "eb"),
    x: common_vendor.o((...args) => $options.onLinechange && $options.onLinechange(...args), "d7"),
    y: common_vendor.o((...args) => $options.onInput && $options.onInput(...args), "59"),
    z: common_vendor.o((...args) => $options.onConfirm && $options.onConfirm(...args), "53"),
    A: common_vendor.o((...args) => $options.onKeyboardheightchange && $options.onKeyboardheightchange(...args), "95"),
    B: _ctx.count
  }, _ctx.count ? {
    C: common_vendor.t($data.innerValue.length),
    D: common_vendor.t(_ctx.maxlength),
    E: common_vendor.s($options.countStyle)
  } : {}, {
    F: common_vendor.n($options.textareaClass),
    G: common_vendor.s($options.textareaStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-31706dd7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/uview-plus/components/u-textarea/u-textarea.js.map
