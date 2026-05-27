"use strict";
const common_vendor = require("../common/vendor.js");
const common_constants_routes = require("../common/constants/routes.js");
const _sfc_main = {
  __name: "H5TabBar",
  props: {
    currentRoute: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const isH5 = common_vendor.computed(() => typeof window !== "undefined");
    const items = [
      {
        route: common_constants_routes.ROUTES.home,
        label: "首页",
        icon: "/static/tabbar/yun.png",
        selectedIcon: "/static/tabbar/yun1.png"
      },
      {
        route: common_constants_routes.ROUTES.closets,
        label: "衣橱",
        icon: "/static/tabbar/storage.png",
        selectedIcon: "/static/tabbar/storage1.png"
      },
      {
        route: common_constants_routes.ROUTES.clothes,
        label: "衣物",
        icon: "/static/tabbar/obj.png",
        selectedIcon: "/static/tabbar/obj1.png"
      },
      {
        route: common_constants_routes.ROUTES.profile,
        label: "我的",
        icon: "/static/tabbar/fn.png",
        selectedIcon: "/static/tabbar/fn1.png"
      }
    ];
    function switchRoute(route) {
      common_vendor.index.switchTab({
        url: route
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isH5.value
      }, isH5.value ? {
        b: common_vendor.f(items, (item, k0, i0) => {
          return {
            a: item.route === __props.currentRoute ? item.selectedIcon : item.icon,
            b: common_vendor.t(item.label),
            c: item.route,
            d: item.route === __props.currentRoute ? 1 : "",
            e: common_vendor.o(($event) => switchRoute(item.route), item.route)
          };
        })
      } : {});
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/H5TabBar.js.map
