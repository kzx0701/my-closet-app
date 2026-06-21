"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  ScopeBadge();
}
const ScopeBadge = () => "../../../components/ScopeBadge.js";
const _sfc_main = {
  __name: "GuideHero",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          text: "Family · 家庭引导"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3cdb2950"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/family-guide/components/GuideHero.js.map
