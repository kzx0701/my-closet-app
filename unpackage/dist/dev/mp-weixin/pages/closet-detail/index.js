"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_constants_closetOptions = require("../../common/constants/closet-options.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
const common_utils_navHelper = require("../../common/utils/nav-helper.js");
const common_services_clothesWearRecord = require("../../common/services/clothes-wear-record.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_component_path + _component_svg + _component_circle + _component_line + _component_polyline + _easycom_u_loadmore2)();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ScopeBadge + _easycom_u_loadmore)();
}
const ScopeBadge = () => "../../components/ScopeBadge.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const closet = common_vendor.ref({});
    const clothes = common_vendor.ref([]);
    const statusBarHeight = common_vendor.ref(20);
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(false);
    const currentClosetId = common_vendor.ref("");
    const scopeType = common_vendor.ref("personal");
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const total = common_vendor.ref(0);
    const hasInitialized = common_vendor.ref(false);
    const wearCountMap = common_vendor.ref({});
    const closetId = common_vendor.computed(() => closet.value._id || currentClosetId.value || "");
    const scopeBadgeText = common_vendor.computed(
      () => scopeType.value === "family" ? "Family · 家庭空间" : "Personal · 个人空间"
    );
    const styleName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_STYLE_OPTIONS.find((item) => item.code === closet.value.style_code)) == null ? void 0 : _a.name) || "—";
    });
    const colorName = common_vendor.computed(() => {
      var _a;
      return ((_a = common_constants_closetOptions.CLOSET_COLOR_OPTIONS.find((item) => item.code === closet.value.color_code)) == null ? void 0 : _a.name) || "—";
    });
    common_vendor.computed(() => {
      const parts = [styleName.value, colorName.value];
      if (closet.value.room_name) {
        parts.push(closet.value.room_name);
      }
      return parts.join(" · ");
    });
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (clothes.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const tagPillStyle = common_vendor.computed(() => {
      const colorOption = common_constants_closetOptions.CLOSET_COLOR_OPTIONS.find((item) => item.code === closet.value.color_code);
      const bg = (colorOption == null ? void 0 : colorOption.color) || "#a8bcae";
      return {
        background: bg + "22",
        borderColor: bg + "44"
      };
    });
    function itemColorHex(item) {
      const code = item.color;
      if (!code)
        return "#ccc";
      const opt = common_constants_clothesOptions.CLOTHES_COLOR_OPTIONS.find((o) => o.code === code);
      return (opt == null ? void 0 : opt.hex) || "#ccc";
    }
    function itemStyleName(item) {
      var _a;
      return ((_a = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS.find((o) => o.code === item.category)) == null ? void 0 : _a.name) || "未分类";
    }
    function goClothesDetail(item) {
      const targetId = item == null ? void 0 : item._id;
      if (!targetId)
        return;
      common_utils_navHelper.safeNavigateTo(`${common_constants_routes.ROUTES.clothesDetail}?clothesId=${targetId}`);
    }
    async function loadClosetDetail(targetClosetId) {
      const result = await common_api_modules_closet.getClosetDetail({ closetId: targetClosetId });
      const closetData = result == null ? void 0 : result.closet;
      if (!closetData) {
        throw new Error("衣橱详情不存在");
      }
      closet.value = closetData;
      scopeType.value = closetData.scope_type === "family" ? "family" : "personal";
    }
    async function loadClothes(append = false) {
      if (!currentClosetId.value)
        return;
      try {
        const payload = {
          closetId: currentClosetId.value,
          page: currentPage.value,
          pageSize: pageSize.value
        };
        const result = scopeType.value === "family" ? await common_api_modules_clothes.getFamilyClothesList(payload) : await common_api_modules_clothes.getPersonalClothesList(payload);
        if (append) {
          clothes.value = [...clothes.value, ...(result == null ? void 0 : result.list) || []];
        } else {
          clothes.value = (result == null ? void 0 : result.list) || [];
        }
        total.value = (result == null ? void 0 : result.total) || 0;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/closet-detail/index.vue:291", "loadClothes failed", err);
        if (!append) {
          clothes.value = [];
        }
        total.value = 0;
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "衣物列表加载失败",
          icon: "none"
        });
      }
      refreshWearCountMap();
    }
    function refreshWearCountMap() {
      const session = common_services_auth.getCurrentSession();
      const uid = (session == null ? void 0 : session.uid) || "guest";
      const ids = clothes.value.map((item) => item._id).filter(Boolean);
      wearCountMap.value = common_services_clothesWearRecord.getClothesWearCountMap(uid, ids);
    }
    async function loadDetailData(targetId) {
      loading.value = true;
      error.value = false;
      try {
        await loadClosetDetail(targetId);
        currentPage.value = 1;
        await loadClothes();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/closet-detail/index.vue:320", "loadDetailData failed", err);
        error.value = true;
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "衣橱详情加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function retryLoad() {
      if (currentClosetId.value) {
        loadDetailData(currentClosetId.value);
      }
    }
    function handleEdit() {
      if (!closetId.value)
        return;
      common_utils_navHelper.safeNavigateTo(`${common_constants_routes.ROUTES.closetCreate}?closetId=${closetId.value}`);
    }
    function goAddClothes() {
      if (!closetId.value)
        return;
      common_utils_navHelper.safeNavigateTo(`${common_constants_routes.ROUTES.clothesCreate}?closetId=${closetId.value}&scopeType=${scopeType.value}`);
    }
    function goBack() {
      common_utils_navHelper.safeNavigateBack(common_constants_routes.ROUTES.closets);
    }
    common_vendor.onReachBottom(() => {
      if (loading.value || clothes.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClothes(true);
    });
    common_vendor.onLoad(async (options) => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      const targetClosetId = String((options == null ? void 0 : options.closetId) || "").trim();
      scopeType.value = (options == null ? void 0 : options.scopeType) === "family" ? "family" : "personal";
      if (!targetClosetId) {
        common_vendor.index.showToast({ title: "衣橱不存在", icon: "none" });
        setTimeout(() => common_vendor.index.navigateBack(), 500);
        return;
      }
      currentClosetId.value = targetClosetId;
      await loadDetailData(targetClosetId);
      hasInitialized.value = true;
    });
    common_vendor.onShow(() => {
      if (currentClosetId.value && hasInitialized.value) {
        loadDetailData(currentClosetId.value);
      }
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
        c: common_vendor.o(goBack, "55"),
        d: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        e: common_vendor.p({
          cx: "12",
          cy: "5",
          r: "1"
        }),
        f: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "1"
        }),
        g: common_vendor.p({
          cx: "12",
          cy: "19",
          r: "1"
        }),
        h: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        i: common_vendor.o(handleEdit, "72")
      } : {}, {
        j: statusBarHeight.value + "px",
        k: common_vendor.p({
          d: "M 0 40 Q 187 15 375 40",
          fill: "none",
          stroke: "rgba(244,239,230,0.05)",
          ["stroke-width"]: "1"
        }),
        l: common_vendor.p({
          d: "M 0 100 Q 187 75 375 100",
          fill: "none",
          stroke: "rgba(244,239,230,0.04)",
          ["stroke-width"]: "1"
        }),
        m: common_vendor.p({
          d: "M 0 160 Q 187 135 375 160",
          fill: "none",
          stroke: "rgba(244,239,230,0.03)",
          ["stroke-width"]: "1"
        }),
        n: common_vendor.p({
          viewBox: "0 0 375 200",
          preserveAspectRatio: "none"
        }),
        o: common_vendor.p({
          text: scopeBadgeText.value
        }),
        p: common_vendor.t(closet.value.name || "未命名衣橱"),
        q: common_vendor.t(styleName.value),
        r: common_vendor.s(tagPillStyle.value),
        s: common_vendor.t(colorName.value),
        t: common_vendor.s(tagPillStyle.value),
        v: closet.value.room_name
      }, closet.value.room_name ? {
        w: common_vendor.t(closet.value.room_name),
        x: common_vendor.s(tagPillStyle.value)
      } : {}, {
        y: common_vendor.t(clothes.value.length),
        z: loading.value && clothes.value.length === 0
      }, loading.value && clothes.value.length === 0 ? {
        A: common_vendor.f(6, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : error.value ? {
        C: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        D: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        E: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        F: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        G: common_vendor.p({
          points: "23 4 23 10 17 10"
        }),
        H: common_vendor.p({
          d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
        }),
        I: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        J: common_vendor.o(retryLoad, "41")
      } : clothes.value.length === 0 ? {
        L: common_vendor.p({
          d: "M40 10 C40 10 28 10 28 18 C28 22 34 24 40 24 C46 24 52 22 52 18 C52 10 40 10 40 10Z",
          stroke: "#c8cebf",
          ["stroke-width"]: "1.5",
          fill: "none"
        }),
        M: common_vendor.p({
          x1: "40",
          y1: "10",
          x2: "40",
          y2: "4",
          stroke: "#c8cebf",
          ["stroke-width"]: "1.5"
        }),
        N: common_vendor.p({
          cx: "40",
          cy: "3",
          r: "2",
          stroke: "#c8cebf",
          ["stroke-width"]: "1.5",
          fill: "none"
        }),
        O: common_vendor.p({
          x1: "40",
          y1: "24",
          x2: "40",
          y2: "56",
          stroke: "#c8cebf",
          ["stroke-width"]: "1.5"
        }),
        P: common_vendor.p({
          x1: "28",
          y1: "56",
          x2: "52",
          y2: "56",
          stroke: "#c8cebf",
          ["stroke-width"]: "1.5"
        }),
        Q: common_vendor.p({
          x1: "32",
          y1: "24",
          x2: "32",
          y2: "40",
          stroke: "#dce0d4",
          ["stroke-width"]: "1",
          ["stroke-dasharray"]: "3 3"
        }),
        R: common_vendor.p({
          x1: "48",
          y1: "24",
          x2: "48",
          y2: "40",
          stroke: "#dce0d4",
          ["stroke-width"]: "1",
          ["stroke-dasharray"]: "3 3"
        }),
        S: common_vendor.p({
          viewBox: "0 0 80 80",
          fill: "none",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        T: common_vendor.o(goAddClothes, "53")
      } : common_vendor.e({
        U: common_vendor.f(clothes.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.image_url
          }, item.image_url ? {
            b: item.image_url
          } : {
            c: "4dc0e16e-27-" + i0 + "," + ("4dc0e16e-26-" + i0),
            d: common_vendor.p({
              d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
            }),
            e: "4dc0e16e-26-" + i0,
            f: common_vendor.p({
              viewBox: "0 0 24 24",
              fill: "none",
              ["stroke-width"]: "1.2",
              ["stroke-linecap"]: "round",
              ["stroke-linejoin"]: "round"
            })
          }, {
            g: common_vendor.t(item.name),
            h: itemColorHex(item),
            i: common_vendor.t(itemStyleName(item)),
            j: item._id,
            k: common_vendor.o(($event) => goClothesDetail(item), item._id)
          });
        }),
        V: clothes.value.length > 0
      }, clothes.value.length > 0 ? {
        W: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}), {
        B: error.value,
        K: clothes.value.length === 0,
        X: !loading.value && !error.value && clothes.value.length >= 0
      }, !loading.value && !error.value && clothes.value.length >= 0 ? {
        Y: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        Z: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        aa: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        ab: common_vendor.o(goAddClothes, "69")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4dc0e16e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closet-detail/index.js.map
