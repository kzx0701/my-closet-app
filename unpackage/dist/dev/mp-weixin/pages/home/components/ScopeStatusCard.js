"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ScopeStatusCard",
  props: {
    label: {
      type: String,
      default: "当前空间"
    },
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    badge: {
      type: String,
      default: ""
    },
    metaItems: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.label),
        b: __props.badge
      }, __props.badge ? {
        c: common_vendor.t(__props.badge)
      } : {}, {
        d: common_vendor.t(__props.title),
        e: common_vendor.t(__props.desc),
        f: __props.metaItems.length
      }, __props.metaItems.length ? {
        g: common_vendor.f(__props.metaItems, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        })
      } : {});
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/home/components/ScopeStatusCard.js.map
