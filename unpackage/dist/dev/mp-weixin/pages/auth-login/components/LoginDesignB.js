"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_g = common_vendor.resolveComponent("g");
  (_component_path + _component_svg + _component_line + _component_circle + _component_g)();
}
const _sfc_main = {
  __name: "LoginDesignB",
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
          d: "M 0 120 Q 187 60 375 120",
          fill: "none",
          stroke: "rgba(244,239,230,0.06)",
          ["stroke-width"]: "1"
        }),
        b: common_vendor.p({
          d: "M 0 200 Q 187 140 375 200",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        c: common_vendor.p({
          d: "M 0 520 Q 187 460 375 520",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        d: common_vendor.p({
          d: "M 0 580 Q 187 520 375 580",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        e: common_vendor.p({
          viewBox: "0 0 375 812",
          preserveAspectRatio: "none"
        }),
        f: common_vendor.p({
          d: "M15 18l-6-6 6-6",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        g: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        h: __props.statusBarHeight + 16 + "px",
        i: common_vendor.o(($event) => _ctx.$emit("back"), "9d"),
        j: common_vendor.p({
          x1: "10",
          y1: "20",
          x2: "230",
          y2: "20",
          stroke: "rgba(244,239,230,0.1)",
          ["stroke-width"]: "1"
        }),
        k: common_vendor.p({
          cx: "55",
          cy: "14",
          r: "4",
          fill: "none",
          stroke: "rgba(244,239,230,0.12)",
          ["stroke-width"]: "1"
        }),
        l: common_vendor.p({
          d: "M55 18 L55 30 Q45 34 30 44 L80 44 Q65 34 55 30",
          fill: "none",
          stroke: "rgba(244,239,230,0.12)",
          ["stroke-width"]: "1"
        }),
        m: common_vendor.p({
          opacity: "0.5"
        }),
        n: common_vendor.p({
          cx: "120",
          cy: "12",
          r: "5",
          fill: "none",
          stroke: "rgba(212,128,95,0.3)",
          ["stroke-width"]: "1"
        }),
        o: common_vendor.p({
          d: "M120 17 L120 34 Q105 40 85 52 L155 52 Q135 40 120 34",
          fill: "none",
          stroke: "rgba(212,128,95,0.35)",
          ["stroke-width"]: "1.5"
        }),
        p: common_vendor.p({
          cx: "185",
          cy: "14",
          r: "4",
          fill: "none",
          stroke: "rgba(244,239,230,0.12)",
          ["stroke-width"]: "1"
        }),
        q: common_vendor.p({
          d: "M185 18 L185 30 Q175 34 160 44 L210 44 Q195 34 185 30",
          fill: "none",
          stroke: "rgba(244,239,230,0.12)",
          ["stroke-width"]: "1"
        }),
        r: common_vendor.p({
          opacity: "0.5"
        }),
        s: common_vendor.p({
          d: "M30 90 Q120 70 210 90",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        t: common_vendor.p({
          d: "M50 105 Q120 90 190 105",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        v: common_vendor.p({
          viewBox: "0 0 240 140",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        w: __props.statusBarHeight + 56 + "px",
        x: __props.mode === "wechat"
      }, __props.mode === "wechat" ? common_vendor.e({
        y: __props.agreed
      }, __props.agreed ? {
        z: common_vendor.p({
          d: "M20 6L9 17l-5-5",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        A: common_vendor.p({
          viewBox: "0 0 24 24"
        })
      } : {}, {
        B: __props.agreed ? 1 : "",
        C: common_vendor.o(($event) => _ctx.$emit("toggle-agree"), "23"),
        D: __props.agreementShake ? 1 : "",
        E: common_vendor.p({
          d: "M8.5 4C4.4 4 1 6.8 1 10.3c0 2 1.1 3.7 2.8 4.9L3 18l3-1.5c.8.2 1.7.3 2.5.3.3 0 .5 0 .8-.1-.2-.5-.3-1.1-.3-1.6 0-3.1 2.9-5.6 6.5-5.6.3 0 .5 0 .8.1C15.8 6.3 12.5 4 8.5 4z",
          fill: "currentColor"
        }),
        F: common_vendor.p({
          d: "M16 10c-3.3 0-6 2.2-6 5 0 1.7.9 3.1 2.4 4L12 21l2.3-1.2c.6.2 1.2.2 1.7.2 3.3 0 6-2.2 6-5s-2.7-5-6-5z",
          fill: "currentColor"
        }),
        G: common_vendor.p({
          viewBox: "0 0 24 24"
        }),
        H: __props.wxLoading,
        I: __props.wxLoading,
        J: common_vendor.o(($event) => _ctx.$emit("wechat-login"), "a5")
      }) : common_vendor.e({
        K: __props.username,
        L: common_vendor.o(($event) => usernameFocused.value = true, "7d"),
        M: common_vendor.o(($event) => usernameFocused.value = false, "48"),
        N: common_vendor.o(($event) => _ctx.$emit("update:username", $event.detail.value), "8a"),
        O: usernameFocused.value ? 1 : "",
        P: __props.password,
        Q: common_vendor.o(($event) => passwordFocused.value = true, "6b"),
        R: common_vendor.o(($event) => passwordFocused.value = false, "72"),
        S: common_vendor.o(($event) => _ctx.$emit("update:password", $event.detail.value), "ff"),
        T: passwordFocused.value ? 1 : "",
        U: common_vendor.o(($event) => _ctx.$emit("go-register"), "78"),
        V: common_vendor.o(($event) => _ctx.$emit("go-forgot"), "18"),
        W: __props.agreed
      }, __props.agreed ? {
        X: common_vendor.p({
          d: "M20 6L9 17l-5-5",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        Y: common_vendor.p({
          viewBox: "0 0 24 24"
        })
      } : {}, {
        Z: __props.agreed ? 1 : "",
        aa: common_vendor.o(($event) => _ctx.$emit("toggle-agree"), "8c"),
        ab: __props.agreementShake ? 1 : "",
        ac: __props.submitting,
        ad: __props.submitting,
        ae: common_vendor.o(($event) => _ctx.$emit("account-login"), "94")
      }), {
        af: common_vendor.t(__props.mode === "wechat" ? "账号密码登录" : "微信登录"),
        ag: common_vendor.o(($event) => _ctx.$emit("switch-mode", __props.mode === "wechat" ? "account" : "wechat"), "ad")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4351302d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginDesignB.js.map
