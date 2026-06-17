"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_modules_clothes = require("../../common/api/modules/clothes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_constants_clothesOptions = require("../../common/constants/clothes-options.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
const common_services_clothesScopeState = require("../../common/services/clothes-scope-state.js");
if (!Array) {
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  _easycom_u_loadmore2();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ClothesFilterBar + ClothesEmptyState + ClothesListCard + _easycom_u_loadmore + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ClothesEmptyState = () => "./components/ClothesEmptyState.js";
const ClothesFilterBar = () => "./components/ClothesFilterBar.js";
const ClothesListCard = () => "./components/ClothesListCard.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const clothesList = common_vendor.ref([]);
    const scopeType = common_vendor.ref("personal");
    const hasFamily = common_vendor.ref(false);
    const closetOptions = common_vendor.ref([]);
    const categoryOptions = common_constants_clothesOptions.CLOTHES_CATEGORY_OPTIONS;
    const seasonOptions = common_constants_clothesOptions.CLOTHES_SEASON_OPTIONS;
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const total = common_vendor.ref(0);
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (clothesList.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const showScopeSwitch = common_vendor.computed(() => hasFamily.value);
    const pageEyebrow = common_vendor.computed(() => scopeType.value === "family" ? "FAMILY CLOTHES" : "PERSONAL CLOTHES");
    const pageTitle = common_vendor.computed(() => scopeType.value === "family" ? "家庭衣物" : "我的衣物");
    const pageDesc = common_vendor.computed(
      () => scopeType.value === "family" ? "这里展示当前家庭下的全部衣物，方便家庭成员协作管理。" : showScopeSwitch.value ? "这里是你的个人衣物空间；需要切换到家庭视角时，可以直接使用上方切换。" : "管理你的个人衣物，可以按分类、季节或衣橱来筛选。"
    );
    const filters = common_vendor.ref({
      closetId: "",
      category: "",
      season: ""
    });
    async function syncScopeType() {
      const session = common_services_auth.getCurrentSession();
      if (!(session == null ? void 0 : session.uid)) {
        hasFamily.value = false;
        scopeType.value = "personal";
        return;
      }
      const membership = await common_services_familyMembership.getFamilyMembership(session.uid);
      hasFamily.value = membership.status === "success" && membership.hasFamily;
      if (!hasFamily.value) {
        scopeType.value = "personal";
        common_services_clothesScopeState.setClothesScopeState(session.uid, "personal");
        return;
      }
      scopeType.value = common_services_clothesScopeState.getClothesScopeState(session.uid);
    }
    function changeScope(nextScopeType) {
      if (nextScopeType === scopeType.value)
        return;
      if (nextScopeType === "family" && !hasFamily.value)
        return;
      const session = common_services_auth.getCurrentSession();
      scopeType.value = nextScopeType;
      common_services_clothesScopeState.setClothesScopeState(session == null ? void 0 : session.uid, nextScopeType);
      currentPage.value = 1;
      loadClothes();
    }
    async function onRefresh() {
      refreshing.value = true;
      currentPage.value = 1;
      await loadClothes();
      refreshing.value = false;
    }
    function onLoadMore() {
      if (loading.value || clothesList.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClothes(true);
    }
    async function loadClothes(append = false) {
      loading.value = true;
      try {
        const payload = {
          closetId: filters.value.closetId,
          category: filters.value.category,
          season: filters.value.season,
          page: currentPage.value,
          pageSize: pageSize.value
        };
        const result = scopeType.value === "family" ? await common_api_modules_clothes.getFamilyClothesList(payload) : await common_api_modules_clothes.getPersonalClothesList(payload);
        if (append) {
          clothesList.value = [...clothesList.value, ...(result == null ? void 0 : result.list) || []];
        } else {
          clothesList.value = (result == null ? void 0 : result.list) || [];
        }
        total.value = (result == null ? void 0 : result.total) || 0;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:191", "loadClothes failed", error);
        clothesList.value = [];
        total.value = 0;
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣物列表加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    async function loadClosetOptions() {
      try {
        const result = scopeType.value === "family" ? await common_api_modules_closet.getFamilyClosetList({ pageSize: 100 }) : await common_api_modules_closet.getPersonalClosetList({ pageSize: 100 });
        closetOptions.value = (result == null ? void 0 : result.list) || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clothes/index.vue:210", "loadClosetOptions failed", error);
        closetOptions.value = [];
      }
    }
    function goCreateClothes() {
      const scopeParam = scopeType.value === "family" ? "?scopeType=family" : "";
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesCreate}${scopeParam}`
      });
    }
    function handleFilterChange(nextFilters) {
      filters.value = {
        closetId: (nextFilters == null ? void 0 : nextFilters.closetId) || "",
        category: (nextFilters == null ? void 0 : nextFilters.category) || "",
        season: (nextFilters == null ? void 0 : nextFilters.season) || ""
      };
      currentPage.value = 1;
      loadClothes();
    }
    function resetFilters() {
      filters.value = {
        closetId: "",
        category: "",
        season: ""
      };
      currentPage.value = 1;
      loadClothes();
    }
    function goEditClothes(clothes) {
      const targetClothesId = clothes == null ? void 0 : clothes._id;
      if (!targetClothesId) {
        common_vendor.index.showToast({ title: "缺少衣物ID", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.clothesEdit}?clothesId=${targetClothesId}`
      });
    }
    function confirmDeleteClothes(clothes) {
      const targetClothesId = clothes == null ? void 0 : clothes._id;
      if (!targetClothesId) {
        common_vendor.index.showToast({ title: "缺少衣物ID", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "删除衣物",
        content: "删除后这条衣物记录会被移出当前列表，是否继续？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await common_api_modules_clothes.deleteClothes({ clothesId: targetClothesId });
            common_vendor.index.showToast({ title: "衣物已删除", icon: "success" });
            loadClothes();
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/clothes/index.vue:274", "deleteClothes failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "衣物删除失败",
              icon: "none"
            });
          }
        }
      });
    }
    common_vendor.onShow(async () => {
      await syncScopeType();
      await loadClosetOptions();
      loadClothes();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(pageEyebrow.value),
        b: common_vendor.t(pageTitle.value),
        c: common_vendor.t(pageDesc.value),
        d: common_vendor.o(goCreateClothes, "2f"),
        e: showScopeSwitch.value
      }, showScopeSwitch.value ? {
        f: scopeType.value === "personal" ? 1 : "",
        g: common_vendor.o(($event) => changeScope("personal"), "0c"),
        h: scopeType.value === "family" ? 1 : "",
        i: common_vendor.o(($event) => changeScope("family"), "67")
      } : {}, {
        j: common_vendor.o(handleFilterChange, "4e"),
        k: common_vendor.o(resetFilters, "9e"),
        l: common_vendor.p({
          filters: filters.value,
          ["closet-options"]: closetOptions.value,
          ["category-options"]: common_vendor.unref(categoryOptions),
          ["season-options"]: common_vendor.unref(seasonOptions)
        }),
        m: !loading.value && clothesList.value.length === 0
      }, !loading.value && clothesList.value.length === 0 ? {
        n: common_vendor.o(goCreateClothes, "18")
      } : {
        o: common_vendor.f(clothesList.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goEditClothes, item._id),
            c: common_vendor.o(confirmDeleteClothes, item._id),
            d: "0c36ef95-2-" + i0,
            e: common_vendor.p({
              clothes: item,
              ["show-creator"]: scopeType.value === "family"
            })
          };
        })
      }, {
        p: clothesList.value.length > 0
      }, clothesList.value.length > 0 ? {
        q: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}, {
        r: refreshing.value,
        s: common_vendor.o(onRefresh, "98"),
        t: common_vendor.o(onLoadMore, "ff"),
        v: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).clothes
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clothes/index.js.map
