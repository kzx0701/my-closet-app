"use strict";
const common_vendor = require("../../common/vendor.js");
const common_services_auth = require("../../common/services/auth.js");
const common_api_modules_auth = require("../../common/api/modules/auth.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_rect = common_vendor.resolveComponent("rect");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_path + _component_svg + _component_circle + _component_rect + _component_line + _component_polyline + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(20);
    const hasPassword = common_vendor.ref(false);
    const currentUserId = common_vendor.ref("");
    const userInfo = common_vendor.ref({
      nickname: "",
      username: "",
      avatar: "",
      mobile: "",
      email: ""
    });
    const nicknamePopup = common_vendor.ref(null);
    const avatarText = common_vendor.computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || "";
      return name.charAt(0).toUpperCase() || "U";
    });
    const maskedMobile = common_vendor.computed(() => {
      const mobile = userInfo.value.mobile;
      if (!mobile || mobile.length < 7)
        return mobile;
      return mobile.slice(0, 3) + "****" + mobile.slice(7);
    });
    function goBack() {
      common_vendor.index.navigateBack({ delta: 1 });
    }
    async function loadUserInfo() {
      var _a;
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid))
        return;
      currentUserId.value = session.uid;
      const storeInfo = uni_modules_uniIdPages_common_store.store.userInfo || {};
      userInfo.value = {
        nickname: storeInfo.nickname || "",
        username: storeInfo.username || "",
        avatar: ((_a = storeInfo.avatar_file) == null ? void 0 : _a.url) || "",
        mobile: storeInfo.mobile || "",
        email: storeInfo.email || ""
      };
      try {
        const freshInfo = await common_api_modules_auth.getCurrentUserInfo(session.uid);
        if (freshInfo) {
          userInfo.value.nickname = freshInfo.nickname || userInfo.value.nickname;
          userInfo.value.username = freshInfo.username || userInfo.value.username;
          userInfo.value.avatar = freshInfo.avatar || userInfo.value.avatar;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user-info/index.vue:211", "loadUserInfo failed", e);
      }
      try {
        const uniIdCo = common_vendor._r.importObject("uni-id-co");
        const res = await uniIdCo.getAccountInfo();
        hasPassword.value = (res == null ? void 0 : res.isPasswordSet) || false;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user-info/index.vue:220", "getAccountInfo failed", e);
      }
    }
    function editNickname() {
      var _a;
      (_a = nicknamePopup.value) == null ? void 0 : _a.open();
    }
    async function confirmNickname(nickname) {
      var _a;
      if (!nickname || !nickname.trim()) {
        common_vendor.index.showToast({ title: "昵称不能为空", icon: "none" });
        return;
      }
      const trimmed = nickname.trim();
      uni_modules_uniIdPages_common_store.mutations.updateUserInfo({ nickname: trimmed });
      userInfo.value.nickname = trimmed;
      (_a = nicknamePopup.value) == null ? void 0 : _a.close();
    }
    function changeAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          await uploadAvatar(tempFilePath);
        },
        fail: () => {
        }
      });
    }
    async function uploadAvatar(filePath) {
      common_vendor.index.showLoading({ title: "上传中...", mask: true });
      try {
        const ext = filePath.split(".").pop() || "jpg";
        const cloudPath = `avatar/${currentUserId.value || Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const uploadResult = await common_vendor._r.uploadFile({
          filePath,
          cloudPath,
          fileType: "image"
        });
        const avatarFile = {
          name: cloudPath,
          extname: ext,
          url: uploadResult.fileID
        };
        common_vendor.index.hideLoading();
        uni_modules_uniIdPages_common_store.mutations.updateUserInfo({ avatar_file: avatarFile });
        userInfo.value.avatar = avatarFile.url;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user-info/index.vue:277", "uploadAvatar failed", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: (error == null ? void 0 : error.message) || "头像上传失败", icon: "none" });
      }
    }
    function goBindMobile() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile"
      });
    }
    function goBindEmail() {
      common_vendor.index.showToast({ title: "邮箱绑定功能开发中", icon: "none" });
    }
    function goChangePassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd"
      });
    }
    function goSetPassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd"
      });
    }
    common_vendor.onLoad(() => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      loadUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          d: "M15 18l-6-6 6-6"
        }),
        b: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        c: common_vendor.o(goBack, "31"),
        d: statusBarHeight.value + "px",
        e: userInfo.value.avatar
      }, userInfo.value.avatar ? {
        f: userInfo.value.avatar
      } : {
        g: common_vendor.t(avatarText.value)
      }, {
        h: common_vendor.p({
          d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        }),
        i: common_vendor.p({
          cx: "12",
          cy: "13",
          r: "4"
        }),
        j: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        k: common_vendor.o(changeAvatar, "88"),
        l: common_vendor.p({
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        m: common_vendor.p({
          cx: "12",
          cy: "7",
          r: "4"
        }),
        n: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        o: common_vendor.t(userInfo.value.nickname || userInfo.value.username || "未设置"),
        p: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        q: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        r: common_vendor.o(editNickname, "92"),
        s: common_vendor.p({
          x: "5",
          y: "2",
          width: "14",
          height: "20",
          rx: "2",
          ry: "2"
        }),
        t: common_vendor.p({
          x1: "12",
          y1: "18",
          x2: "12.01",
          y2: "18"
        }),
        v: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        w: userInfo.value.mobile
      }, userInfo.value.mobile ? {
        x: common_vendor.t(maskedMobile.value)
      } : {}, {
        y: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        z: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        A: common_vendor.o(goBindMobile, "5a"),
        B: common_vendor.p({
          d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        }),
        C: common_vendor.p({
          points: "22,6 12,13 2,6"
        }),
        D: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        E: userInfo.value.email
      }, userInfo.value.email ? {
        F: common_vendor.t(userInfo.value.email)
      } : {}, {
        G: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        H: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        I: common_vendor.o(goBindEmail, "4f"),
        J: hasPassword.value
      }, hasPassword.value ? {
        K: common_vendor.p({
          x: "3",
          y: "11",
          width: "18",
          height: "11",
          rx: "2",
          ry: "2"
        }),
        L: common_vendor.p({
          d: "M7 11V7a5 5 0 0 1 10 0v4"
        }),
        M: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        N: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        O: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        P: common_vendor.o(goChangePassword, "c7")
      } : {
        Q: common_vendor.p({
          x: "3",
          y: "11",
          width: "18",
          height: "11",
          rx: "2",
          ry: "2"
        }),
        R: common_vendor.p({
          d: "M7 11V7a5 5 0 0 1 10 0v4"
        }),
        S: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        T: common_vendor.p({
          d: "M9 18l6-6-6-6"
        }),
        U: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        V: common_vendor.o(goSetPassword, "06")
      }, {
        W: common_vendor.o(confirmNickname, "e8"),
        X: common_vendor.p({
          mode: "input",
          value: userInfo.value.nickname,
          title: "修改昵称",
          placeholder: "请输入昵称"
        }),
        Y: common_vendor.sr(nicknamePopup, "5f170d81-30", {
          "k": "nicknamePopup"
        }),
        Z: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f170d81"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user-info/index.js.map
