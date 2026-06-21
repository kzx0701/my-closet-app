"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  ScopeBadge();
}
const ScopeBadge = () => "../../../components/ScopeBadge.js";
const _sfc_main = {
  __name: "RegisterHero",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          text: "Auth · 注册"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-56974b31"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth-register/components/RegisterHero.js.map
