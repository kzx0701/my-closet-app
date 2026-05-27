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
    const entryItems = [
      {
        title: "账号信息",
        desc: "查看头像、昵称、登录账号等个人资料。"
      },
      {
        title: "家庭与邀请码",
        desc: "管理当前家庭关系、查看邀请码、处理协作信息。"
      },
      {
        title: "设置与退出",
        desc: "承接低频但重要的系统设置和登录态管理。"
      }
    ];
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(entryItems, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: item.title
          };
        }),
        b: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).profile
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
