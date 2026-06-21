"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_services_auth = require("../../../common/services/auth.js");
const common_api_modules_auth = require("../../../common/api/modules/auth.js");
const _sfc_main = {
  __name: "FamilyCreateForm",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "update:description", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const creatorText = common_vendor.ref("我 · Admin");
    async function loadCreator() {
      try {
        const session = common_services_auth.getCurrentSession();
        if (!session.uid)
          return;
        const info = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if ((info == null ? void 0 : info.nickname) || (info == null ? void 0 : info.username)) {
          creatorText.value = `${info.nickname || info.username} · Admin`;
        }
      } catch (e) {
      }
    }
    loadCreator();
    const previewName = common_vendor.computed(() => {
      const name = props.modelValue.trim();
      return name || "未命名家庭";
    });
    function handleNameInput(event) {
      emit("update:modelValue", event.detail.value);
    }
    function handleDescInput(event) {
      emit("update:description", event.detail.value);
    }
    return (_ctx, _cache) => {
      return {
        a: __props.modelValue,
        b: common_vendor.o(handleNameInput, "3a"),
        c: __props.description,
        d: common_vendor.o(handleDescInput, "fa"),
        e: common_vendor.t(previewName.value),
        f: common_vendor.t(creatorText.value)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-504d1990"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/family-create/components/FamilyCreateForm.js.map
