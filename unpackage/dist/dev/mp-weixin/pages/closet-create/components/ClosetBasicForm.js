"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ClosetBasicForm",
  props: {
    name: {
      type: String,
      default: ""
    },
    roomName: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  emits: ["update:name", "update:roomName", "update:description"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.name,
    b: common_vendor.o(($event) => _ctx.$emit("update:name", $event.detail.value), "cb"),
    c: $props.roomName,
    d: common_vendor.o(($event) => _ctx.$emit("update:roomName", $event.detail.value), "84"),
    e: $props.description,
    f: common_vendor.o(($event) => _ctx.$emit("update:description", $event.detail.value), "40")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/closet-create/components/ClosetBasicForm.js.map
