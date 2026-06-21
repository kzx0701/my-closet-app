"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ClothesBasicForm",
  props: {
    name: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    season: {
      type: String,
      default: ""
    },
    categoryOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    colorOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    seasonOptions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ["update:name", "update:category", "update:color", "update:season"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const nameFocused = common_vendor.ref(false);
    function getDotStyle(item) {
      if (!item)
        return {};
      const hex = item.hex || "";
      if (hex.startsWith("linear-gradient")) {
        return { background: hex };
      }
      return { background: hex };
    }
    const selectedSeasons = common_vendor.computed(() => {
      return String(props.season || "").split(",").map((item) => item.trim()).filter(Boolean);
    });
    function toggleSeason(code) {
      const current = [...selectedSeasons.value];
      const index = current.indexOf(code);
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(code);
      }
      emit("update:season", current.join(","));
    }
    return (_ctx, _cache) => {
      return {
        a: nameFocused.value ? 1 : "",
        b: __props.name,
        c: common_vendor.o(($event) => nameFocused.value = true, "ae"),
        d: common_vendor.o(($event) => nameFocused.value = false, "9f"),
        e: common_vendor.o(($event) => emit("update:name", $event.detail.value), "9a"),
        f: common_vendor.f(__props.categoryOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.code,
            c: __props.category === item.code ? 1 : "",
            d: common_vendor.o(($event) => emit("update:category", item.code), item.code)
          };
        }),
        g: common_vendor.f(__props.colorOptions, (item, k0, i0) => {
          return {
            a: item.code === "multicolor" ? 1 : "",
            b: common_vendor.s(getDotStyle(item)),
            c: common_vendor.t(item.label),
            d: item.code,
            e: __props.color === item.code ? 1 : "",
            f: common_vendor.o(($event) => emit("update:color", item.code), item.code)
          };
        }),
        h: common_vendor.f(__props.seasonOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.code,
            c: selectedSeasons.value.includes(item.code) ? 1 : "",
            d: common_vendor.o(($event) => toggleSeason(item.code), item.code)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1caf9a53"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes-create/components/ClothesBasicForm.js.map
