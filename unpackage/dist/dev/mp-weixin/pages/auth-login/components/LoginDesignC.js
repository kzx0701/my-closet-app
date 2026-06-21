"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_path = common_vendor.resolveComponent("path");
  (_component_circle + _component_svg + _component_path)();
}
const _sfc_main = {
  __name: "LoginDesignC",
  props: {
    statusBarHeight: { type: Number, default: 44 },
    mode: { type: String, default: "wechat" },
    agreed: { type: Boolean, default: false },
    agreementShake: { type: Boolean, default: false },
    wxLoading: { type: Boolean, default: false },
    submitting: { type: Boolean, default: false },
    username: { type: String, default: "" },
    password: { type: String, default: "" }
  },
  emits: [
    "back",
    "toggle-agree",
    "wechat-login",
    "switch-mode",
    "account-login",
    "go-register",
    "go-forgot",
    "update:username",
    "update:password"
  ],
  setup(__props) {
    const usernameFocused = common_vendor.ref(false);
    const passwordFocused = common_vendor.ref(false);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          cx: "80",
          cy: "120",
          r: "60",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        b: common_vendor.p({
          cx: "320",
          cy: "200",
          r: "40",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          cx: "300",
          cy: "680",
          r: "80",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          cx: "60",
          cy: "600",
          r: "50",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        e: common_vendor.p({
          cx: "187",
          cy: "400",
          r: "120",
          fill: "none",
          stroke: "rgba(244,239,230,0.02)",
          ["stroke-width"]: "1"
        }),
        f: common_vendor.p({
          viewBox: "0 0 375 812",
          preserveAspectRatio: "none"
        }),
        g: common_vendor.p({
          d: "M15 18l-6-6 6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        h: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        i: __props.statusBarHeight + 16 + "px",
        j: common_vendor.o(($event) => _ctx.$emit("back"), "b0"),
        k: __props.statusBarHeight + 56 + "px",
        l: common_vendor.t(__props.mode === "account" ? "账号登录" : "欢迎回来"),
        m: __props.mode === "wechat"
      }, __props.mode === "wechat" ? {
        n: common_vendor.p({
          d: "M8.5 4C4.4 4 1 6.8 1 10.3c0 2 1.1 3.7 2.8 4.9L3 18l3-1.5c.8.2 1.7.3 2.5.3.3 0 .5 0 .8-.1-.2-.5-.3-1.1-.3-1.6 0-3.1 2.9-5.6 6.5-5.6.3 0 .5 0 .8.1C15.8 6.3 12.5 4 8.5 4z",
          fill: "currentColor"
        }),
        o: common_vendor.p({
          d: "M16 10c-3.3 0-6 2.2-6 5 0 1.7.9 3.1 2.4 4L12 21l2.3-1.2c.6.2 1.2.2 1.7.2 3.3 0 6-2.2 6-5s-2.7-5-6-5z",
          fill: "currentColor"
        }),
        p: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        q: __props.wxLoading,
        r: __props.wxLoading,
        s: common_vendor.o(($event) => _ctx.$emit("wechat-login"), "c5"),
        t: common_vendor.o(($event) => _ctx.$emit("switch-mode", "account"), "d9")
      } : {
        v: __props.username,
        w: common_vendor.o(($event) => usernameFocused.value = true, "2d"),
        x: common_vendor.o(($event) => usernameFocused.value = false, "3e"),
        y: common_vendor.o(($event) => _ctx.$emit("update:username", $event.detail.value), "17"),
        z: usernameFocused.value ? 1 : "",
        A: __props.password,
        B: common_vendor.o(($event) => passwordFocused.value = true, "e8"),
        C: common_vendor.o(($event) => passwordFocused.value = false, "a0"),
        D: common_vendor.o(($event) => _ctx.$emit("update:password", $event.detail.value), "f8"),
        E: passwordFocused.value ? 1 : "",
        F: common_vendor.o(($event) => _ctx.$emit("go-register"), "1d"),
        G: common_vendor.o(($event) => _ctx.$emit("go-forgot"), "0a"),
        H: __props.submitting,
        I: __props.submitting,
        J: common_vendor.o(($event) => _ctx.$emit("account-login"), "7f"),
        K: common_vendor.o(($event) => _ctx.$emit("switch-mode", "wechat"), "be")
      }, {
        L: __props.agreed
      }, __props.agreed ? {
        M: common_vendor.p({
          d: "M20 6L9 17l-5-5",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        N: common_vendor.p({
          viewBox: "0 0 24 24"
        })
      } : {}, {
        O: __props.agreed ? 1 : "",
        P: common_vendor.o(($event) => _ctx.$emit("toggle-agree"), "ef"),
        Q: __props.agreementShake ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8bcdfb1b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginDesignC.js.map
