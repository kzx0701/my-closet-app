"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-popup",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$4],
  data() {
    return {
      overlayDuration: this.duration + 50,
      // 触摸相关数据
      touchStartY: 0,
      touchStartHeight: 0,
      isTouching: false,
      // 当前弹窗高度
      currentHeight: "auto"
    };
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue === true) {
        const children = this.$children;
        this.retryComputedComponentRect(children);
      }
    }
  },
  computed: {
    transitionStyle() {
      const style = {
        display: "flex"
      };
      if (!this.pageInline) {
        style.zIndex = this.zIndex;
        style.position = "fixed";
      }
      style[this.mode] = 0;
      if (this.mode === "left") {
        return common_vendor.deepMerge(style, {
          bottom: 0,
          top: 0
        });
      } else if (this.mode === "right") {
        return common_vendor.deepMerge(style, {
          bottom: 0,
          top: 0
        });
      } else if (this.mode === "top") {
        return common_vendor.deepMerge(style, {
          left: 0,
          right: 0
        });
      } else if (this.mode === "bottom") {
        return common_vendor.deepMerge(style, {
          left: 0,
          right: 0
        });
      } else if (this.mode === "center") {
        return common_vendor.deepMerge(style, {
          alignItems: "center",
          "justify-content": "center",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        });
      }
    },
    contentStyleWrap() {
      const style = {};
      if (this.mode === "bottom" && this.touchable) {
        if (this.currentHeight !== "auto") {
          style.height = this.currentHeight;
        }
        if (this.maxHeight) {
          style.maxHeight = common_vendor.addUnit(this.maxHeight);
        }
        if (this.minHeight) {
          style.minHeight = common_vendor.addUnit(this.minHeight);
        }
      }
      return style;
    },
    contentStyle() {
      const style = {};
      common_vendor.getWindowInfo();
      if (this.mode !== "center") {
        style.flex = 1;
      }
      style.backgroundColor = this.bgColor || this.upThemeVar("--up-card-bg-color", this.upThemeIsDark ? "#1c1c1e" : "#ffffff");
      if (this.round) {
        const value = common_vendor.addUnit(this.round);
        if (this.mode === "top") {
          style.borderBottomLeftRadius = value;
          style.borderBottomRightRadius = value;
        } else if (this.mode === "bottom") {
          style.borderTopLeftRadius = value;
          style.borderTopRightRadius = value;
        } else if (this.mode === "center") {
          style.borderRadius = value;
        }
      }
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    },
    closeIconColor() {
      return this.upThemeVar("--up-content-color", "#606266");
    },
    indicatorStyle() {
      return {
        backgroundColor: this.upThemeVar("--up-light-color", "#c0c4cc")
      };
    },
    position() {
      if (this.mode === "center") {
        return this.zoom ? "fade-zoom" : "fade";
      }
      if (this.mode === "left") {
        return "slide-left";
      }
      if (this.mode === "right") {
        return "slide-right";
      }
      if (this.mode === "bottom") {
        return "slide-up";
      }
      if (this.mode === "top") {
        return "slide-down";
      }
    }
  },
  emits: ["open", "close", "click", "update:show"],
  methods: {
    // 点击遮罩
    overlayClick() {
      if (this.closeOnClickOverlay) {
        this.$emit("update:show", false);
        this.$emit("close");
      }
    },
    open(e) {
      this.$emit("update:show", true);
    },
    close(e) {
      this.$emit("update:show", false);
      this.$emit("close");
    },
    afterEnter() {
      this.$emit("open");
    },
    clickHandler() {
      if (this.mode === "center") {
        this.overlayClick();
      }
      this.$emit("click");
    },
    retryComputedComponentRect(children) {
      const names = [
        "u-calendar-month",
        "u-album",
        "u-collapse-item",
        "u-dropdown",
        "u-index-item",
        "u-index-list",
        "u-line-progress",
        "u-list-item",
        "u-rate",
        "u-read-more",
        "u-row",
        "u-row-notice",
        "u-scroll-list",
        "u-skeleton",
        "u-slider",
        "u-steps-item",
        "u-sticky",
        "u-subsection",
        "u-swipe-action-item",
        "u-tabbar",
        "u-tabs",
        "u-tooltip"
      ];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const grandChild = child.$children;
        if (names.includes(child.$options.name) && typeof (child == null ? void 0 : child.init) === "function") {
          common_vendor.sleep(50).then(() => {
            child.init();
          });
        }
        if (grandChild.length) {
          this.retryComputedComponentRect(grandChild);
        }
      }
    },
    // 触摸开始
    onTouchStart(e) {
      if (!this.touchable || this.mode !== "bottom")
        return;
      this.isTouching = true;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartHeight = this.$el.querySelector(".u-popup__content—transition").offsetHeight;
    },
    // 触摸移动
    onTouchMove(e) {
      if (!this.isTouching || !this.touchable || this.mode !== "bottom")
        return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - this.touchStartY;
      if (deltaY !== 0) {
        const newHeight = this.touchStartHeight - deltaY;
        const minHeight = parseFloat(common_vendor.addUnit(this.minHeight)) || 200;
        const maxHeight = this.maxHeight ? this.maxHeight.toString().includes("%") ? common_vendor.getWindowInfo().windowHeight * (parseFloat(this.maxHeight) / 100) : parseFloat(common_vendor.addUnit(this.maxHeight)) : common_vendor.getWindowInfo().windowHeight * 0.8;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          this.currentHeight = newHeight + "px";
        }
      }
      e.preventDefault();
    },
    // 触摸结束
    onTouchEnd(e) {
      if (!this.isTouching || !this.touchable || this.mode !== "bottom")
        return;
      this.isTouching = false;
      const touchY = e.changedTouches[0].clientY;
      const deltaY = touchY - this.touchStartY;
      const velocity = Math.abs(deltaY) / (e.timeStamp - e.changedTouches[0].timestamp);
      if (deltaY > 100 || deltaY > 30 && velocity > 0.5) {
        this.close();
      }
    }
  }
};
if (!Array) {
  const _easycom_u_overlay2 = common_vendor.resolveComponent("u-overlay");
  const _easycom_u_status_bar2 = common_vendor.resolveComponent("u-status-bar");
  const _component_up_icon = common_vendor.resolveComponent("up-icon");
  const _easycom_u_safe_bottom2 = common_vendor.resolveComponent("u-safe-bottom");
  const _easycom_u_transition2 = common_vendor.resolveComponent("u-transition");
  (_easycom_u_overlay2 + _easycom_u_status_bar2 + _component_up_icon + _easycom_u_safe_bottom2 + _easycom_u_transition2)();
}
const _easycom_u_overlay = () => "../u-overlay/u-overlay.js";
const _easycom_u_status_bar = () => "../u-status-bar/u-status-bar.js";
const _easycom_u_safe_bottom = () => "../u-safe-bottom/u-safe-bottom.js";
const _easycom_u_transition = () => "../u-transition/u-transition.js";
if (!Math) {
  (_easycom_u_overlay + _easycom_u_status_bar + _easycom_u_safe_bottom + _easycom_u_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.open && $options.open(...args), "11"),
    b: _ctx.overlay
  }, _ctx.overlay ? {
    c: common_vendor.o($options.overlayClick, "b4"),
    d: common_vendor.p({
      show: _ctx.show && _ctx.pageInline == false,
      zIndex: _ctx.zIndex,
      duration: $data.overlayDuration,
      customStyle: _ctx.overlayStyle,
      opacity: _ctx.overlayOpacity
    })
  } : {}, {
    e: _ctx.safeAreaInsetTop
  }, _ctx.safeAreaInsetTop ? {} : {}, {
    f: _ctx.touchable && _ctx.mode === "bottom"
  }, _ctx.touchable && _ctx.mode === "bottom" ? {
    g: common_vendor.s($options.indicatorStyle),
    h: common_vendor.o((...args) => $options.onTouchStart && $options.onTouchStart(...args), "d5"),
    i: common_vendor.o((...args) => $options.onTouchMove && $options.onTouchMove(...args), "38"),
    j: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args), "1c"),
    k: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args), "d9")
  } : {}, {
    l: _ctx.closeable
  }, _ctx.closeable ? {
    m: common_vendor.p({
      name: "close",
      color: $options.closeIconColor,
      size: "18",
      bold: true
    }),
    n: common_vendor.o((...args) => $options.close && $options.close(...args), "6e"),
    o: common_vendor.n("u-popup__content__close--" + _ctx.closeIconPos)
  } : {}, {
    p: _ctx.safeAreaInsetBottom
  }, _ctx.safeAreaInsetBottom ? {} : {}, {
    q: common_vendor.s($options.contentStyle),
    r: common_vendor.o((...args) => _ctx.noop && _ctx.noop(...args), "f2"),
    s: common_vendor.o((...args) => _ctx.noop && _ctx.noop(...args), "10"),
    t: common_vendor.s($options.contentStyleWrap),
    v: common_vendor.o($options.afterEnter, "2c"),
    w: common_vendor.o($options.clickHandler, "00"),
    x: common_vendor.p({
      show: _ctx.pageInline ? true : _ctx.show,
      customStyle: $options.transitionStyle,
      mode: _ctx.pageInline ? "none" : $options.position,
      duration: _ctx.duration
    }),
    y: common_vendor.n(_ctx.customClass),
    z: _ctx.show == false ? "0px" : "",
    A: _ctx.show == false ? "0px" : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74921bef"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/uview-plus/components/u-popup/u-popup.js.map
