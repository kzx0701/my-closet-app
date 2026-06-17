"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_constants_clothesOptions = require("../../../common/constants/clothes-options.js");
const common_constants_routes = require("../../../common/constants/routes.js");
const _sfc_main = {
  __name: "ClothesListCard",
  props: {
    clothes: {
      type: Object,
      default() {
        return {};
      }
    },
    showCreator: {
      type: Boolean,
      default: false
    }
  },
  emits: ["edit", "delete"],
  setup(__props) {
    const props = __props;
    const categoryName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === props.clothes.category)) == null ? void 0 : _a.name) || "未知分类";
    });
    const seasonName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS.find((item) => item.code === props.clothes.season)) == null ? void 0 : _a.name) || "未知季节";
    });
    const closetLabel = common_vendor.computed(() => {
      const closetName = String(props.clothes.closet_name || "").trim();
      return closetName ? `所属衣橱：${closetName}` : "当前未绑定衣橱";
    });
    const creatorText = common_vendor.computed(() => {
      const creatorName = String(props.clothes.creator_name || "").trim();
      return creatorName ? `创建者：${creatorName}` : "";
    });
    function previewImage() {
      if (props.clothes.image_url) {
        common_vendor.index.previewImage({
          urls: [props.clothes.image_url],
          current: props.clothes.image_url
        });
      }
    }
    function goDetail() {
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesDetail}?clothesId=${props.clothes._id}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.clothes.image_url
      }, __props.clothes.image_url ? {
        b: __props.clothes.image_url,
        c: common_vendor.o(previewImage, "7c")
      } : {}, {
        d: common_vendor.t(categoryName.value),
        e: common_vendor.t(seasonName.value),
        f: __props.clothes.color
      }, __props.clothes.color ? {
        g: common_vendor.t(__props.clothes.color)
      } : {}, {
        h: common_vendor.t(__props.clothes.name),
        i: common_vendor.t(closetLabel.value),
        j: __props.showCreator && creatorText.value
      }, __props.showCreator && creatorText.value ? {
        k: common_vendor.t(creatorText.value)
      } : {}, {
        l: common_vendor.t(__props.clothes.remark || "当前还没有补充衣物备注。"),
        m: common_vendor.o(($event) => _ctx.$emit("edit", __props.clothes), "db"),
        n: common_vendor.o(($event) => _ctx.$emit("delete", __props.clothes), "82"),
        o: common_vendor.o(goDetail, "18")
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/clothes/components/ClothesListCard.js.map
