"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_closetOptions = require("../../../common/constants/closet-options.js");
const common_constants_routes = require("../../../common/constants/routes.js");
const _sfc_main = {
  name: "ClosetListCard",
  props: {
    closet: {
      type: Object,
      required: true
    }
  },
  computed: {
    colorOption() {
      return common_constants_closetOptions.CLOSET_COLOR_OPTIONS.find((o) => o.code === this.closet.color_code) || common_constants_closetOptions.CLOSET_COLOR_OPTIONS[0];
    },
    styleOption() {
      return common_constants_closetOptions.CLOSET_STYLE_OPTIONS.find((o) => o.code === this.closet.style_code) || common_constants_closetOptions.CLOSET_STYLE_OPTIONS[0];
    },
    isFamilyScope() {
      return this.closet.scope_type === "family";
    },
    creatorName() {
      return String(this.closet.creator_name || "").trim();
    },
    creatorInitial() {
      const name = this.creatorName;
      if (!name)
        return "?";
      return name.charAt(0).toUpperCase();
    },
    formatUpdateTime() {
      const ts = this.closet.updated_at || this.closet.created_at;
      if (!ts)
        return "";
      const date = new Date(ts);
      if (Number.isNaN(date.getTime()))
        return "";
      const now = Date.now();
      const diff = now - date.getTime();
      const minute = 60 * 1e3;
      const hour = 60 * minute;
      const day = 24 * hour;
      if (diff < minute)
        return "刚刚";
      if (diff < hour)
        return `${Math.floor(diff / minute)}分钟前`;
      if (diff < day)
        return `${Math.floor(diff / hour)}小时前`;
      if (diff < day * 7)
        return `${Math.floor(diff / day)}天前`;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  },
  methods: {
    goDetail() {
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.closetDetail}?id=${this.closet._id}`
      });
    }
  }
};
if (!Array) {
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_path = common_vendor.resolveComponent("path");
  (_component_rect + _component_line + _component_svg + _component_path)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.closet.style_code === "modern-flat"
  }, $props.closet.style_code === "modern-flat" ? {
    b: common_vendor.p({
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "1"
    }),
    c: common_vendor.p({
      x1: "12",
      y1: "3",
      x2: "12",
      y2: "21"
    }),
    d: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    })
  } : $props.closet.style_code === "arched-vintage" ? {
    f: common_vendor.p({
      d: "M3 20V10a9 9 0 0 1 18 0v10"
    }),
    g: common_vendor.p({
      x1: "3",
      y1: "20",
      x2: "21",
      y2: "20"
    }),
    h: common_vendor.p({
      x1: "12",
      y1: "20",
      x2: "12",
      y2: "10"
    }),
    i: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    })
  } : $props.closet.style_code === "open-rack" ? {
    k: common_vendor.p({
      x1: "4",
      y1: "3",
      x2: "4",
      y2: "21"
    }),
    l: common_vendor.p({
      x1: "20",
      y1: "3",
      x2: "20",
      y2: "21"
    }),
    m: common_vendor.p({
      x1: "4",
      y1: "8",
      x2: "20",
      y2: "8"
    }),
    n: common_vendor.p({
      x1: "4",
      y1: "14",
      x2: "20",
      y2: "14"
    }),
    o: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    })
  } : $props.closet.style_code === "drawer-mix" ? {
    q: common_vendor.p({
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "1"
    }),
    r: common_vendor.p({
      x1: "3",
      y1: "9",
      x2: "21",
      y2: "9"
    }),
    s: common_vendor.p({
      x1: "3",
      y1: "15",
      x2: "21",
      y2: "15"
    }),
    t: common_vendor.p({
      x1: "8",
      y1: "6",
      x2: "8",
      y2: "8"
    }),
    v: common_vendor.p({
      x1: "16",
      y1: "12",
      x2: "16",
      y2: "14"
    }),
    w: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    })
  } : {
    x: common_vendor.p({
      x: "4",
      y: "2",
      width: "16",
      height: "20",
      rx: "1"
    }),
    y: common_vendor.p({
      x1: "12",
      y1: "2",
      x2: "12",
      y2: "22"
    }),
    z: common_vendor.p({
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      ["stroke-width"]: "1.5",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    })
  }, {
    e: $props.closet.style_code === "arched-vintage",
    j: $props.closet.style_code === "open-rack",
    p: $props.closet.style_code === "drawer-mix",
    A: $options.colorOption.color,
    B: common_vendor.t($props.closet.name),
    C: common_vendor.t($options.styleOption.name),
    D: $options.formatUpdateTime
  }, $options.formatUpdateTime ? {
    E: common_vendor.t($options.formatUpdateTime)
  } : {}, {
    F: $props.closet.room_name || $options.isFamilyScope
  }, $props.closet.room_name || $options.isFamilyScope ? common_vendor.e({
    G: $props.closet.room_name
  }, $props.closet.room_name ? {
    H: common_vendor.t($props.closet.room_name)
  } : {}, {
    I: $options.isFamilyScope && $options.creatorName
  }, $options.isFamilyScope && $options.creatorName ? {
    J: common_vendor.t($options.creatorInitial),
    K: common_vendor.t($options.creatorName)
  } : {}) : {}, {
    L: common_vendor.t($props.closet.clothes_count || 0),
    M: common_vendor.o((...args) => $options.goDetail && $options.goDetail(...args), "ad")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-35651610"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closets/components/ClosetListCard.js.map
