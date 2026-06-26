"use strict";
const common_vendor = require("../common/vendor.js");
const common_constants_routes = require("../common/constants/routes.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "H5TabBar",
  props: {
    currentRoute: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const items = [
      { key: "home", route: common_constants_routes.ROUTES.home, label: "首页", icon: "home" },
      { key: "closets", route: common_constants_routes.ROUTES.closets, label: "衣橱", icon: "shop" },
      { key: "clothes", route: common_constants_routes.ROUTES.clothes, label: "衣物", icon: "star" },
      { key: "profile", route: common_constants_routes.ROUTES.profile, label: "我的", icon: "person" }
    ];
    const initialIndex = items.findIndex((i) => i.route === props.currentRoute);
    const activeIndex = common_vendor.ref(initialIndex >= 0 ? initialIndex : 0);
    const sliderReady = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      setTimeout(() => {
        sliderReady.value = true;
      }, 30);
    });
    const sliderStyle = common_vendor.computed(() => {
      const percent = activeIndex.value * 25 + 4.5;
      return {
        left: `${percent}%`
      };
    });
    function switchRoute(route, index) {
      if (route === props.currentRoute)
        return;
      activeIndex.value = index;
      common_vendor.index.switchTab({ url: route });
    }
    return (_ctx, _cache) => {
      return {
        a: sliderReady.value ? 1 : "",
        b: common_vendor.s(sliderStyle.value),
        c: common_vendor.f(items, (item, index, i0) => {
          return {
            a: "dc680df8-0-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: item.route === __props.currentRoute ? 22 : 20,
              color: item.route === __props.currentRoute ? "#3a5443" : "#8a8a7e"
            }),
            c: common_vendor.t(item.label),
            d: item.route,
            e: item.route === __props.currentRoute ? 1 : "",
            f: common_vendor.o(($event) => switchRoute(item.route, index), item.route)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dc680df8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/H5TabBar.js.map
