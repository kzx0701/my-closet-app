"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "LoginDesignA",
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
    const SEASON_IMAGES = {
      spring: "/static/images/weather/spring.png",
      summer: "/static/images/weather/summer.png",
      autumn: "/static/images/weather/autumn.png",
      winter: "/static/images/weather/winter.png"
    };
    function getCurrentSeason() {
      const month = (/* @__PURE__ */ new Date()).getMonth() + 1;
      if (month >= 3 && month <= 5)
        return "spring";
      if (month >= 6 && month <= 8)
        return "summer";
      if (month >= 9 && month <= 11)
        return "autumn";
      return "winter";
    }
    const seasonImage = common_vendor.computed(() => SEASON_IMAGES[getCurrentSeason()]);
    const usernameFocused = common_vendor.ref(false);
    const passwordFocused = common_vendor.ref(false);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.statusBarHeight + 16 + "px",
        b: common_vendor.o(($event) => _ctx.$emit("back"), "e5"),
        c: __props.statusBarHeight + 40 + "px",
        d: seasonImage.value,
        e: common_vendor.p({
          type: "weixin",
          color: __props.mode === "wechat" ? "#f4efe6" : "rgba(244,239,230,0.55)",
          size: "16"
        }),
        f: __props.mode === "wechat" ? 1 : "",
        g: common_vendor.o(($event) => _ctx.$emit("switch-mode", "wechat"), "32"),
        h: common_vendor.p({
          type: "person",
          color: __props.mode === "account" ? "#f4efe6" : "rgba(244,239,230,0.55)",
          size: "16"
        }),
        i: __props.mode === "account" ? 1 : "",
        j: common_vendor.o(($event) => _ctx.$emit("switch-mode", "account"), "fa"),
        k: __props.mode === "wechat" ? "translateX(0)" : "translateX(100%)",
        l: common_vendor.p({
          type: "weixin",
          color: "#fff",
          size: "22"
        }),
        m: __props.wxLoading,
        n: __props.wxLoading,
        o: common_vendor.o(($event) => _ctx.$emit("wechat-login"), "c4"),
        p: __props.agreed
      }, __props.agreed ? {} : {}, {
        q: __props.agreed ? 1 : "",
        r: common_vendor.o(($event) => _ctx.$emit("toggle-agree"), "b4"),
        s: __props.agreementShake ? 1 : "",
        t: __props.mode === "wechat" ? 1 : "",
        v: __props.username,
        w: common_vendor.o(($event) => usernameFocused.value = true, "54"),
        x: common_vendor.o(($event) => usernameFocused.value = false, "e4"),
        y: common_vendor.o(($event) => _ctx.$emit("update:username", $event.detail.value), "27"),
        z: usernameFocused.value ? 1 : "",
        A: __props.password,
        B: common_vendor.o(($event) => passwordFocused.value = true, "82"),
        C: common_vendor.o(($event) => passwordFocused.value = false, "91"),
        D: common_vendor.o(($event) => _ctx.$emit("update:password", $event.detail.value), "a6"),
        E: passwordFocused.value ? 1 : "",
        F: __props.submitting,
        G: __props.submitting,
        H: common_vendor.o(($event) => _ctx.$emit("account-login"), "bc"),
        I: common_vendor.o(($event) => _ctx.$emit("go-register"), "d8"),
        J: common_vendor.o(($event) => _ctx.$emit("go-forgot"), "86"),
        K: __props.agreed
      }, __props.agreed ? {} : {}, {
        L: __props.agreed ? 1 : "",
        M: common_vendor.o(($event) => _ctx.$emit("toggle-agree"), "4b"),
        N: __props.agreementShake ? 1 : "",
        O: __props.mode === "account" ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-88ab3b01"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginDesignA.js.map
