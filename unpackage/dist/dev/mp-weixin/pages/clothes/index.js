"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
if (!Math) {
  H5TabBar();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const featureItems = [
      {
        title: "快速找衣服",
        desc: "按衣橱、季节、分类来筛选，减少翻找成本。"
      },
      {
        title: "新增衣物记录",
        desc: "随手补充新买或新整理出的衣物，保持收纳信息同步。"
      },
      {
        title: "查看未归类衣物",
        desc: "先知道哪些衣物还没放进衣橱，再做后续整理。"
      }
    ];
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(featureItems, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: item.title
          };
        }),
        b: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).clothes
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes/index.js.map
