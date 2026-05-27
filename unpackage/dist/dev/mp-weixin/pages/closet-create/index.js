"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_closetOptions = require("../../common/constants/closet-options.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
if (!Math) {
  (ClosetStylePicker + ClosetColorPicker + ClosetBasicForm)();
}
const ClosetBasicForm = () => "./components/ClosetBasicForm.js";
const ClosetColorPicker = () => "./components/ClosetColorPicker.js";
const ClosetStylePicker = () => "./components/ClosetStylePicker.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    var _a, _b;
    const styleOptions = common_constants_closetOptions.CLOSET_STYLE_OPTIONS;
    const colorOptions = common_constants_closetOptions.CLOSET_COLOR_OPTIONS;
    const styleCode = common_vendor.ref(((_a = styleOptions[0]) == null ? void 0 : _a.code) || "");
    const colorCode = common_vendor.ref(((_b = colorOptions[0]) == null ? void 0 : _b.code) || "");
    const name = common_vendor.ref("");
    const roomName = common_vendor.ref("");
    const description = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const scopeType = common_vendor.ref("personal");
    const closetId = common_vendor.ref("");
    const isEditMode = common_vendor.computed(() => Boolean(closetId.value));
    const pageEyebrow = common_vendor.computed(() => isEditMode.value ? "EDIT CLOSET" : "CREATE CLOSET");
    const pageTitle = common_vendor.computed(() => {
      if (isEditMode.value) {
        return scopeType.value === "family" ? "编辑家庭衣橱" : "编辑个人衣橱";
      }
      return scopeType.value === "family" ? "新建家庭衣橱" : "新建个人衣橱";
    });
    const pageDesc = common_vendor.computed(
      () => isEditMode.value ? "你可以继续调整衣柜样式、颜色、名称和房间信息。" : scopeType.value === "family" ? "为当前家庭空间新增一个衣橱，后续家庭成员可以一起查看和管理。" : "先选择一个你喜欢的衣柜样式和颜色，再填写名称与房间。"
    );
    const submitButtonText = common_vendor.computed(() => isEditMode.value ? "保存修改" : "创建衣橱");
    async function loadClosetDetail(targetClosetId) {
      var _a2, _b2;
      const result = await common_api_modules_closet.getClosetDetail({
        closetId: targetClosetId
      });
      const closet = result == null ? void 0 : result.closet;
      if (!closet) {
        throw new Error("衣橱详情不存在");
      }
      scopeType.value = closet.scope_type === "family" ? "family" : "personal";
      styleCode.value = closet.style_code || ((_a2 = styleOptions[0]) == null ? void 0 : _a2.code) || "";
      colorCode.value = closet.color_code || ((_b2 = colorOptions[0]) == null ? void 0 : _b2.code) || "";
      name.value = closet.name || "";
      roomName.value = closet.room_name || "";
      description.value = closet.description || "";
    }
    async function submitCloset() {
      if (!name.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入衣橱名称",
          icon: "none"
        });
        return;
      }
      if (!styleCode.value) {
        common_vendor.index.showToast({
          title: "请选择衣柜样式",
          icon: "none"
        });
        return;
      }
      if (!colorCode.value) {
        common_vendor.index.showToast({
          title: "请选择衣柜颜色",
          icon: "none"
        });
        return;
      }
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        if (isEditMode.value) {
          await common_api_modules_closet.updateCloset({
            closetId: closetId.value,
            name: name.value.trim(),
            roomName: roomName.value.trim(),
            styleCode: styleCode.value,
            colorCode: colorCode.value,
            description: description.value.trim()
          });
        } else {
          await common_api_modules_closet.createCloset({
            scopeType: scopeType.value,
            name: name.value.trim(),
            roomName: roomName.value.trim(),
            styleCode: styleCode.value,
            colorCode: colorCode.value,
            description: description.value.trim()
          });
        }
        common_vendor.index.showToast({
          title: isEditMode.value ? "衣橱修改成功" : "衣橱创建成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/closet-create/index.vue:143", "createCloset failed", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣橱创建失败",
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    }
    common_vendor.onLoad((options) => {
      scopeType.value = (options == null ? void 0 : options.scopeType) === "family" ? "family" : "personal";
      closetId.value = String((options == null ? void 0 : options.closetId) || "").trim();
      if (closetId.value) {
        loadClosetDetail(closetId.value).catch((error) => {
          common_vendor.index.__f__("error", "at pages/closet-create/index.vue:159", "loadClosetDetail failed", error);
          common_vendor.index.showToast({
            title: (error == null ? void 0 : error.message) || "衣橱详情加载失败",
            icon: "none"
          });
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(pageEyebrow.value),
        b: common_vendor.t(pageTitle.value),
        c: common_vendor.t(pageDesc.value),
        d: common_vendor.o(($event) => styleCode.value = $event, "a4"),
        e: common_vendor.p({
          options: common_vendor.unref(styleOptions),
          modelValue: styleCode.value
        }),
        f: common_vendor.o(($event) => colorCode.value = $event, "20"),
        g: common_vendor.p({
          options: common_vendor.unref(colorOptions),
          modelValue: colorCode.value
        }),
        h: common_vendor.o(($event) => name.value = $event, "59"),
        i: common_vendor.o(($event) => roomName.value = $event, "a6"),
        j: common_vendor.o(($event) => description.value = $event, "22"),
        k: common_vendor.p({
          name: name.value,
          ["room-name"]: roomName.value,
          description: description.value
        }),
        l: common_vendor.t(submitButtonText.value),
        m: submitting.value,
        n: common_vendor.o(submitCloset, "f3")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closet-create/index.js.map
