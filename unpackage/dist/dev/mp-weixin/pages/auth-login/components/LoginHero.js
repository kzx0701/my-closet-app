"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  ScopeBadge();
}
const ScopeBadge = () => "../../../components/ScopeBadge.js";
const _sfc_main = {
  __name: "LoginHero",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          text: "Auth · 登录"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8f868cf"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-login/components/LoginHero.js.map
