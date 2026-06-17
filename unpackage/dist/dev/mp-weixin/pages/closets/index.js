"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants_routes = require("../../common/constants/routes.js");
const common_api_modules_closet = require("../../common/api/modules/closet.js");
const common_services_auth = require("../../common/services/auth.js");
const common_services_closetScopeState = require("../../common/services/closet-scope-state.js");
const common_services_familyMembership = require("../../common/services/family-membership.js");
if (!Array) {
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  _easycom_u_loadmore2();
}
const _easycom_u_loadmore = () => "../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (ClosetEmptyState + ClosetListCard + _easycom_u_loadmore + H5TabBar)();
}
const H5TabBar = () => "../../components/H5TabBar.js";
const ClosetEmptyState = () => "./components/ClosetEmptyState.js";
const ClosetListCard = () => "./components/ClosetListCard.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const closets = common_vendor.ref([]);
    const scopeType = common_vendor.ref("personal");
    const hasFamily = common_vendor.ref(false);
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const total = common_vendor.ref(0);
    const loadMoreStatus = common_vendor.computed(() => {
      if (loading.value)
        return "loading";
      if (closets.value.length >= total.value)
        return "nomore";
      return "loadmore";
    });
    const allowCreate = common_vendor.computed(() => scopeType.value === "personal" || hasFamily.value);
    const showScopeSwitch = common_vendor.computed(() => hasFamily.value);
    const pageEyebrow = common_vendor.computed(() => scopeType.value === "family" ? "FAMILY CLOSETS" : "PERSONAL CLOSETS");
    const pageTitle = common_vendor.computed(() => scopeType.value === "family" ? "家庭衣橱" : "我的衣橱");
    const pageDesc = common_vendor.computed(
      () => scopeType.value === "family" ? "这里展示当前家庭下的全部衣橱，方便家庭成员协作管理，管理员也能查看不同创建者的衣橱。" : showScopeSwitch.value ? "这里是你的个人衣橱空间；需要切换到家庭视角时，可以直接使用上方切换。" : "这里是你的个人衣橱空间，适合先按房间、季节或用途整理自己的收纳结构。"
    );
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
        common_services_closetScopeState.setClosetScopeState(session.uid, "personal");
        return;
      }
      scopeType.value = common_services_closetScopeState.getClosetScopeState(session.uid);
    }
    function changeScope(nextScopeType) {
      if (nextScopeType === scopeType.value) {
        return;
      }
      if (nextScopeType === "family" && !hasFamily.value) {
        return;
      }
      const session = common_services_auth.getCurrentSession();
      scopeType.value = nextScopeType;
      common_services_closetScopeState.setClosetScopeState(session == null ? void 0 : session.uid, nextScopeType);
      currentPage.value = 1;
      loadClosets();
    }
    async function onRefresh() {
      refreshing.value = true;
      currentPage.value = 1;
      await loadClosets();
      refreshing.value = false;
    }
    function onLoadMore() {
      if (loading.value || closets.value.length >= total.value)
        return;
      currentPage.value += 1;
      loadClosets(true);
    }
    async function loadClosets(append = false) {
      loading.value = true;
      try {
        const payload = { page: currentPage.value, pageSize: pageSize.value };
        const result = scopeType.value === "family" ? await common_api_modules_closet.getFamilyClosetList(payload) : await common_api_modules_closet.getPersonalClosetList(payload);
        if (append) {
          closets.value = [...closets.value, ...(result == null ? void 0 : result.list) || []];
        } else {
          closets.value = (result == null ? void 0 : result.list) || [];
        }
        total.value = (result == null ? void 0 : result.total) || 0;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/closets/index.vue:166", "loadClosets failed", error);
        closets.value = [];
        total.value = 0;
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "衣橱列表加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function goCreateCloset() {
      common_vendor.index.navigateTo({
        url: scopeType.value === "family" ? `${common_constants_routes.ROUTES.closetCreate}?scopeType=family` : common_constants_routes.ROUTES.closetCreate
      });
    }
    function goEditCloset(closet) {
      const targetClosetId = closet == null ? void 0 : closet._id;
      if (!targetClosetId) {
        common_vendor.index.showToast({
          title: "缺少衣橱ID",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `${common_constants_routes.ROUTES.closetCreate}?closetId=${targetClosetId}`
      });
    }
    function confirmDeleteCloset(closet) {
      const targetClosetId = closet == null ? void 0 : closet._id;
      if (!targetClosetId) {
        common_vendor.index.showToast({
          title: "缺少衣橱ID",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "删除衣橱",
        content: "删除后该衣橱下已绑定的衣物会变为未归类，是否继续？",
        success: async (res) => {
          if (!res.confirm) {
            return;
          }
          try {
            await common_api_modules_closet.deleteCloset({
              closetId: targetClosetId
            });
            common_vendor.index.showToast({
              title: "衣橱已删除",
              icon: "success"
            });
            loadClosets();
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/closets/index.vue:231", "deleteCloset failed", error);
            common_vendor.index.showToast({
              title: (error == null ? void 0 : error.message) || "衣橱删除失败",
              icon: "none"
            });
          }
        }
      });
    }
    common_vendor.onShow(async () => {
      await syncScopeType();
      loadClosets();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(pageEyebrow.value),
        b: common_vendor.t(pageTitle.value),
        c: common_vendor.t(pageDesc.value),
        d: allowCreate.value
      }, allowCreate.value ? {
        e: common_vendor.o(goCreateCloset, "ba")
      } : {}, {
        f: showScopeSwitch.value
      }, showScopeSwitch.value ? {
        g: scopeType.value === "personal" ? 1 : "",
        h: common_vendor.o(($event) => changeScope("personal"), "9d"),
        i: scopeType.value === "family" ? 1 : "",
        j: common_vendor.o(($event) => changeScope("family"), "32")
      } : {}, {
        k: !loading.value && closets.value.length === 0
      }, !loading.value && closets.value.length === 0 ? {
        l: common_vendor.o(goCreateCloset, "3d"),
        m: common_vendor.p({
          ["scope-type"]: scopeType.value,
          ["can-create"]: allowCreate.value
        })
      } : {
        n: common_vendor.f(closets.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goEditCloset, item._id),
            c: common_vendor.o(confirmDeleteCloset, item._id),
            d: "5b8e79f8-1-" + i0,
            e: common_vendor.p({
              closet: item
            })
          };
        })
      }, {
        o: closets.value.length > 0
      }, closets.value.length > 0 ? {
        p: common_vendor.p({
          status: loadMoreStatus.value
        })
      } : {}, {
        q: refreshing.value,
        r: common_vendor.o(onRefresh, "01"),
        s: common_vendor.o(onLoadMore, "1b"),
        t: common_vendor.p({
          ["current-route"]: common_vendor.unref(common_constants_routes.ROUTES).closets
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/closets/index.js.map
