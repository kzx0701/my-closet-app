"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_constants_closetOptions = require("../../common/constants/closet-options.js");
const common_utils_navHelper = require("../../common/utils/nav-helper.js");
const common_services_clothesWearRecord = require("../../common/services/clothes-wear-record.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_component_path + _component_svg + _component_circle + _component_line + _easycom_u_loadmore2)();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ScopeBadge + ClothesListCard + _easycom_u_loadmore)();
}
const ScopeBadge = () => "../../components/ScopeBadge.js";
const ClothesListCard = () => "../clothes/components/ClothesListCard.js";
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
    const heroDesc = common_vendor.computed(() => {
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
        common_vendor.index.__f__("error", "at pages/closet-detail/index.vue:199", "loadClothes failed", err);
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
        common_vendor.index.__f__("error", "at pages/closet-detail/index.vue:230", "loadDetailData failed", err);
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
        c: common_vendor.o(goBack, "de"),
        d: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        e: common_vendor.o(handleEdit, "49")
      } : {}, {
        f: statusBarHeight.value + "px",
        g: common_vendor.p({
          text: scopeBadgeText.value
        }),
        h: common_vendor.t(closet.value.name || "未命名衣橱"),
        i: common_vendor.t(heroDesc.value),
        j: common_vendor.t(clothes.value.length),
        k: common_vendor.t(styleName.value),
        l: common_vendor.t(colorName.value),
        m: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        n: common_vendor.t(clothes.value.length)
      } : {}, {
        o: loading.value && clothes.value.length === 0
      }, loading.value && clothes.value.length === 0 ? {
        p: common_vendor.f(6, (n, k0, i0) => {
          return {
            a: n
          };
        })
      } : error.value ? {
        r: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        s: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        t: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        v: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        w: common_vendor.o(retryLoad, "f0")
      } : clothes.value.length === 0 ? {
        y: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        z: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.3",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        A: common_vendor.o(goAddClothes, "a7")
      } : {
        B: common_vendor.f(clothes.value, (item, k0, i0) => {
          return common_vendor.e({
            a: "4dc0e16e-9-" + i0,
            b: common_vendor.p({
              clothes: item
            }),
            c: wearCountMap.value[item._id] > 0
          }, wearCountMap.value[item._id] > 0 ? {
            d: common_vendor.t(wearCountMap.value[item._id])
          } : {}, {
            e: item._id
          });
        })
      }, {
        q: error.value,
        x: clothes.value.length === 0,
        C: clothes.value.length > 0
      }, clothes.value.length > 0 ? {
        D: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}, {
        E: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        F: common_vendor.o(goAddClothes, "09")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4dc0e16e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closet-detail/index.js.map
