"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_closetOptions = require("../../../common/constants/closet-options.js");
const common_constants_routes = require("../../../common/constants/routes.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_line + _component_rect + _component_svg)();
}
const _sfc_main = {
  __name: "ClosetListCard",
  props: {
    closet: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(__props) {
    const props = __props;
    const styleName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_STYLE_OPTIONS.find((item) => item.code === props.closet.style_code)) == null ? void 0 : _a.name) || "未知样式";
    });
    const colorName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_COLOR_OPTIONS.find((item) => item.code === props.closet.color_code)) == null ? void 0 : _a.name) || "未知颜色";
    });
    const clothesCount = common_vendor.computed(() => {
      return props.closet.clothes_count || 0;
    });
    const thumbStyleClass = common_vendor.computed(() => {
      const code = props.closet.style_code || "modern-flat";
      return `thumb-style-${code}`;
    });
    function goDetail() {
      var _a, _b;
      const targetClosetId = (_a = props.closet) == null ? void 0 : _a._id;
      if (!targetClosetId)
        return;
      const targetScopeType = ((_b = props.closet) == null ? void 0 : _b.scope_type) === "family" ? "family" : "personal";
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.closetDetail}?closetId=${targetClosetId}&scopeType=${targetScopeType}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.closet.style_code === "arched-vintage"
      }, __props.closet.style_code === "arched-vintage" ? {
        b: common_vendor.p({
          d: "M3 21V10a9 9 0 0 1 18 0v11"
        }),
        c: common_vendor.p({
          x1: "3",
          y1: "21",
          x2: "21",
          y2: "21"
        }),
        d: common_vendor.p({
          x1: "12",
          y1: "10",
          x2: "12",
          y2: "21"
        })
      } : __props.closet.style_code === "open-rack" ? {
        f: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        g: common_vendor.p({
          x1: "3",
          y1: "9",
          x2: "21",
          y2: "9"
        }),
        h: common_vendor.p({
          x1: "3",
          y1: "15",
          x2: "21",
          y2: "15"
        })
      } : __props.closet.style_code === "drawer-mix" ? {
        j: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        k: common_vendor.p({
          x1: "3",
          y1: "8",
          x2: "21",
          y2: "8"
        }),
        l: common_vendor.p({
          x1: "3",
          y1: "13",
          x2: "21",
          y2: "13"
        }),
        m: common_vendor.p({
          x1: "3",
          y1: "18",
          x2: "21",
          y2: "18"
        })
      } : {
        n: common_vendor.p({
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2"
        }),
        o: common_vendor.p({
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12"
        }),
        p: common_vendor.p({
          x1: "12",
          y1: "3",
          x2: "12",
          y2: "21"
        })
      }, {
        e: __props.closet.style_code === "open-rack",
        i: __props.closet.style_code === "drawer-mix",
        q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        r: common_vendor.n(thumbStyleClass.value),
        s: common_vendor.t(__props.closet.name),
        t: common_vendor.t(styleName.value),
        v: common_vendor.t(colorName.value),
        w: __props.closet.room_name
      }, __props.closet.room_name ? {
        x: common_vendor.t(__props.closet.room_name)
      } : {}, {
        y: common_vendor.t(clothesCount.value),
        z: common_vendor.o(goDetail, "92")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-35651610"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetListCard.js.map
