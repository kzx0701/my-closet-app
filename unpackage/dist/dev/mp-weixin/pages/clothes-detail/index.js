"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_utils_navHelper = require("../../common/utils/nav-helper.js");
const common_services_auth = require("../../common/services/auth.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_line = common_vendor.resolveComponent("line");
  (_component_path + _component_svg + _component_circle + _component_line)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const clothes = common_vendor.ref({});
    const closetList = common_vendor.ref([]);
    const statusBarHeight = common_vendor.ref(20);
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(false);
    const currentClothesId = common_vendor.ref("");
    const hasInitialized = common_vendor.ref(false);
    const imageLoadError = common_vendor.ref(false);
    const wearRecord = common_vendor.ref({ count: 0, lastWorn: null });
    const clothesId = common_vendor.computed(() => clothes.value._id || "");
    const clothesIdShort = common_vendor.computed(() => {
      const id = clothesId.value;
      if (!id)
        return "—";
      return id.length > 12 ? `${id.slice(0, 12)}…` : id;
    });
    const categoryName = common_vendor.computed(() => {
      var _a;
      const code = clothes.value.category;
      return ((_a = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS.find((item) => item.code === code)) == null ? void 0 : _a.name) || "未分类";
    });
    const colorOption = common_vendor.computed(() => {
      const code = clothes.value.color;
      if (!code)
        return null;
      return common_constants_clothesOptions.CLOTHES_COLOR_OPTIONS.find((item) => item.code === code) || null;
    });
    const colorDotStyle = common_vendor.computed(() => {
      if (!colorOption.value)
        return {};
      const hex = colorOption.value.hex || "";
      if (hex.startsWith("linear-gradient")) {
        return { background: hex };
      }
      return { background: hex };
    });
    const seasonName = common_vendor.computed(() => {
      const codes = String(clothes.value.season || "").split(",").map((item) => item.trim()).filter(Boolean);
      if (!codes.length)
        return "—";
      return codes.map((code) => {
        var _a;
        return ((_a = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)) == null ? void 0 : _a.name) || code;
      }).join(" · ");
    });
    const seasonMarkColor = common_vendor.computed(() => {
      const firstSeason = String(clothes.value.season || "").split(",").map((item) => item.trim()).filter(Boolean)[0];
      return common_constants_clothesOptions.SEASON_COLOR_MAP[firstSeason] || "";
    });
    const closetName = common_vendor.computed(() => {
      var _a;
      const closetId = clothes.value.closet_id;
      if (!closetId)
        return "暂未归类";
      return ((_a = closetList.value.find((item) => item._id === closetId)) == null ? void 0 : _a.name) || "已删除衣橱";
    });
    const closetExists = common_vendor.computed(() => {
      const closetId = clothes.value.closet_id;
      if (!closetId)
        return false;
      return closetList.value.some((item) => item._id === closetId);
    });
    const metaText = common_vendor.computed(() => {
      const parts = [categoryName.value];
      const seasonCodes = String(clothes.value.season || "").split(",").map((item) => item.trim()).filter(Boolean);
      const seasonNames = seasonCodes.map((code) => {
        var _a;
        return (_a = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS.find((item) => item.code === code)) == null ? void 0 : _a.name;
      }).filter(Boolean).join("·");
      if (seasonNames)
        parts.push(seasonNames);
      let text = parts.join("·");
      if (clothes.value.closet_id) {
        text += ` / ${closetName.value}`;
      }
      return text;
    });
    const createdDateText = common_vendor.computed(() => {
      const timestamp = clothes.value.created_at;
      if (!timestamp)
        return "—";
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime()))
        return "—";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    });
    const wearLastText = common_vendor.computed(() => {
      var _a;
      const last = (_a = wearRecord.value) == null ? void 0 : _a.lastWorn;
      if (!last)
        return "暂无记录";
      const diff = Date.now() - last;
      if (diff < 0)
        return "刚刚";
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (days >= 1)
        return `最后穿着：${days}天前`;
      if (hours >= 1)
        return `最后穿着：${hours}小时前`;
      if (minutes >= 1)
        return `最后穿着：${minutes}分钟前`;
      return "最后穿着：刚刚";
    });
    function getWearStorageKey(targetClothesId) {
      const session = common_services_auth.getCurrentSession();
      return `clothes_wear_${(session == null ? void 0 : session.uid) || "anonymous"}_${targetClothesId}`;
    }
    function loadWearRecord(targetClothesId) {
      if (!targetClothesId)
        return { count: 0, lastWorn: null };
      const key = getWearStorageKey(targetClothesId);
      const data = common_vendor.index.getStorageSync(key);
      return data || { count: 0, lastWorn: null };
    }
    function saveWearRecord(targetClothesId, record) {
      if (!targetClothesId)
        return;
      const key = getWearStorageKey(targetClothesId);
      common_vendor.index.setStorageSync(key, record);
    }
    function recordWear() {
      if (!clothesId.value)
        return;
      const record = loadWearRecord(clothesId.value);
      record.count = (record.count || 0) + 1;
      record.lastWorn = Date.now();
      saveWearRecord(clothesId.value, record);
      wearRecord.value = { ...record };
      common_vendor.index.showToast({ title: "已记录穿着", icon: "success" });
    }
    async function loadClosetList() {
      const scopeType = clothes.value.scope_type === "family" ? "family" : "personal";
      try {
        const result = scopeType === "family" ? await common_api_modules_closet.getFamilyClosetList({ pageSize: 100 }) : await common_api_modules_closet.getPersonalClosetList({ pageSize: 100 });
        closetList.value = (result == null ? void 0 : result.list) || [];
      } catch (error2) {
        common_vendor.index.__f__("error", "at pages/clothes-detail/index.vue:327", "loadClosetList failed", error2);
        closetList.value = [];
      }
    }
    async function loadClothesDetail(targetClothesId) {
      const result = await common_api_modules_clothes.getClothesDetail({ clothesId: targetClothesId });
      clothes.value = (result == null ? void 0 : result.clothes) || {};
    }
    async function loadDetailData(targetId) {
      loading.value = true;
      error.value = false;
      imageLoadError.value = false;
      try {
        await loadClothesDetail(targetId);
        await loadClosetList();
        wearRecord.value = loadWearRecord(targetId);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/clothes-detail/index.vue:347", "loadDetailData failed", err);
        error.value = true;
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "衣物详情加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function retryLoad() {
      if (currentClothesId.value) {
        loadDetailData(currentClothesId.value);
      }
    }
    function handleEdit() {
      if (!clothesId.value)
        return;
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesEdit}?clothesId=${clothesId.value}&scopeType=${clothes.value.scope_type || "personal"}`
      });
    }
    function goClosetDetail() {
      const targetClosetId = clothes.value.closet_id;
      if (!targetClosetId)
        return;
      if (!closetExists.value) {
        common_vendor.index.showToast({
          title: "该衣橱已被删除",
          icon: "none"
        });
        return;
      }
      const targetScopeType = clothes.value.scope_type === "family" ? "family" : "personal";
      common_utils_navHelper.safeNavigateTo(`${common_constants_routes.ROUTES.closetDetail}?closetId=${targetClosetId}&scopeType=${targetScopeType}`);
    }
    function handleDelete() {
      common_vendor.index.showModal({
        title: "删除衣物",
        content: "确定要删除这件衣物吗？删除后无法恢复。",
        confirmColor: "#b85c3a",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_clothes.deleteClothes({ clothesId: clothesId.value });
            common_vendor.index.showToast({ title: "衣物已删除", icon: "success" });
            common_vendor.index.$emit("clothes:need-refresh");
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 300);
          } catch (error2) {
            common_vendor.index.__f__("error", "at pages/clothes-detail/index.vue:404", "deleteClothes failed", error2);
            common_vendor.index.showToast({
              title: (error2 == null ? void 0 : error2.message) || "删除失败",
              icon: "none"
            });
          }
        }
      });
    }
    function previewImage() {
      if (clothes.value.image_url) {
        common_vendor.index.previewImage({
          urls: [clothes.value.image_url],
          current: clothes.value.image_url
        });
      }
    }
    function onImageError() {
      imageLoadError.value = true;
    }
    function goBack() {
      common_utils_navHelper.safeNavigateBack(common_constants_routes.ROUTES.home);
    }
    common_vendor.onShareAppMessage(() => {
      var _a, _b;
      return {
        title: `看看这件：${((_a = clothes.value) == null ? void 0 : _a.name) || "我的衣物"}`,
        path: `/pages/clothes-detail/index?clothesId=${clothesId.value}`,
        imageUrl: (_b = clothes.value) == null ? void 0 : _b.image_url
      };
    });
    common_vendor.onLoad(async (options) => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 20;
      } catch (e) {
        statusBarHeight.value = 20;
      }
      const targetClothesId = String((options == null ? void 0 : options.clothesId) || "").trim();
      if (!targetClothesId) {
        common_vendor.index.showToast({ title: "衣物不存在", icon: "none" });
        setTimeout(() => common_vendor.index.navigateBack(), 500);
        return;
      }
      currentClothesId.value = targetClothesId;
      await loadDetailData(targetClothesId);
      hasInitialized.value = true;
    });
    common_vendor.onShow(() => {
      if (currentClothesId.value && hasInitialized.value) {
        loadDetailData(currentClothesId.value);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : !error.value && clothes.value.image_url && !imageLoadError.value ? {
        c: clothes.value.image_url,
        d: common_vendor.o(previewImage, "6d"),
        e: common_vendor.o(onImageError, "88")
      } : !error.value ? {
        g: common_vendor.p({
          d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
        }),
        h: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "1.4",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        })
      } : {}, {
        b: !error.value && clothes.value.image_url && !imageLoadError.value,
        f: !error.value,
        i: !loading.value && !error.value && seasonMarkColor.value
      }, !loading.value && !error.value && seasonMarkColor.value ? {
        j: seasonMarkColor.value
      } : {}, {
        k: common_vendor.p({
          d: "M15 18l-6-6 6-6"
        }),
        l: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        m: common_vendor.o(goBack, "c5"),
        n: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        o: common_vendor.p({
          cx: "18",
          cy: "5",
          r: "3"
        }),
        p: common_vendor.p({
          cx: "6",
          cy: "12",
          r: "3"
        }),
        q: common_vendor.p({
          cx: "18",
          cy: "19",
          r: "3"
        }),
        r: common_vendor.p({
          x1: "8.59",
          y1: "13.51",
          x2: "15.42",
          y2: "17.49"
        }),
        s: common_vendor.p({
          x1: "15.41",
          y1: "6.51",
          x2: "8.59",
          y2: "10.49"
        }),
        t: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        v: common_vendor.o(handleEdit, "e7")
      } : {}, {
        w: statusBarHeight.value + "px",
        x: loading.value
      }, loading.value ? {} : error.value ? {
        z: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        A: common_vendor.p({
          x1: "12",
          y1: "8",
          x2: "12",
          y2: "12"
        }),
        B: common_vendor.p({
          x1: "12",
          y1: "16",
          x2: "12.01",
          y2: "16"
        }),
        C: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          ["stroke-width"]: "1.5",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        D: common_vendor.o(retryLoad, "0d")
      } : common_vendor.e({
        E: common_vendor.t(clothes.value.name || "未命名衣物"),
        F: common_vendor.t(metaText.value),
        G: common_vendor.t(categoryName.value),
        H: colorOption.value
      }, colorOption.value ? {
        I: colorOption.value.code === "multicolor" ? 1 : "",
        J: common_vendor.s(colorDotStyle.value),
        K: common_vendor.t(colorOption.value.label)
      } : {}, {
        L: common_vendor.t(seasonName.value),
        M: common_vendor.t(closetName.value),
        N: clothes.value.closet_id && closetExists.value ? 1 : "",
        O: common_vendor.o(goClosetDetail, "1d"),
        P: common_vendor.t(clothes.value.scope_type === "family" ? "家庭空间" : "个人空间"),
        Q: common_vendor.t(wearRecord.value.count),
        R: common_vendor.t(wearLastText.value),
        S: common_vendor.o(recordWear, "56"),
        T: clothes.value.remark
      }, clothes.value.remark ? {
        U: common_vendor.t(clothes.value.remark)
      } : {}, {
        V: common_vendor.t(createdDateText.value),
        W: common_vendor.t(clothesIdShort.value)
      }), {
        y: error.value,
        X: !loading.value && !error.value
      }, !loading.value && !error.value ? {
        Y: common_vendor.o(handleEdit, "a9"),
        Z: common_vendor.o(handleDelete, "07")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-08728ea1"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes-detail/index.js.map
