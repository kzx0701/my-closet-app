<template>
  <view class="page">
    <!-- 背景层 -->
    <view class="page-bg"></view>

    <!-- Hero 区 -->
    <view class="hero" :style="{ paddingTop: statusBarHeight + 20 + 'px' }">
      <!-- 装饰线条 -->
      <svg class="hero-deco" viewBox="0 0 375 280" preserveAspectRatio="none">
        <path d="M 0 60 Q 187 30 375 60" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
        <path d="M 0 140 Q 187 110 375 140" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
        <path d="M 0 220 Q 187 190 375 220" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
      </svg>

      <!-- 标题区 -->
      <view class="hero-body fade-up-delay-1">
        <text class="hero-title">{{ pageTitle }}</text>
        <text class="hero-desc">{{ pageDesc }}</text>
      </view>

      <!-- 统计卡片 -->
      <view class="hero-cards fade-up-delay-2">
        <view class="hero-card">
          <text class="hero-card-num">{{ summaryData.closetCount }}</text>
          <text class="hero-card-label">衣橱</text>
        </view>
        <view class="hero-card">
          <text class="hero-card-num accent">{{ summaryData.clothesCount }}</text>
          <text class="hero-card-label">衣物</text>
        </view>
        <view class="hero-card hero-card-weak">
          <text class="hero-card-num">{{ summaryData.unassignedCount }}</text>
          <text class="hero-card-label">未归类</text>
        </view>
      </view>
    </view>

    <!-- 下拉刷新提示 -->
    <view v-if="refreshing" class="refreshing-bar">
      <view class="refreshing-spinner"></view>
      <text class="refreshing-text">正在刷新…</text>
    </view>

    <!-- 内容面板：从 Hero 区自然升起 -->
    <view class="main-panel">
      <!-- 搜索 + 筛选区 -->
      <view class="toolbar fade-up-delay-3">
        <!-- 搜索框 -->
        <view class="search-wrap">
          <view class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              class="search-input"
              type="text"
              :value="searchKeyword"
              placeholder="搜索衣橱名称或房间…"
              placeholder-class="search-placeholder"
              @input="onSearchInput"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
            />
            <view v-if="isSearching" class="search-status">
              <view class="search-spinner"></view>
            </view>
            <view v-else-if="searchKeyword" class="search-clear" hover-class="search-clear-hover" :hover-stay-time="100" @click="clearSearch">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </view>
          </view>

          <!-- 搜索历史 -->
          <view v-if="showSearchHistory" class="search-history" @touchstart="onSearchHistoryTouchStart">
            <!-- 热门搜索 -->
            <view class="search-history-section">
              <text class="search-history-title">热门搜索</text>
              <view class="search-history-list">
                <view
                  v-for="(item, index) in HOT_SEARCH_KEYWORDS"
                  :key="`hot-${index}`"
                  class="search-history-item search-history-item--hot"
                  hover-class="search-history-item-hover"
                  :hover-stay-time="100"
                  @click="applySearchKeyword(item)"
                >
                  <svg class="search-history-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  <text class="search-history-item-text">{{ item }}</text>
                </view>
              </view>
            </view>

            <!-- 最近搜索 -->
            <view v-if="searchHistory.length > 0" class="search-history-section">
              <view class="search-history-header">
                <text class="search-history-title">最近搜索</text>
                <view class="search-history-clear" hover-class="search-history-clear-hover" :hover-stay-time="100" @click="clearSearchHistory">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <text class="search-history-clear-text">清空</text>
                </view>
              </view>
              <view class="search-history-list">
                <view
                  v-for="(item, index) in searchHistory"
                  :key="`recent-${index}`"
                  class="search-history-item"
                  hover-class="search-history-item-hover"
                  :hover-stay-time="100"
                  @click="applySearchKeyword(item)"
                >
                  <svg class="search-history-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <text class="search-history-item-text">{{ item }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 排序 + 房间筛选 -->
        <view class="filter-bar">
          <view class="sort-scroll-wrap">
            <scroll-view class="sort-scroll" scroll-x :show-scrollbar="false">
              <view
                v-for="option in SORT_OPTIONS"
                :key="option.value"
                class="sort-chip"
                :class="{ 'sort-chip-active': sortBy === option.value }"
                hover-class="sort-chip-hover"
                :hover-stay-time="100"
                @click="changeSort(option.value)"
              >
                <text class="sort-chip-text">{{ option.label }}</text>
              </view>
            </scroll-view>
            <view class="sort-scroll-fade"></view>
          </view>

          <picker
            class="room-picker"
            mode="selector"
            :range="displayRoomOptions"
            :value="roomOptions.indexOf(filterRoom)"
            :disabled="roomOptions.length <= 1"
            @change="onRoomChange"
          >
            <view class="room-picker-trigger" :class="{ 'room-picker-trigger-disabled': roomOptions.length <= 1 }" hover-class="room-picker-trigger-hover" :hover-stay-time="100">
              <text class="room-picker-text">{{ roomFilterText }}</text>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </view>
          </picker>
        </view>

        <view v-if="showClothesCountSortHint" class="sort-hint">
          <svg class="sort-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <text class="sort-hint-text">衣物数量排序为当前页内排序，建议先筛选房间以获得更准结果</text>
        </view>

        <!-- 空间切换：仅当存在家庭时才显示 -->
        <view v-if="hasFamily" class="scope-switch">
          <view
            class="scope-chip"
            :class="{ 'scope-chip-active': scopeType === 'personal' }"
            hover-class="scope-chip-hover"
            :hover-stay-time="100"
            @click="changeScope('personal')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <text class="scope-chip-text">个人</text>
          </view>
          <view
            v-if="hasFamily"
            class="scope-chip"
            :class="{ 'scope-chip-active': scopeType === 'family' }"
            hover-class="scope-chip-hover"
            :hover-stay-time="100"
            @click="changeScope('family')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <text class="scope-chip-text">{{ familyName }}</text>
          </view>
        </view>
      </view>

      <!-- 内容区 -->
      <view class="content">

        <!-- 骨架屏 -->
        <view v-if="loading && closets.length === 0" class="skeleton-list fade-in">
          <view v-for="n in 3" :key="n" class="skeleton-card">
            <view class="skeleton-circle skeleton"></view>
            <view class="skeleton-lines">
              <view class="skeleton skeleton-line-name"></view>
              <view class="skeleton skeleton-line-meta"></view>
            </view>
            <view class="skeleton-right">
              <view class="skeleton skeleton-count"></view>
              <view class="skeleton skeleton-unit"></view>
            </view>
          </view>
        </view>

        <!-- 错误态 -->
        <view v-else-if="error" class="error-card fade-in">
          <view class="error-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </view>
          <view class="error-content">
            <text class="error-title">衣橱列表加载失败</text>
            <text class="error-desc">请检查网络连接，或稍后下拉刷新重试</text>
            <view class="error-retry" hover-class="error-retry-hover" :hover-stay-time="100" @click="retryLoad">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              <text class="error-retry-text">重新加载</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <closet-empty-state
          v-else-if="closets.length === 0"
          class="fade-in"
          :scope-type="scopeType"
          :can-create="allowCreate"
          :is-first-time="isFirstEmpty"
          @create="goCreateCloset"
        />

        <!-- 搜索无结果 -->
        <view v-else-if="displayClosets.length === 0" class="search-empty fade-in">
          <text class="search-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </text>
          <text class="search-empty-title">未找到「{{ filterKeyword }}」</text>
          <text class="search-empty-desc">可以换个关键词，或直接创建一个</text>
          <view class="search-empty-actions">
            <view class="search-clear-btn" hover-class="search-clear-btn-hover" :hover-stay-time="100" @click="clearSearch">
              <text class="search-clear-btn-text">清除搜索</text>
            </view>
            <view v-if="allowCreate" class="search-create-btn" hover-class="search-create-btn-hover" :hover-stay-time="100" @click="goCreateWithKeyword">
              <text class="search-create-btn-text">创建该衣橱</text>
            </view>
          </view>
        </view>

        <!-- 列表 -->
        <view v-else class="list-area fade-in">
          <view v-if="showSwipeHint && displayClosets.length > 0" class="swipe-hint">
            <view class="swipe-hint-inner">
              <svg class="swipe-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/></svg>
              <text class="swipe-hint-text">左滑衣橱可编辑或删除</text>
            </view>
            <view class="swipe-hint-close" hover-class="swipe-hint-close-hover" :hover-stay-time="100" @click="closeSwipeHint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </view>
          </view>
          <uni-swipe-action>
            <uni-swipe-action-item
              v-for="item in displayClosets"
              :key="item._id"
              :right-options="swipeOptions"
              :auto-close="true"
              @click="onSwipeClick($event, item)"
            >
              <closet-list-card :closet="item" />
            </uni-swipe-action-item>
          </uni-swipe-action>

          <!-- 轻量新建入口 -->
          <view v-if="allowCreate && !filterKeyword" class="add-entry" hover-class="add-entry-hover" :hover-stay-time="100" @click="goCreateCloset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <text class="add-entry-text">新建衣橱</text>
          </view>

          <!-- 分页加载进度 -->
          <view v-if="showLoadProgress" class="load-progress">
            <view class="load-progress-bar-bg">
              <view class="load-progress-bar" :style="{ width: loadProgressPercent + '%' }"></view>
            </view>
            <text class="load-progress-text">{{ loadProgressText }}</text>
          </view>

          <!-- 上拉加载更多占位行 -->
          <view v-if="loading && closets.length > 0" class="load-more-skeleton">
            <view class="skeleton-card-mini">
              <view class="skeleton-circle skeleton"></view>
              <view class="skeleton-lines">
                <view class="skeleton skeleton-line-name"></view>
                <view class="skeleton skeleton-line-meta"></view>
              </view>
            </view>
          </view>

          <u-loadmore :status="loadMoreStatus" v-if="closets.length > 0 && !filterKeyword" />
        </view>
      </view>
    </view>

    <h5-tab-bar :current-route="ROUTES.closets" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onUnload } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { ROUTES } from "@/common/constants/routes.js";
import {
  getFamilyClosetList,
  getPersonalClosetList,
  getClosetListWithSummary,
  deleteCloset,
} from "@/common/api/modules/closet.js";
import { getCurrentSession } from "@/common/services/auth.js";
import { getClosetScopeState, setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import {
  getClosetListCache,
  setClosetListCache,
  getHomeSummaryCache,
  setHomeSummaryCache,
  getFamilyInfoCache,
} from "@/common/services/cache-service.js";
import ClosetEmptyState from "./components/ClosetEmptyState.vue";
import ClosetListCard from "./components/ClosetListCard.vue";

const loading = ref(false);
const refreshing = ref(false);
const error = ref(false);
const closets = ref([]);
const scopeType = ref("personal");
const hasFamily = ref(false);
const familyName = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const closetCount = ref(0);
const clothesCount = ref(0);
const unassignedCount = ref(0);
const hasInitialized = ref(false);
const needRefresh = ref(false);
const searchKeyword = ref("");
const filterKeyword = ref("");
const isSearching = ref(false);
const sortBy = ref("default");
const filterRoom = ref("");
const statusBarHeight = ref(20);
const isFirstEmpty = ref(false);
const showSwipeHint = ref(false);
const isSearchFocused = ref(false);
const searchHistory = ref([]);

const SWIPE_HINT_KEY = "closets_swipe_hint_closed";
const SEARCH_HISTORY_KEY = "closets_search_history";
const SEARCH_HISTORY_MAX = 8;

const SORT_OPTIONS = [
  { value: "default", label: "默认" },
  { value: "created_at_desc", label: "最新创建" },
  { value: "created_at_asc", label: "最早创建" },
  { value: "name_asc", label: "名称 A-Z" },
  { value: "name_desc", label: "名称 Z-A" },
  { value: "clothes_count_desc", label: "衣物最多" },
  { value: "clothes_count_asc", label: "衣物最少" },
];

const HOT_SEARCH_KEYWORDS = ["主卧", "次卧", "客厅", "儿童房", "玄关"];

const SWIPE_OPTIONS = [
  {
    text: "编辑",
    style: {
      backgroundColor: "#3a5443",
      color: "#f8f4ec",
      fontSize: "14px",
      width: "64px",
    },
  },
  {
    text: "删除",
    style: {
      backgroundColor: "#c45c3e",
      color: "#f8f4ec",
      fontSize: "14px",
      width: "64px",
    },
  },
];

let currentRequestId = 0;
let searchTimer = null;

const loadMoreStatus = computed(() => {
  if (loading.value) return "loading";
  if (closets.value.length >= total.value) return "nomore";
  return "loadmore";
});

const showLoadProgress = computed(() => total.value > pageSize.value && closets.value.length > 0 && !filterKeyword.value);

const loadProgressPercent = computed(() => {
  if (total.value <= 0) return 0;
  return Math.min(100, Math.round((closets.value.length / total.value) * 100));
});

const loadProgressText = computed(() => {
  if (loading.value) {
    return `正在加载… 已加载 ${closets.value.length} / ${total.value} 个衣橱`;
  }
  if (closets.value.length >= total.value) {
    return `已全部加载 ${total.value} 个衣橱`;
  }
  return `已加载 ${closets.value.length} / ${total.value} 个衣橱`;
});


const allowCreate = computed(() => scopeType.value === "personal" || hasFamily.value);

const showSearchHistory = computed(() => isSearchFocused.value && !searchKeyword.value);

function getSearchHistoryStorageKey() {
  const session = getCurrentSession();
  return `${SEARCH_HISTORY_KEY}_${session?.uid || 'anonymous'}`;
}

function loadSearchHistory() {
  try {
    const saved = uni.getStorageSync(getSearchHistoryStorageKey());
    if (Array.isArray(saved)) {
      searchHistory.value = saved.slice(0, SEARCH_HISTORY_MAX);
    } else {
      searchHistory.value = [];
    }
  } catch (e) {
    searchHistory.value = [];
  }
}

function saveSearchHistoryToStorage() {
  try {
    uni.setStorageSync(getSearchHistoryStorageKey(), searchHistory.value.slice(0, SEARCH_HISTORY_MAX));
  } catch (e) {
    console.error("saveSearchHistory failed", e);
  }
}

function pushSearchHistory(keyword) {
  const normalized = String(keyword || "").trim();
  if (!normalized) return;
  const next = [normalized, ...searchHistory.value.filter((item) => item !== normalized)];
  searchHistory.value = next.slice(0, SEARCH_HISTORY_MAX);
  saveSearchHistoryToStorage();
}

function clearSearchHistory() {
  searchHistory.value = [];
  try {
    uni.removeStorageSync(getSearchHistoryStorageKey());
  } catch (e) {
    console.error("clearSearchHistory failed", e);
  }
}

function applySearchKeyword(keyword) {
  searchKeyword.value = keyword;
  filterKeyword.value = keyword;
  isSearchFocused.value = false;
  pushSearchHistory(keyword);
}

function onSearchFocus() {
  loadSearchHistory();
  isSearchFocused.value = true;
}

let searchBlurTimer = null;
function onSearchBlur() {
  searchBlurTimer = setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
}

function onSearchHistoryTouchStart() {
  if (searchBlurTimer) clearTimeout(searchBlurTimer);
}

const pageTitle = computed(() => (scopeType.value === "family" ? "家庭衣橱" : "我的衣橱"));

const pageDesc = computed(() =>
  scopeType.value === "family"
    ? "管理家庭共享的衣橱空间"
    : "管理你自己的衣橱与衣物"
);

const summaryData = computed(() => ({
  closetCount: String(closetCount.value),
  clothesCount: String(clothesCount.value),
  unassignedCount: String(unassignedCount.value),
}));

const swipeOptions = computed(() => SWIPE_OPTIONS);

const roomOptions = computed(() => {
  const rooms = new Set();
  closets.value.forEach((item) => {
    if (item.room_name) rooms.add(item.room_name);
  });
  return ["", ...Array.from(rooms).sort()];
});

const displayRoomOptions = computed(() =>
  roomOptions.value.map((room) => (room ? room : "全部房间"))
);

const roomFilterText = computed(() => {
  if (roomOptions.value.length <= 1) return "暂无房间";
  return filterRoom.value || "全部房间";
});

const showClothesCountSortHint = computed(() => sortBy.value.includes("clothes_count"));

const displayClosets = computed(() => {
  let result = closets.value;

  // 房间筛选
  const room = filterRoom.value;
  if (room) {
    result = result.filter((item) => item.room_name === room);
  }

  // 关键词搜索
  const keyword = filterKeyword.value.trim().toLowerCase();
  if (keyword) {
    result = result.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const roomName = (item.room_name || "").toLowerCase();
      return name.includes(keyword) || roomName.includes(keyword);
    });
  }

  // 衣物数量排序为前端排序
  const sort = sortBy.value;
  if (sort === "clothes_count_desc") {
    result = [...result].sort((a, b) => (b.clothes_count || 0) - (a.clothes_count || 0));
  } else if (sort === "clothes_count_asc") {
    result = [...result].sort((a, b) => (a.clothes_count || 0) - (b.clothes_count || 0));
  }

  return result;
});

function getSearchStorageKey() {
  const session = getCurrentSession();
  return `closets_search_${session?.uid || 'anonymous'}`;
}

function restoreSwipeHintState() {
  try {
    showSwipeHint.value = !uni.getStorageSync(SWIPE_HINT_KEY);
  } catch (e) {
    showSwipeHint.value = true;
  }
}

function closeSwipeHint() {
  showSwipeHint.value = false;
  try {
    uni.setStorageSync(SWIPE_HINT_KEY, true);
  } catch (e) {
    console.error("closeSwipeHint save failed", e);
  }
}

function saveSearchState() {
  try {
    uni.setStorageSync(getSearchStorageKey(), { keyword: searchKeyword.value });
  } catch (e) { console.error("saveSearchState failed", e); }
}

function restoreSearchState() {
  try {
    const saved = uni.getStorageSync(getSearchStorageKey());
    if (saved) {
      searchKeyword.value = saved.keyword || '';
      filterKeyword.value = searchKeyword.value;
    }
  } catch (e) { console.error("restoreSearchState failed", e); }
}

async function syncScopeType() {
  const session = getCurrentSession();
  if (!session?.uid) { hasFamily.value = false; scopeType.value = "personal"; return; }

  const membership = await getFamilyMembership(session.uid);
  if (membership.status !== "success") {
    const cachedFamily = getFamilyInfoCache(session.uid);
    hasFamily.value = cachedFamily?.hasFamily || false;
    familyName.value = cachedFamily?.familyRecord?.name || "未命名家庭";
    if (!hasFamily.value) { scopeType.value = "personal"; setClosetScopeState(session.uid, "personal"); return; }
    scopeType.value = getClosetScopeState(session.uid);
    return;
  }

  hasFamily.value = membership.hasFamily;
  familyName.value = membership.hasFamily ? (membership.familyRecord?.name || "未命名家庭") : "";

  if (!hasFamily.value) { scopeType.value = "personal"; setClosetScopeState(session.uid, "personal"); return; }
  scopeType.value = getClosetScopeState(session.uid);
}

function changeScope(nextScopeType) {
  if (nextScopeType === scopeType.value) return;
  if (nextScopeType === "family" && !hasFamily.value) return;
  const session = getCurrentSession();
  scopeType.value = nextScopeType;
  setClosetScopeState(session?.uid, nextScopeType);
  currentPage.value = 1;
  searchKeyword.value = "";
  filterKeyword.value = "";
  if (searchTimer) clearTimeout(searchTimer);
  saveSearchState();
  loadClosets();
}

async function loadClosets(append = false) {
  loading.value = true;
  if (!append) error.value = false;
  const requestId = ++currentRequestId;
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;
  const hasCustomSort = sortBy.value !== "default";
  const hasRoomFilter = !!filterRoom.value;

  if (!append && uid && !hasCustomSort && !hasRoomFilter) {
    const cached = getClosetListCache(uid, scope);
    const cachedSummary = getHomeSummaryCache(uid, scope);
    if (cached?.list) {
      closets.value = cached.list;
      total.value = cached.total || 0;
      loading.value = false;
    }
    if (cachedSummary) {
      closetCount.value = cachedSummary.closetCount || 0;
      clothesCount.value = cachedSummary.clothesCount || 0;
      unassignedCount.value = cachedSummary.unassignedClothesCount || 0;
    }
  }

  try {
    await executeLoad(append, requestId);
  } catch (err) {
    console.error("loadClosets failed", err);
    if (requestId !== currentRequestId) return;
    if (!append && closets.value.length === 0) { error.value = true; total.value = 0; }
    uni.showToast({ title: err?.message || "衣橱列表加载失败", icon: "none" });
  } finally {
    if (requestId === currentRequestId) loading.value = false;
  }
}

async function executeLoad(append, requestId, attempt = 1) {
  const session = getCurrentSession();
  const uid = session?.uid;
  const scope = scopeType.value;
  const hasCustomSort = sortBy.value !== "default";
  const hasRoomFilter = !!filterRoom.value;

  const payload = {
    page: currentPage.value,
    pageSize: pageSize.value,
    sortBy: sortBy.value,
    roomName: filterRoom.value,
  };

  let result;
  try {
    if (append) {
      result = scope === "family" ? await getFamilyClosetList(payload) : await getPersonalClosetList(payload);
    } else {
      result = await getClosetListWithSummary({ ...payload, scopeType: scope });
    }
  } catch (err) {
    if (!append && attempt < 3 && requestId === currentRequestId) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (requestId !== currentRequestId) return;
      return executeLoad(append, requestId, attempt + 1);
    }
    throw err;
  }

  if (requestId !== currentRequestId) return;

  if (!append) {
    const summary = result?.summary;
    if (summary) {
      closetCount.value = summary.closetCount || 0;
      clothesCount.value = summary.clothesCount || 0;
      unassignedCount.value = summary.unassignedClothesCount || 0;
      if (uid) setHomeSummaryCache(uid, scope, summary);
    }
  }

  const list = result?.list || [];
  closets.value = append ? [...closets.value, ...list] : list;
  total.value = result?.total || 0;
  if (!append && closets.value.length === 0) {
    isFirstEmpty.value = true;
  }
  if (!append && uid && !searchKeyword.value && !hasCustomSort && !hasRoomFilter && currentPage.value === 1) {
    setClosetListCache(uid, scope, { list, total: total.value });
  }
}

function retryLoad() { currentPage.value = 1; loadClosets(); }

function goCreateCloset() {
  uni.navigateTo({ url: scopeType.value === "family" ? `${ROUTES.closetCreate}?scopeType=family` : ROUTES.closetCreate });
}

function goCreateWithKeyword() {
  const keyword = encodeURIComponent(filterKeyword.value.trim());
  const scopeParam = scopeType.value === "family" ? "&scopeType=family" : "";
  uni.navigateTo({ url: `${ROUTES.closetCreate}?name=${keyword}${scopeParam}` });
}

function onSearchInput(e) {
  searchKeyword.value = e.detail.value;
  if (searchTimer) clearTimeout(searchTimer);
  isSearching.value = true;
  if (searchBlurTimer) clearTimeout(searchBlurTimer);
  searchTimer = setTimeout(() => {
    filterKeyword.value = searchKeyword.value;
    isSearching.value = false;
    saveSearchState();
    pushSearchHistory(searchKeyword.value);
  }, 300);
}

function clearSearch() {
  searchKeyword.value = ""; filterKeyword.value = "";
  isSearching.value = false;
  if (searchTimer) clearTimeout(searchTimer); saveSearchState();
}

function changeSort(value) {
  if (sortBy.value === value) return;
  sortBy.value = value;
  currentPage.value = 1;
  loadClosets();
}

function onRoomChange(e) {
  const index = Number(e.detail.value);
  const selected = roomOptions.value[index] || "";
  if (filterRoom.value === selected) return;
  filterRoom.value = selected;
  currentPage.value = 1;
  loadClosets();
}

function onSwipeClick(e, closet) {
  const action = e?.content?.text;
  if (action === "编辑") {
    uni.navigateTo({ url: `${ROUTES.closetCreate}?closetId=${closet._id}` });
  } else if (action === "删除") {
    confirmDeleteCloset(closet);
  }
}

function confirmDeleteCloset(closet) {
  uni.showModal({
    title: "删除衣橱",
    content: `确定删除「${closet.name || "未命名衣橱"}」吗？该衣橱下的衣物将变为未归类。`,
    confirmColor: "#c45c3e",
    success: async (res) => {
      if (!res.confirm) return;
      try {
        uni.showLoading({ title: "删除中" });
        await deleteCloset({ closetId: closet._id });
        uni.hideLoading();
        uni.showToast({ title: `已删除「${closet.name || "未命名衣橱"}」`, icon: "success", duration: 2000 });
        currentPage.value = 1;
        loadClosets();
      } catch (err) {
        uni.hideLoading();
        uni.showToast({ title: err?.message || "删除失败", icon: "none" });
      }
    },
  });
}

uni.$on("closets:need-refresh", () => { needRefresh.value = true; });

onPullDownRefresh(async () => {
  refreshing.value = true; currentPage.value = 1;
  await loadClosets();
  refreshing.value = false; uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (loading.value || closets.value.length >= total.value) return;
  currentPage.value += 1; loadClosets(true);
});

onLoad(() => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif

  try { const sysInfo = uni.getSystemInfoSync(); statusBarHeight.value = sysInfo.statusBarHeight || 20; } catch (e) { statusBarHeight.value = 20; }
});

onShow(async () => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif

  const session = getCurrentSession();
  if (!session.hasLogin) {
    uni.showToast({ title: "请先登录", icon: "none", duration: 1500 });
    setTimeout(() => { uni.navigateTo({ url: ROUTES.login }); }, 500); return;
  }
  await syncScopeType();
  restoreSwipeHintState();
  if (!hasInitialized.value) {
    restoreSearchState(); currentPage.value = 1;
    loadClosets(); hasInitialized.value = true;
  } else {
    if (needRefresh.value) { needRefresh.value = false; currentPage.value = 1; loadClosets(); }
  }
});

onUnload(() => {
  uni.$off("closets:need-refresh");
  if (searchTimer) clearTimeout(searchTimer);
  if (searchBlurTimer) clearTimeout(searchBlurTimer);
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  position: relative;
  background: $color-bg-page;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.page::-webkit-scrollbar { display: none; }

/* ===== Hero 区 ===== */
.page-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(180deg,
    $color-primary-dark 0%,
    $color-primary 22%,
    $color-primary-soft 42%,
    $color-sage 58%,
    $color-sage-light 70%,
    $color-bg-page 82%,
    $color-bg-page 100%
  );
}

.hero {
  position: relative;
  z-index: 2;
  padding: 0 28px 40px;
  color: $color-text-inverse;
  overflow: hidden;
}

/* 内容面板：从 Hero 区自然升起 */
.main-panel {
  position: relative;
  z-index: 3;
  background: $color-bg-page;
  border-radius: 28px 28px 0 0;
  margin-top: -22px;
  box-shadow: 0 -6px 24px rgba(45, 67, 52, 0.06);
}

.refreshing-bar {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 14rpx 0;
  margin-top: -22px;
  background: $color-bg-page;
  border-radius: 28px 28px 0 0;
}

.refreshing-spinner {
  width: 22rpx;
  height: 22rpx;
  border: 3rpx solid rgba(58, 84, 67, 0.15);
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: refreshingSpin 0.8s linear infinite;
}

@keyframes refreshingSpin {
  to { transform: rotate(360deg); }
}

.refreshing-text {
  font-size: 22rpx;
  color: $color-text-secondary;
}

.hero-deco {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  width: 100%; height: 100%;
}

.hero-body { position: relative; z-index: 2; margin-bottom: 20px; padding-top: 8px; }

.hero-title {
  display: block; font-family: $font-serif;
  font-size: 28px; font-weight: 600; line-height: 1.15;
  color: $color-text-inverse; letter-spacing: -0.5px; margin-bottom: 8px;
}

.hero-desc {
  display: block; font-family: $font-sans;
  font-size: 13px; color: $inverse-55; line-height: 1.6;
}

/* 统计卡片 */
.hero-cards {
  position: relative; z-index: 2;
  display: flex; gap: 10px;
}

.hero-card {
  flex: 1; padding: 18px 12px; border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  text-align: center;
  transition: all 0.3s ease;
}

.hero-card-weak {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
}

.hero-card-weak .hero-card-num { color: rgba(248, 244, 236, 0.7); }
.hero-card-weak .hero-card-label { color: rgba(248, 244, 236, 0.5); }

.hero-card-num {
  display: block; font-family: $font-sans;
  font-size: 32px; font-weight: 700; line-height: 1;
  color: $color-text-inverse; letter-spacing: -0.5px;
}

.hero-card-num.accent { color: $color-terra-soft; }

.hero-card-label {
  display: block; font-family: $font-sans;
  font-size: 12px; letter-spacing: 0.5px;
  color: rgba(248, 244, 236, 0.72);
  margin-top: 8px;
}

/* ===== 工具栏（搜索 + 切换） ===== */
.toolbar {
  position: relative; z-index: 2;
  padding: 24px 28px 0;
}

.search-wrap { margin-bottom: 12px; position: relative; z-index: 10; }

.search-history {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 10;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 24px rgba(45, 67, 52, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
}

.search-history-section + .search-history-section {
  margin-top: 24rpx;
}

.search-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.search-history-title {
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-title;
}

.search-history-clear {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 4rpx 8rpx;

  svg {
    width: 22rpx;
    height: 22rpx;
    stroke: $color-text-placeholder;
  }
}

.search-history-clear-hover { opacity: 0.6; }

.search-history-clear-text {
  font-size: 22rpx;
  color: $color-text-placeholder;
}

.search-history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.search-history-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 18rpx;
  background: $color-bg-page;
  border-radius: 24rpx;
  border: 1px solid rgba(0, 0, 0, 0.04);
  max-width: 100%;
}

.search-history-item-hover { background: rgba(58, 84, 67, 0.06); }

.search-history-item--hot {
  background: rgba(196, 92, 62, 0.05);
  border-color: rgba(196, 92, 62, 0.12);

  .search-history-item-icon {
    stroke: $color-terra;
  }

  .search-history-item-text {
    color: $color-terra;
  }
}

.search-history-item-icon {
  width: 22rpx;
  height: 22rpx;
  flex-shrink: 0;
  stroke: $color-text-placeholder;
}

.search-history-item-text {
  font-size: 24rpx;
  color: $color-text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 240rpx;
}

.filter-bar {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}

.sort-scroll-wrap {
  position: relative;
  flex: 1;
  width: 0;
  overflow: hidden;
}

.sort-scroll {
  width: 100%;
  white-space: nowrap;
}

.sort-scroll-fade {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 28rpx;
  pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, $color-bg-page 100%);
}

.sort-chip {
  display: inline-flex; align-items: center;
  padding: 7px 14px; margin-right: 8px;
  border-radius: 18px;
  background: transparent;
  border: 1px solid rgba(58, 84, 67, 0.18);
  transition: all 0.2s ease;
}

.sort-chip:last-child { margin-right: 0; }

.sort-chip-active {
  background: $color-primary; border-color: $color-primary;
}

.sort-chip-active .sort-chip-text { color: $color-text-inverse; font-weight: 600; }

.sort-chip-hover { background: rgba(58, 84, 67, 0.05); }
.sort-chip-active.sort-chip-hover { background: $color-primary-dark; }

.sort-chip-text {
  font-family: $font-sans; font-size: 12px; font-weight: 500;
  color: $color-text-secondary; line-height: 1;
}

.room-picker { flex-shrink: 0; }

.room-picker-trigger {
  display: flex; align-items: center; gap: 4px;
  padding: 7px 10px; border-radius: 14px;
  background: rgba(58, 84, 67, 0.05);
  border: 1px solid rgba(58, 84, 67, 0.1);
}

.room-picker-trigger-hover { background: rgba(58, 84, 67, 0.1); }

.room-picker-trigger-disabled {
  opacity: 0.55;
  background: rgba(58, 84, 67, 0.03);
}

.room-picker-trigger svg { width: 12px; height: 12px; stroke: $color-text-secondary; }

.room-picker-text {
  max-width: 80px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: $font-sans; font-size: 12px; font-weight: 500;
  color: $color-text-secondary; line-height: 1;
}

.search-box {
  display: flex; align-items: center; height: 44px;
  padding: 0 14px; border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 2px 8px rgba(45, 67, 52, 0.08);
}

.search-icon {
  width: 16px; height: 16px; color: rgba(248, 244, 236, 0.75);
  flex-shrink: 0; margin-right: 10px;
}

.search-input {
  flex: 1; min-width: 0; height: 44px;
  font-family: $font-sans; font-size: 14px;
  color: $color-text-inverse; background: transparent;
}

.search-placeholder { color: rgba(248, 244, 236, 0.78); font-size: 14px; }

.search-clear svg { width: 16px; height: 16px; stroke: rgba(248, 244, 236, 0.75); }
.search-clear-hover { opacity: 0.55; }

.search-status {
  width: 44px; height: 44px; display: flex;
  align-items: center; justify-content: center;
  flex-shrink: 0; margin: -6px -10px -6px 4px;
}

.search-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(248, 244, 236, 0.25);
  border-top-color: $color-text-inverse;
  border-radius: 50%;
  animation: searchSpin 0.8s linear infinite;
}

@keyframes searchSpin {
  to { transform: rotate(360deg); }
}

/* 空间切换 */
.sort-hint {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  margin-bottom: 12px;
  border-radius: 12rpx;
  background: rgba(196, 92, 62, 0.05);
  border: 1px solid rgba(196, 92, 62, 0.12);
}

.sort-hint-icon {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
  stroke: $color-terra;
}

.sort-hint-text {
  flex: 1;
  font-size: 22rpx;
  color: $color-terra;
  line-height: 1.5;
}

.scope-switch { display: flex; gap: 8px; }

.scope-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 18px;
  background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

.scope-chip-active {
  background: $color-primary; border-color: $color-primary;
}

.scope-chip-active svg { stroke: $color-text-inverse; }
.scope-chip-active .scope-chip-text { color: $color-text-inverse; font-weight: 600; }

.scope-chip svg { width: 14px; height: 14px; stroke: $color-text-secondary; flex-shrink: 0; }

.scope-chip-text {
  font-family: $font-sans; font-size: 12px; font-weight: 500;
  color: $color-text-secondary;
}

.scope-chip-hover { opacity: 0.85; }

/* ===== 内容区 ===== */
.content {
  position: relative; z-index: 2;
  padding: 16px 28px calc(92px + env(safe-area-inset-bottom));
}

/* 列表 */
.list-area {
  display: flex; flex-direction: column; gap: 12px;
}

.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 20rpx;
  border-radius: 12rpx;
  background: rgba(58, 84, 67, 0.05);
  border: 1px solid rgba(58, 84, 67, 0.1);
  margin-bottom: 4rpx;
}

.swipe-hint-inner {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.swipe-hint-icon {
  width: 24rpx;
  height: 24rpx;
  stroke: $color-text-secondary;
}

.swipe-hint-text {
  font-size: 22rpx;
  color: $color-text-secondary;
  line-height: 1.4;
}

.swipe-hint-close {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20rpx;
    height: 20rpx;
    stroke: $color-text-placeholder;
  }
}

.swipe-hint-close-hover {
  opacity: 0.6;
}

/* 分页加载进度 */
.load-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0 8px;
}

.load-progress-bar-bg {
  height: 4px;
  border-radius: 2px;
  background: rgba(58, 84, 67, 0.08);
  overflow: hidden;
}

.load-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, $color-primary 0%, $color-moss 100%);
  transition: width 0.3s ease;
}

.load-progress-text {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
  text-align: center;
  letter-spacing: 0.3px;
}

/* 上拉加载占位 */
.load-more-skeleton {
  padding: 8px 0 4px;
}

.skeleton-card-mini {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 28rpx 32rpx;
  border-radius: 32rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.skeleton-card-mini .skeleton-circle { width: 96rpx; height: 96rpx; border-radius: 50%; }
.skeleton-card-mini .skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 16rpx; }

/* 新建卡片 */
.add-entry {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 0; border-radius: 16px;
  background: transparent; border: 1.5px dashed rgba(58, 84, 67, 0.2);
  transition: all 0.25s ease;
}

.add-entry-hover { background: rgba(58, 84, 67, 0.03); border-color: $color-primary; }

.add-entry svg { width: 18px; height: 18px; stroke: $color-primary; }

.add-entry-text {
  font-family: $font-sans; font-size: 14px; font-weight: 500;
  color: $color-primary;
}

/* ===== 搜索空 ===== */
.search-empty {
  padding: 48px 0; text-align: center;
}

.search-empty-icon {
  display: block; margin-bottom: 12px;
}

.search-empty-icon svg {
  width: 40px; height: 40px; stroke: $color-text-placeholder; opacity: 0.4;
}

.search-empty-title {
  font-family: $font-sans; font-size: 15px; color: $color-text-secondary;
  display: block;
}

.search-empty-desc {
  font-family: $font-sans; font-size: 12px; color: $color-text-placeholder;
  display: block; margin-top: 6px;
}

.search-empty-actions {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-top: 16px;
}

.search-clear-btn {
  display: inline-flex; padding: 8px 20px;
  border-radius: 18px; background: rgba(184, 92, 58, 0.06);
  border: 1px solid rgba(184, 92, 58, 0.15);
  transition: all 0.2s ease;
}

.search-clear-btn-text {
  font-family: $font-sans; font-size: 12px; font-weight: 500; color: $color-terra;
}

.search-clear-btn-hover { background: rgba(184, 92, 58, 0.1); }

.search-create-btn {
  display: inline-flex; padding: 8px 20px;
  border-radius: 18px; background: $color-primary;
  border: 1px solid $color-primary;
  transition: all 0.2s ease;
}

.search-create-btn-text {
  font-family: $font-sans; font-size: 12px; font-weight: 500; color: $color-text-inverse;
}

.search-create-btn-hover { background: $color-primary-dark; }

/* ===== 错误态 ===== */
.error-card {
  padding: 20px; border-radius: 16px;
  background: rgba(184, 92, 58, 0.04);
  border: 1px solid rgba(184, 92, 58, 0.12);
  display: flex; align-items: flex-start; gap: 14px;
}

.error-icon-wrap {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(184, 92, 58, 0.08);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.error-icon-wrap svg { width: 18px; height: 18px; stroke: $color-terra; }

.error-content { flex: 1; }

.error-title {
  font-family: $font-serif; font-size: 15px; font-weight: 600;
  color: $color-primary-dark; margin-bottom: 4px; display: block;
}

.error-desc {
  font-family: $font-sans; font-size: 12px; color: $color-text-secondary;
  line-height: 1.5; display: block; margin-bottom: 12px;
}

.error-retry {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 14px;
  background: rgba(58, 84, 67, 0.06);
  transition: all 0.2s ease;
}

.error-retry svg { width: 14px; height: 14px; stroke: $color-primary; }

.error-retry-text {
  font-family: $font-sans; font-size: 12px; font-weight: 500; color: $color-primary;
}

.error-retry-hover { background: rgba(58, 84, 67, 0.1); }

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-list { display: flex; flex-direction: column; gap: 24rpx; }

.skeleton-card {
  display: flex; align-items: center; gap: 28rpx;
  padding: 28rpx 32rpx; border-radius: 32rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.skeleton-circle { width: 96rpx; height: 96rpx; border-radius: 50%; }

.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 16rpx; }
.skeleton-line-name { height: 34rpx; width: 45%; border-radius: 8rpx; }
.skeleton-line-meta { height: 26rpx; width: 32%; border-radius: 6rpx; }
.skeleton-right {
  flex-shrink: 0;
  display: flex; flex-direction: column; align-items: flex-end; gap: 8rpx;
  margin-left: 20rpx;
}
.skeleton-count { width: 56rpx; height: 44rpx; border-radius: 8rpx; }
.skeleton-unit { width: 48rpx; height: 22rpx; border-radius: 6rpx; }
</style>
