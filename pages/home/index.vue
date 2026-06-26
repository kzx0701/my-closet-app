<template>
  <view class="page" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <!-- ===== 第一屏：沉浸式品牌展示 ===== -->
    <view class="hero-screen" :style="heroScreenStyle">
      <!-- 背景图层（视差） -->
      <view class="hero-bg-wrap">
        <image
          class="hero-bg-image"
          src="/static/images/hero-bg.jpg"
          mode="aspectFill"
          :style="heroBgStyle"
        />
        <view class="hero-bg-overlay"></view>
        <view class="hero-bg-noise noise-texture"></view>
      </view>

      <!-- 装饰性 SVG 线条 -->
      <view class="hero-deco-lines" :style="heroDecoStyle">
        <svg viewBox="0 0 375 812" preserveAspectRatio="none" class="deco-svg">
          <path d="M 0 180 Q 187 120 375 180" fill="none" stroke="rgba(244,239,230,0.06)" stroke-width="1"/>
          <path d="M 0 240 Q 187 180 375 240" fill="none" stroke="rgba(244,239,230,0.04)" stroke-width="1"/>
          <path d="M 0 600 Q 187 540 375 600" fill="none" stroke="rgba(244,239,230,0.05)" stroke-width="1"/>
          <path d="M 0 660 Q 187 600 375 660" fill="none" stroke="rgba(244,239,230,0.03)" stroke-width="1"/>
        </svg>
      </view>

      <!-- 顶部小标记 -->
      <view class="hero-topbar" :style="[heroTopbarStyle, { paddingTop: statusBarHeight + 20 + 'px' }]">
        <view class="hero-mark">
          <view class="hero-mark-dot"></view>
          <text class="hero-mark-text">SEASON · CLOSET</text>
        </view>
      </view>

      <!-- 品牌主体内容 -->
      <view class="hero-content" :style="heroContentStyle">
        <!-- 英文大标题 -->
        <text class="hero-title-en">Season Closet</text>

        <!-- 中文标题 -->
        <view class="hero-title-cn-wrap">
          <text class="hero-title-cn">四季</text>
          <text class="hero-title-cn em">衣橱</text>
        </view>

        <!-- 分隔线 -->
        <view class="hero-divider"></view>

        <!-- 简要介绍 -->
        <text class="hero-intro">你的私人衣橱管家</text>
        <text class="hero-intro-sub">管理衣物 · 整理生活 · 家庭共享</text>
      </view>

      <!-- 滚动提示 -->
      <view class="hero-scroll-hint" :style="scrollHintStyle">
        <text class="scroll-hint-text">SCROLL</text>
        <view class="scroll-hint-line">
          <view class="scroll-hint-dot"></view>
        </view>
      </view>
    </view>

    <!-- ===== 第二屏：数据概览 ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.stats }">
      <!-- 降级模式提示 -->
      <view v-if="isDegraded" class="degraded-banner">
        <svg class="degraded-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <text class="degraded-text">网络连接异常，正在展示缓存数据</text>
      </view>

      <!-- 游客模式提示 -->
      <view v-if="isGuest" class="guest-banner" @click="goLogin">
        <svg class="guest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <view class="guest-content">
          <text class="guest-title">游客模式</text>
          <text class="guest-desc">登录后可查看个人衣橱、管理衣物、使用家庭共享功能</text>
        </view>
        <text class="guest-action">去登录</text>
      </view>

      <!-- 概览统计 -->
      <view class="stats-zone" :style="{ paddingTop: statusBarHeight + 24 + 'px' }">
        <!-- 问候区 -->
        <view class="stats-greeting">
          <view class="greeting-icon-wrap">
            <svg class="greeting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </view>
          <view class="greeting-text-wrap">
            <text class="greeting-label">{{ greetingText }}</text>
            <text class="greeting-name">{{ nickname }}</text>
          </view>
        </view>

        <!-- 数据卡片 -->
        <view class="stats-card">
          <!-- 装饰纹理 -->
          <view class="stats-card-deco">
            <svg viewBox="0 0 300 120" class="stats-deco-svg">
              <circle cx="260" cy="20" r="60" fill="rgba(255,255,255,0.04)"/>
              <circle cx="280" cy="80" r="40" fill="rgba(255,255,255,0.03)"/>
              <circle cx="30" cy="100" r="30" fill="rgba(255,255,255,0.02)"/>
            </svg>
          </view>

          <!-- 加载骨架屏 -->
          <view v-if="loading" class="stats-row">
            <view class="stat-item">
              <view class="skeleton skeleton-num"></view>
              <view class="skeleton skeleton-text-sm"></view>
            </view>
            <view class="stat-item">
              <view class="skeleton skeleton-num"></view>
              <view class="skeleton skeleton-text-sm"></view>
            </view>
          </view>

          <!-- 错误态 -->
          <view v-else-if="loadError" class="error-card">
            <svg class="err-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <view class="err-content">
              <text class="err-title">数据加载失败</text>
              <text class="err-desc">网络连接异常，请稍后重试。</text>
              <text class="err-retry" @click="retryLoad">重新加载</text>
            </view>
          </view>

          <!-- 成功态 -->
          <view v-else class="stats-row">
            <view class="stat-item" hover-class="stat-item-hover" :hover-stay-time="100" @click="goClosets">
              <text class="stat-value">{{ summaryData.closetCount }}</text>
              <text class="stat-label">衣橱</text>
              <view class="stat-icon-wrap">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
              </view>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item" hover-class="stat-item-hover" :hover-stay-time="100" @click="goClothes">
              <text class="stat-value accent">{{ summaryData.clothesCount }}</text>
              <text class="stat-label">衣物</text>
              <view class="stat-icon-wrap">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </view>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value muted">{{ summaryData.unassignedCount }}</text>
              <text class="stat-label">未归类</text>
              <view class="stat-icon-wrap">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 待整理提醒 -->
      <view
        v-if="!loading && !loadError && unassignedCount > 0"
        class="unassigned-zone"
        hover-class="unassigned-zone-hover"
        :hover-stay-time="100"
        @click="goClothes"
      >
        <view class="unassigned-icon-wrap">
          <svg class="unassigned-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        </view>
        <view class="unassigned-content">
          <text class="unassigned-title">待整理提醒</text>
          <text class="unassigned-desc">你有 {{ unassignedCount }} 件衣物未归类到衣橱</text>
        </view>
        <svg class="unassigned-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </view>
    </view>

    <!-- ===== 衣物分布 ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.distribution }">
      <view class="distribution-zone">
        <view class="section-header-row">
          <text class="section-label">Distribution · 衣物分布</text>
          <view class="section-header-deco"></view>
        </view>

        <!-- 骨架屏 -->
        <view v-if="clothesLoading" class="dist-list">
          <view v-for="n in 5" :key="n" class="dist-row dist-row-skeleton">
            <view class="dist-row-top">
              <view class="skeleton dist-skel-name"></view>
              <view class="skeleton dist-skel-num"></view>
            </view>
            <view class="skeleton dist-skel-bar"></view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else-if="distributionTotal === 0" class="dist-empty">
          <text class="dist-empty-text">暂无衣物数据</text>
          <text class="dist-empty-sub">添加衣物后查看分类分布</text>
        </view>

        <!-- 分布条形图 -->
        <view v-else class="dist-list">
          <view
            v-for="(item, idx) in distributionData"
            :key="item.code"
            class="dist-row"
            :style="{ animationDelay: 0.1 + idx * 0.06 + 's' }"
          >
            <view class="dist-row-top">
              <view class="dist-cat-names">
                <text class="dist-cat-en">{{ item.enName }}</text>
                <text class="dist-cat-cn">{{ item.name }}</text>
              </view>
              <view class="dist-count-wrap">
                <text class="dist-count">{{ item.count }}</text>
                <text class="dist-count-unit">件</text>
                <text class="dist-percent">{{ item.percent }}%</text>
              </view>
            </view>
            <view class="dist-bar-track">
              <view
                class="dist-bar-fill"
                :class="'bar-' + item.code"
                :style="{ width: item.barWidth + '%' }"
              ></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ===== 最近添加 ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.recent }">
      <view class="recent-zone">
        <view class="recent-header">
          <view class="section-header-row" style="padding: 0; margin-bottom: 0;">
            <text class="section-label">Recent · 最近添加</text>
            <view class="section-header-deco"></view>
          </view>
          <view
            v-if="recentClothes.length > 0"
            class="recent-link"
            hover-class="recent-link-hover"
            :hover-stay-time="100"
            @click="goClothes"
          >
            <text class="recent-link-text">查看全部</text>
            <svg class="recent-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </view>
        </view>

        <!-- 空状态 -->
        <view
          v-if="!clothesLoading && recentClothes.length === 0"
          class="recent-empty"
          hover-class="recent-empty-hover"
          :hover-stay-time="100"
          @click="goCreateClothes"
        >
          <text class="recent-empty-text">还没有衣物，去添加第一件吧</text>
          <svg class="recent-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </view>

        <!-- 横向滚动 -->
        <scroll-view v-else scroll-x class="recent-scroll" :show-scrollbar="false">
          <view class="recent-list">
            <template v-if="clothesLoading">
              <view v-for="n in 4" :key="n" class="recent-card-wrap">
                <view class="recent-skeleton-card">
                  <view class="skeleton recent-skel-img"></view>
                  <view class="recent-skel-info">
                    <view class="skeleton recent-skel-name"></view>
                    <view class="skeleton recent-skel-sub"></view>
                  </view>
                </view>
              </view>
            </template>
            <template v-else>
              <view v-for="item in recentClothes" :key="item._id" class="recent-card-wrap">
                <ClothesListCard :clothes="item" />
              </view>
            </template>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- ===== 核心操作 ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.actions }">
      <view class="actions-zone">
        <view class="action-card dark" hover-class="action-card-dark-hover" :hover-stay-time="100" @click="goClosets">
          <!-- 装饰图案 -->
          <view class="card-deco-pattern">
            <svg viewBox="0 0 200 200" class="card-deco-svg">
              <line x1="0" y1="0" x2="200" y2="200" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
              <line x1="60" y1="0" x2="200" y2="140" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
              <line x1="120" y1="0" x2="200" y2="80" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
              <line x1="0" y1="60" x2="140" y2="200" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
              <line x1="0" y1="120" x2="80" y2="200" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
            </svg>
          </view>
          <view class="card-top">
            <view class="card-number-wrap">
              <text class="card-number">{{ summaryData.closetCount }}</text>
              <text class="card-number-unit">个</text>
            </view>
            <view class="card-icon-wrap">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
            </view>
          </view>
          <view class="card-bottom">
            <text class="card-title">我的衣橱</text>
            <text class="card-subtitle">查看和管理</text>
          </view>
          <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </view>

        <view class="action-card light" hover-class="action-card-light-hover" :hover-stay-time="100" @click="goClothes">
          <!-- 装饰图案 -->
          <view class="card-deco-pattern">
            <svg viewBox="0 0 200 200" class="card-deco-svg">
              <circle cx="160" cy="40" r="50" fill="rgba(184,92,58,0.04)"/>
              <circle cx="180" cy="160" r="30" fill="rgba(184,92,58,0.03)"/>
            </svg>
          </view>
          <view class="card-top">
            <view class="card-number-wrap">
              <text class="card-number">{{ summaryData.clothesCount }}</text>
              <text class="card-number-unit">件</text>
            </view>
            <view class="card-icon-wrap">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            </view>
          </view>
          <view class="card-bottom">
            <text class="card-title">我的衣物</text>
            <text class="card-subtitle">浏览列表</text>
          </view>
          <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </view>
      </view>
    </view>

    <!-- ===== 家庭协作区（精简版，无邀请码） ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.family }">
      <view class="family-zone">
        <view class="section-header-row">
          <text class="section-label">Family · 家庭协作</text>
          <view class="section-header-deco"></view>
        </view>

        <!-- 已加入家庭 -->
        <view v-if="isFamilyMode" class="family-info-box">
          <view class="family-name-row">
            <text class="family-name">{{ familyRecord?.name || "未命名家庭" }}</text>
            <text class="family-role">{{ membershipRecord?.role === "admin" ? "Admin" : "Member" }}</text>
          </view>
          <view class="family-summary-row">
            <view class="family-summary-item" hover-class="family-summary-item-hover" :hover-stay-time="100" @click="goFamilyClosets">
              <text class="family-summary-val">{{ familySummaryData.closetCount }}</text>
              <text class="family-summary-label">家庭衣橱</text>
            </view>
            <view class="family-summary-divider"></view>
            <view class="family-summary-item" hover-class="family-summary-item-hover" :hover-stay-time="100" @click="goFamilyClothes">
              <text class="family-summary-val">{{ familySummaryData.clothesCount }}</text>
              <text class="family-summary-label">家庭衣物</text>
            </view>
          </view>
          <view class="members-row">
            <view
              class="member-avatar"
              :class="{ admin: member.role === 'admin' }"
              v-for="member in displayMembers"
              :key="member.user_id"
            >
              {{ getAvatarText(member.nickname || member.username) }}
            </view>
            <text v-if="extraMemberCount > 0" class="member-more">+{{ extraMemberCount }}</text>
            <view class="family-manage-link" hover-class="family-manage-link-hover" :hover-stay-time="100" @click="goFamilyManage">
              <text class="family-manage-text">管理家庭</text>
              <svg class="family-manage-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </view>
          </view>
        </view>

        <!-- 未加入家庭 -->
        <view v-else class="family-empty-box">
          <text class="family-empty-title">开启<text class="em">家庭</text>协作</text>
          <text class="family-empty-desc">加入后可和家人共享衣橱与衣物，按角色协作管理。</text>
          <view class="family-empty-actions">
            <button class="btn-primary" hover-class="btn-primary-hover" :hover-stay-time="100" @click="goCreateFamily">创建家庭</button>
            <button class="btn-secondary" hover-class="btn-secondary-hover" :hover-stay-time="100" @click="goJoinFamily">加入家庭</button>
          </view>
        </view>
      </view>
    </view>

    <!-- ===== 季节贴士 ===== -->
    <view class="content-section" :class="{ 'section-visible': sectionsVisible.season }">
      <view class="season-tip">
        <view class="season-tip-deco">
          <svg viewBox="0 0 60 60" class="season-deco-svg">
            <path d="M30 5 Q 40 20 30 35 Q 20 20 30 5Z" fill="rgba(184,92,58,0.08)"/>
            <path d="M30 25 Q 40 40 30 55 Q 20 40 30 25Z" fill="rgba(184,92,58,0.05)"/>
          </svg>
        </view>
        <text class="season-tip-label">{{ seasonLabel }}</text>
        <text class="season-tip-text">{{ seasonTipText }}</text>
      </view>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-spacer"></view>

    <!-- H5 TabBar -->
    <h5-tab-bar :current-route="ROUTES.home" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow, onPageScroll, onLoad } from "@dcloudio/uni-app";
import H5TabBar from "@/components/H5TabBar.vue";
import { getHomeSummary } from "@/common/api/modules/closet.js";
import { getPersonalClothesList } from "@/common/api/modules/clothes.js";
import ClothesListCard from "@/pages/clothes/components/ClothesListCard.vue";
import { getCurrentSession } from "@/common/services/auth.js";
import { ROUTES } from "@/common/constants/routes.js";
import { setClosetScopeState } from "@/common/services/closet-scope-state.js";
import { getFamilyMembership } from "@/common/services/family-membership.js";
import { getCurrentUserInfo } from "@/common/api/modules/auth.js";
import { getFamilyMembers } from "@/common/api/modules/family.js";
import {
  getHomeSummaryCache,
  setHomeSummaryCache,
  getHomeClothesCache,
  setHomeClothesCache,
  getFamilyInfoCache,
  setFamilyInfoCache,
  getUserInfoCache,
  setUserInfoCache,
} from "@/common/services/cache-service.js";

const nickname = ref("");
const isFamilyMode = ref(false);
const familyRecord = ref(null);
const membershipRecord = ref(null);
const familyMembers = ref([]);
const closetCount = ref(0);
const clothesCount = ref(0);
const unassignedCount = ref(0);
const familyClosetCount = ref(0);
const familyClothesCount = ref(0);
const loading = ref(false);
const loadError = ref(false);

// 各区块独立错误状态
const summaryError = ref(false);
const clothesError = ref(false);
const familyError = ref(false);
const isDegraded = ref(false); // 降级模式标记
const isGuest = ref(false); // 游客模式标记
const hasInitialized = ref(false); // 首次加载标记

// 衣物列表（用于分布统计和最近添加）
const clothesList = ref([]);
const clothesLoading = ref(false);

// 滚动位置 & 窗口高度
const scrollY = ref(0);
const windowHeight = ref(812);
const statusBarHeight = ref(44);

// ===== 全屏吸附滚动 =====
const isAnimating = ref(false);
let touchStartY = 0;
let touchStartTime = 0;

// 各区块的可见状态（滚动触发动画）
const sectionsVisible = ref({
  stats: false,
  distribution: false,
  recent: false,
  actions: false,
  family: false,
  season: false,
});

// 衣物分布配置
const DISTRIBUTION_CATEGORIES = [
  { code: "top", name: "上装", enName: "Top" },
  { code: "bottom", name: "下装", enName: "Bottom" },
  { code: "outerwear", name: "外套", enName: "Outerwear" },
  { code: "shoes", name: "鞋子", enName: "Shoes" },
  { code: "accessory", name: "配饰", enName: "Accessory" },
];

// 小程序端加载自定义字体
// #ifdef MP-WEIXIN
const fontsLoaded = ref(false);

function loadCustomFont(family, source) {
  return new Promise((resolve) => {
    uni.loadFontFace({
      family,
      source,
      global: false,
      success() {
        resolve(true);
      },
      fail() {
        resolve(false);
      },
    });
  });
}

async function loadCustomFonts() {
  if (fontsLoaded.value) return;
  await Promise.all([
    loadCustomFont("Fraunces", 'url("https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.ttf")'),
    loadCustomFont("Manrope", 'url("https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-400-normal.ttf")'),
    loadCustomFont("JetBrains Mono", 'url("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf")'),
  ]);
  fontsLoaded.value = true;
}
// #endif

// ===== 滚动驱动动画 =====

// Hero 屏幕整体样式（随滚动淡出，不使用 scale 避免白边）
const heroScreenStyle = computed(() => {
  const progress = Math.min(scrollY.value / windowHeight.value, 1);
  return {
    opacity: `${1 - progress * 0.85}`,
  };
});

// 背景图视差
const heroBgStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.4}px) scale(${1 + scrollY.value * 0.0005})`,
}));

// 装饰线条视差
const heroDecoStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.2}px)`,
  opacity: Math.max(0, 1 - scrollY.value / 500),
}));

// 顶部标记视差
const heroTopbarStyle = computed(() => ({
  opacity: Math.max(0, 1 - scrollY.value / 200),
  transform: `translateY(${-scrollY.value * 0.15}px)`,
}));

// 品牌内容视差（保留 translateX(-50%) 居中）
const heroContentStyle = computed(() => ({
  transform: `translate(-50%, calc(-50% + ${-scrollY.value * 0.25}px))`,
  opacity: Math.max(0, 1 - scrollY.value / 500),
}));

// 滚动提示（保留 translateX(-50%) 居中）
const scrollHintStyle = computed(() => ({
  opacity: Math.max(0, 1 - scrollY.value / 150),
  transform: `translateX(-50%) translateY(${-scrollY.value * 0.1}px)`,
}));

// ===== 问候语 & 季节 =====
const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
});

const currentSeason = computed(() => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
});

const seasonLabel = computed(() => {
  const labels = {
    spring: "Spring · 春日提示",
    summer: "Summer · 夏日提示",
    autumn: "Autumn · 秋日提示",
    winter: "Winter · 冬日提示",
  };
  return labels[currentSeason.value];
});

const seasonTipText = computed(() => {
  const tips = {
    spring: "「春天来了，整理一下薄外套，把厚冬装收起来吧。」",
    summer: "「夏天到了，检查一下透气凉爽的衣物是否齐全。」",
    autumn: "「入秋了，把薄外套翻出来，检查去年的冬装是否还能穿。」",
    winter: "「冬天来了，检查冬装是否齐全，别等降温了再翻箱倒柜。」",
  };
  return tips[currentSeason.value];
});

// ===== 数据计算 =====
const summaryData = computed(() => ({
  closetCount: String(closetCount.value),
  clothesCount: String(clothesCount.value),
  unassignedCount: String(unassignedCount.value),
}));

const distributionData = computed(() => {
  const counts = {};
  DISTRIBUTION_CATEGORIES.forEach((cat) => {
    counts[cat.code] = 0;
  });
  clothesList.value.forEach((item) => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const max = Math.max(...Object.values(counts), 1);
  return DISTRIBUTION_CATEGORIES.map((cat) => ({
    ...cat,
    count: counts[cat.code],
    percent: total > 0 ? Math.round((counts[cat.code] / total) * 100) : 0,
    barWidth: max > 0 ? (counts[cat.code] / max) * 100 : 0,
  }));
});

const distributionTotal = computed(() =>
  distributionData.value.reduce((sum, item) => sum + item.count, 0)
);

const recentClothes = computed(() => clothesList.value.slice(0, 6));

const familySummaryData = computed(() => ({
  closetCount: String(familyClosetCount.value),
  clothesCount: String(familyClothesCount.value),
}));

const MAX_DISPLAY_MEMBERS = 4;
const displayMembers = computed(() => familyMembers.value.slice(0, MAX_DISPLAY_MEMBERS));
const extraMemberCount = computed(() => Math.max(0, familyMembers.value.length - MAX_DISPLAY_MEMBERS));

function getAvatarText(name) {
  if (!name) return "?";
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase();
}

// ===== 数据加载（缓存优先 + 降级展示） =====

async function syncClosetSummary() {
  const session = getCurrentSession();
  const uid = session?.uid;

  // 先读缓存，立即展示
  const cached = uid ? getHomeSummaryCache(uid, "personal") : null;
  if (cached) {
    closetCount.value = cached.closetCount || 0;
    clothesCount.value = cached.clothesCount || 0;
    unassignedCount.value = cached.unassignedClothesCount || 0;
    loading.value = false;
  } else {
    loading.value = true;
  }
  summaryError.value = false;

  try {
    const summary = await getHomeSummary({ scopeType: "personal" });
    closetCount.value = summary?.closetCount || 0;
    clothesCount.value = summary?.clothesCount || 0;
    unassignedCount.value = summary?.unassignedClothesCount || 0;
    // 写入缓存
    if (uid && summary) {
      setHomeSummaryCache(uid, "personal", summary);
    }
    loadError.value = false;
  } catch (error) {
    console.error("syncClosetSummary failed", error);
    if (!cached) {
      closetCount.value = 0;
      clothesCount.value = 0;
      unassignedCount.value = 0;
    }
    summaryError.value = true;
    loadError.value = !cached; // 有缓存时不显示全局错误
  } finally {
    loading.value = false;
  }
}

function retryLoad() {
  syncClosetSummary();
  loadClothesForHome();
}

async function loadClothesForHome() {
  const session = getCurrentSession();
  const uid = session?.uid;

  // 先读缓存
  const cached = uid ? getHomeClothesCache(uid) : null;
  if (cached && Array.isArray(cached)) {
    clothesList.value = cached;
    clothesLoading.value = false;
  } else {
    clothesLoading.value = true;
  }
  clothesError.value = false;

  try {
    const result = await getPersonalClothesList({ page: 1, pageSize: 100 });
    const list = result?.list || [];
    clothesList.value = list;
    // 写入缓存
    if (uid && list.length > 0) {
      setHomeClothesCache(uid, list);
    }
  } catch (error) {
    console.error("loadClothesForHome failed", error);
    if (!cached) {
      clothesList.value = [];
    }
    clothesError.value = true;
  } finally {
    clothesLoading.value = false;
  }
}

async function syncFamilySummary() {
  if (!isFamilyMode.value) {
    familyClosetCount.value = 0;
    familyClothesCount.value = 0;
    return;
  }

  const session = getCurrentSession();
  const uid = session?.uid;

  // 先读缓存
  const cached = uid ? getHomeSummaryCache(uid, "family") : null;
  if (cached) {
    familyClosetCount.value = cached.closetCount || 0;
    familyClothesCount.value = cached.clothesCount || 0;
  }

  try {
    const summary = await getHomeSummary({ scopeType: "family" });
    familyClosetCount.value = summary?.closetCount || 0;
    familyClothesCount.value = summary?.clothesCount || 0;
    if (uid && summary) {
      setHomeSummaryCache(uid, "family", summary);
    }
    familyError.value = false;
  } catch (error) {
    console.error("syncFamilySummary failed", error);
    if (!cached) {
      familyClosetCount.value = 0;
      familyClothesCount.value = 0;
    }
    familyError.value = true;
  }
}

async function syncScopeStatus() {
  const session = getCurrentSession();

  // 游客模式：未登录用户可浏览首页静态内容
  if (!session.hasLogin) {
    isGuest.value = true;
    nickname.value = "游客";
    // 游客不加载个人数据，保持各计数为0
    loading.value = false;
    clothesLoading.value = false;
    return;
  }

  isGuest.value = false;
  const uid = session.uid;

  // 1. 用户信息：缓存优先
  const cachedUserInfo = getUserInfoCache(uid);
  if (cachedUserInfo) {
    nickname.value = cachedUserInfo.nickname || cachedUserInfo.username || "用户";
  }
  try {
    const info = await getCurrentUserInfo(uid);
    if (info) {
      nickname.value = info.nickname || info.username || "用户";
      setUserInfoCache(uid, info);
    }
  } catch (e) {
    if (!cachedUserInfo) nickname.value = "用户";
  }

  // 2. 家庭状态：失败时降级，不阻塞
  const membership = await getFamilyMembership(uid);
  if (membership.status !== "success") {
    // 降级模式：尝试从缓存恢复家庭信息
    isDegraded.value = true;
    const cachedFamily = getFamilyInfoCache(uid);
    if (cachedFamily) {
      familyRecord.value = cachedFamily.familyRecord || null;
      membershipRecord.value = cachedFamily.membershipRecord || null;
      isFamilyMode.value = cachedFamily.hasFamily || false;
      familyMembers.value = cachedFamily.members || [];
    }
    // 降级模式下仍然加载个人空间数据
    await syncClosetSummary();
    loadClothesForHome();
    if (isFamilyMode.value) {
      syncFamilySummary();
    }
    return;
  }

  // 正常模式
  isDegraded.value = false;
  familyRecord.value = membership.familyRecord || null;
  membershipRecord.value = membership.membershipRecord || null;

  // 缓存家庭信息
  if (membership.hasFamily) {
    setFamilyInfoCache(uid, {
      hasFamily: true,
      familyRecord: membership.familyRecord,
      membershipRecord: membership.membershipRecord,
    });
  }

  if (membership.hasFamily) {
    isFamilyMode.value = true;
    try {
      const membersRes = await getFamilyMembers();
      familyMembers.value = membersRes?.members || [];
      // 更新缓存
      setFamilyInfoCache(uid, {
        hasFamily: true,
        familyRecord: membership.familyRecord,
        membershipRecord: membership.membershipRecord,
        members: familyMembers.value,
      });
    } catch (error) {
      familyMembers.value = [];
    }
    await syncFamilySummary();
  } else {
    isFamilyMode.value = false;
    familyMembers.value = [];
    familyClosetCount.value = 0;
    familyClothesCount.value = 0;
  }

  await syncClosetSummary();
  loadClothesForHome();
}

// ===== 登录拦截工具 =====
function requireLogin(actionName) {
  const session = getCurrentSession();
  if (!session.hasLogin) {
    uni.showToast({
      title: actionName ? `请先登录后再${actionName}` : "请先登录",
      icon: "none",
      duration: 2000,
    });
    setTimeout(() => {
      uni.navigateTo({ url: ROUTES.login });
    }, 800);
    return false;
  }
  return true;
}

function goLogin() {
  uni.navigateTo({ url: ROUTES.login });
}

// ===== 导航 =====
function goClosets() {
  if (!requireLogin("查看衣橱")) return;
  const session = getCurrentSession();
  setClosetScopeState(session?.uid, "personal");
  uni.switchTab({ url: ROUTES.closets });
}

function goFamilyClosets() {
  if (!requireLogin("查看家庭衣橱")) return;
  const session = getCurrentSession();
  setClosetScopeState(session?.uid, "family");
  uni.switchTab({ url: ROUTES.closets });
}

function goFamilyClothes() {
  if (!requireLogin("查看家庭衣物")) return;
  const session = getCurrentSession();
  setClosetScopeState(session?.uid, "family");
  uni.switchTab({ url: ROUTES.clothes });
}

function goClothes() {
  if (!requireLogin("查看衣物")) return;
  uni.switchTab({ url: ROUTES.clothes });
}

function goCreateClothes() {
  if (!requireLogin("添加衣物")) return;
  uni.navigateTo({ url: ROUTES.clothesCreate });
}

function goCreateFamily() {
  if (!requireLogin("创建家庭")) return;
  uni.navigateTo({ url: ROUTES.familyCreate });
}

function goJoinFamily() {
  if (!requireLogin("加入家庭")) return;
  uni.navigateTo({ url: ROUTES.familyGuide });
}

function goFamilyManage() {
  if (!requireLogin("管理家庭")) return;
  uni.switchTab({ url: ROUTES.profile });
}

// ===== 全屏吸附滚动逻辑 =====

function onTouchStart(e) {
  // 用户触摸时取消正在进行的吸附动画，交还控制权
  if (isAnimating.value) {
    isAnimating.value = false;
  }
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}

function onTouchEnd(e) {
  if (isAnimating.value) return;

  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY; // 正值=上滑(向下滚动)
  const duration = Date.now() - touchStartTime;
  const wh = windowHeight.value;
  const currentScroll = scrollY.value;

  // 内容区深处：正常滚动，不干预
  if (currentScroll >= wh * 1.3) return;

  // 判断是否为有效滑动（幅度够大 或 快速滑动）
  const isSwipe = Math.abs(deltaY) > 40 || (duration < 300 && Math.abs(deltaY) > 15);

  let target = currentScroll;

  if (isSwipe) {
    // 明确滑动方向：上滑→内容区顶部，下滑→Hero 顶部
    target = deltaY > 0 ? wh : 0;
  } else {
    // 轻触：吸附到最近的屏（Hero 或内容区）
    target = currentScroll > wh * 0.5 ? wh : 0;
  }

  // 距离太近不触发吸附
  if (Math.abs(target - currentScroll) > 5) {
    snapTo(target);
  }
}

function snapTo(target) {
  if (isAnimating.value) return;
  isAnimating.value = true;

  const startScroll = scrollY.value;
  const distance = target - startScroll;
  const startTime = Date.now();
  const wh = windowHeight.value;
  // 全屏距离 800ms，短距离按比例缩短，最小 500ms
  const duration = Math.min(800, Math.max(500, (Math.abs(distance) / wh) * 800));

  // easeOutQuart：快速启动 → 缓慢减速，高级感强
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step() {
    // 用户触摸时取消动画
    if (!isAnimating.value) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const currentScroll = startScroll + distance * eased;

    // 直接更新 scrollY 驱动视差（绕过 onPageScroll 的节流延迟）
    scrollY.value = currentScroll;

    // 同步真实滚动位置（duration:0 = 瞬间定位）
    uni.pageScrollTo({
      scrollTop: currentScroll,
      duration: 0,
    });

    if (progress < 1) {
      setTimeout(step, 16); // ~60fps
    } else {
      // 确保最终位置精确
      scrollY.value = target;
      uni.pageScrollTo({
        scrollTop: target,
        duration: 0,
      });
      isAnimating.value = false;
    }
  }

  step();
}

// ===== 生命周期 =====
onLoad(() => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    windowHeight.value = sysInfo.windowHeight || 812;
    statusBarHeight.value = sysInfo.statusBarHeight || 44;
  } catch (e) {
    windowHeight.value = 812;
    statusBarHeight.value = 44;
  }

  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  // #endif
});

// 节流：scroll 监听避免频繁触发
let scrollThrottleTimer = null;
let pendingScrollTop = 0;

onPageScroll((e) => {
  pendingScrollTop = e.scrollTop;

  if (!scrollThrottleTimer) {
    scrollThrottleTimer = setTimeout(() => {
      scrollThrottleTimer = null;
      // 自定义动画期间，scrollY 由动画循环直接管理，跳过以避免反馈循环
      if (!isAnimating.value) {
        scrollY.value = pendingScrollTop;
      }

      // 滚动触发区块动画
      const wh = windowHeight.value;
      const triggers = {
        stats: wh * 0.3,
        distribution: wh * 0.5,
        recent: wh * 0.7,
        actions: wh * 0.85,
        family: wh * 1.0,
        season: wh * 1.15,
      };

      Object.keys(triggers).forEach((key) => {
        if (pendingScrollTop > triggers[key] && !sectionsVisible.value[key]) {
          sectionsVisible.value[key] = true;
        }
      });
    }, 50);
  }
});

onShow(() => {
  // #ifdef MP-WEIXIN
  uni.hideTabBar({ animation: false });
  loadCustomFonts();
  // #endif

  if (!hasInitialized.value) {
    // 首次加载：全量请求
    hasInitialized.value = true;
    syncScopeStatus();
  }
  // 非首次不重新请求，页面数据保持上次状态
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg-page;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page::-webkit-scrollbar {
  display: none;
}

/* ===== 第一屏：沉浸式 Hero ===== */
.hero-screen {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: $color-primary-dark;
  will-change: opacity;
}

.hero-bg-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  will-change: transform;
}

.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
    rgba(45, 67, 52, 0.55) 0%,
    rgba(45, 67, 52, 0.3) 30%,
    rgba(45, 67, 52, 0.15) 50%,
    rgba(45, 67, 52, 0.35) 80%,
    rgba(45, 67, 52, 0.6) 100%
  );
}

.hero-bg-noise {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.04;
  pointer-events: none;
}

/* 装饰线条 */
.hero-deco-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
  will-change: transform, opacity;
}

.deco-svg {
  width: 100%;
  height: 100%;
}

/* 顶部标记 */
.hero-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding-left: 28px;
  padding-right: 28px;
  display: flex;
  justify-content: center;
  will-change: transform, opacity;
}

.hero-mark {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: $radius-pill;
  background: rgba(244, 239, 230, 0.08);
  border: 1px solid rgba(244, 239, 230, 0.12);
  backdrop-filter: blur(20px);
}

.hero-mark-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $color-terra-soft;
  animation: pulseDot 2.5s ease-in-out infinite;
}

.hero-mark-text {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 3px;
  color: $inverse-85;
  font-weight: 500;
}

/* 品牌主体内容 */
.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  width: 100%;
  padding: 0 40px;
  will-change: transform, opacity;
}

.hero-title-en {
  display: block;
  font-family: $font-serif;
  font-size: 44px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1.5px;
  color: $color-text-inverse;
  margin-bottom: 8px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both;
}

.hero-title-cn-wrap {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 24px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both;
}

.hero-title-cn {
  font-family: $font-serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 2px;
  color: $inverse-85;
}

.hero-title-cn.em {
  transform: skewX(-8deg);
  transform-origin: left center;
  font-weight: 300;
  color: $color-sage-light;
}

.hero-divider {
  width: 40px;
  height: 1px;
  background: rgba(244, 239, 230, 0.25);
  margin: 0 auto 24px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s both;
}

.hero-intro {
  display: block;
  font-family: $font-sans;
  font-size: 15px;
  font-weight: 500;
  color: $inverse-85;
  letter-spacing: 1px;
  margin-bottom: 8px;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.65s both;
}

.hero-intro-sub {
  display: block;
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 2px;
  color: $inverse-50;
  text-transform: uppercase;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.75s both;
}

/* 滚动提示 */
.hero-scroll-hint {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  will-change: transform, opacity;
}

.scroll-hint-text {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 3px;
  color: $inverse-35;
  text-transform: uppercase;
}

.scroll-hint-line {
  width: 1px;
  height: 40px;
  background: rgba(244, 239, 230, 0.15);
  position: relative;
  overflow: hidden;
}

.scroll-hint-dot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 8px;
  border-radius: 2px;
  background: $color-terra-soft;
  animation: scrollDot 2s ease-in-out infinite;
}

@keyframes scrollDot {
  0% {
    top: 0;
    opacity: 1;
  }
  80% {
    top: 32px;
    opacity: 0;
  }
  100% {
    top: 32px;
    opacity: 0;
  }
}

/* ===== 内容区块通用 ===== */
.content-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
              transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.content-section.section-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}

.section-greeting {
  font-family: $font-kai;
  font-size: 13px;
  color: $color-text-placeholder;
}

.section-label {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-text-placeholder;
  margin-bottom: 14px;
  display: block;
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.section-header-row .section-label {
  margin-bottom: 0;
  flex-shrink: 0;
}

.section-header-deco {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, $color-border 0%, transparent 100%);
}

/* ===== 数据概览 ===== */

/* 降级模式提示条 */
.degraded-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 28px 12px;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(212, 128, 95, 0.08);
  border: 1px solid rgba(212, 128, 95, 0.15);
}

.degraded-icon {
  width: 16px;
  height: 16px;
  color: $color-terra;
  flex-shrink: 0;
}

.degraded-text {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-terra;
  letter-spacing: 0.3px;
}

/* 游客模式提示条 */
.guest-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 28px 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(45, 67, 52, 0.08) 0%, rgba(58, 84, 67, 0.05) 100%);
  border: 1px solid rgba(45, 67, 52, 0.12);
  transition: all 0.2s ease;
}

.guest-banner:active {
  background: linear-gradient(135deg, rgba(45, 67, 52, 0.12) 0%, rgba(58, 84, 67, 0.08) 100%);
  transform: scale(0.99);
}

.guest-icon {
  width: 20px;
  height: 20px;
  stroke: $color-primary;
  flex-shrink: 0;
}

.guest-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guest-title {
  font-family: $font-sans;
  font-size: 14px;
  font-weight: 600;
  color: $color-primary-dark;
}

.guest-desc {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
  line-height: 1.4;
}

.guest-action {
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 600;
  color: $color-terra;
  padding: 6px 14px;
  border-radius: $radius-pill;
  background: rgba(184, 92, 58, 0.08);
  border: 1px solid rgba(184, 92, 58, 0.15);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.guest-action:active {
  background: rgba(184, 92, 58, 0.15);
}

/* 问候区 */
.stats-zone {
  padding: 0 28px;
}
.stats-greeting {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.greeting-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(58, 84, 67, 0.08) 0%, rgba(122, 149, 128, 0.12) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.greeting-icon {
  width: 22px;
  height: 22px;
  stroke: $color-primary;
}

.greeting-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.greeting-label {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
  font-weight: 500;
}

.greeting-name {
  font-family: $font-serif;
  font-size: 20px;
  font-weight: 600;
  color: $color-primary-dark;
  letter-spacing: -0.5px;
}

/* 数据卡片 */
.stats-card {
  position: relative;
  border-radius: 20px;
  background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 60%, $color-primary-soft 100%);
  padding: 28px 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(45, 67, 52, 0.18);
}

.stats-card-deco {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stats-deco-svg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 200px;
  height: auto;
  opacity: 0.8;
}

.stats-row {
  display: flex;
  gap: 0;
  align-items: stretch;
  position: relative;
  z-index: 1;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  padding: 8px 4px;
  border-radius: $radius-sm;
  transition: background 0.2s ease;
}

.stat-item-hover {
  background: rgba(255, 255, 255, 0.08);
}

.stat-divider {
  width: 1px;
  background: rgba(244, 239, 230, 0.15);
  align-self: stretch;
  margin: 4px 0;
}

.stat-value {
  font-family: $font-serif;
  font-size: 40px;
  font-weight: 300;
  line-height: 1;
  color: $color-text-inverse;
  letter-spacing: -1.5px;
}

.stat-value.accent {
  color: $color-terra-soft;
}

.stat-value.muted {
  color: $inverse-55;
  font-size: 32px;
}

.stat-label {
  font-family: $font-sans;
  font-size: 11px;
  font-weight: 600;
  color: $inverse-55;
  letter-spacing: 0.5px;
}

.stat-icon-wrap {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0.2;
}

.stat-icon {
  width: 14px;
  height: 14px;
  stroke: $color-text-inverse;
}

/* ===== 待整理提醒 ===== */
.unassigned-zone {
  margin: 20px 28px 0;
  padding: 16px 18px;
  border-radius: $radius-card;
  background: linear-gradient(135deg, rgba(184, 92, 58, 0.06) 0%, rgba(212, 128, 95, 0.04) 100%);
  border: 1px solid rgba(184, 92, 58, 0.18);
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.unassigned-zone-hover {
  background: rgba(184, 92, 58, 0.1);
  transform: translateY(-1px);
}

.unassigned-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(184, 92, 58, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.unassigned-icon {
  width: 18px;
  height: 18px;
  stroke: $color-terra;
}

.unassigned-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.unassigned-title {
  font-family: $font-serif;
  font-size: 14px;
  font-weight: 600;
  color: $color-terra;
}

.unassigned-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-secondary;
  line-height: 1.4;
}

.unassigned-arrow {
  width: 16px;
  height: 16px;
  stroke: $color-terra;
  opacity: 0.5;
  flex-shrink: 0;
}

/* ===== 衣物分布 ===== */
.distribution-zone {
  padding: 36px 28px 0;
}

.dist-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 18px;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
}

.dist-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.dist-row-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.dist-cat-names {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.dist-cat-en {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.dist-cat-cn {
  font-family: $font-sans;
  font-size: 13px;
  font-weight: 600;
  color: $color-text-secondary;
}

.dist-count-wrap {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.dist-count {
  font-family: $font-sans;
  font-size: 16px;
  font-weight: 600;
  color: $color-primary-dark;
}

.dist-count-unit {
  font-family: $font-sans;
  font-size: 10px;
  color: $color-text-placeholder;
}

.dist-percent {
  font-family: $font-mono;
  font-size: 10px;
  color: $color-text-placeholder;
  margin-left: 6px;
}

.dist-bar-track {
  height: 6px;
  background: rgba(58, 84, 67, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.dist-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}

.bar-top { background: linear-gradient(90deg, $color-primary, $color-primary-soft); }
.bar-bottom { background: linear-gradient(90deg, $color-sage, $color-sage-light); }
.bar-outerwear { background: linear-gradient(90deg, $color-terra, $color-terra-soft); }
.bar-shoes { background: linear-gradient(90deg, $color-moss, $color-sage); }
.bar-accessory { background: linear-gradient(90deg, $color-sage-light, #c8cebf); }

/* 分布骨架屏 */
.dist-row-skeleton { gap: 8px; }
.dist-skel-name { height: 12px; width: 80px; border-radius: 4px; }
.dist-skel-num { height: 16px; width: 40px; border-radius: 4px; }
.dist-skel-bar { height: 8px; width: 100%; border-radius: 4px; }

/* 分布空状态 */
.dist-empty {
  padding: 24px 0;
  text-align: center;
}

.dist-empty-text {
  font-family: $font-serif;
  font-size: 14px;
  color: $color-text-secondary;
  display: block;
  margin-bottom: 4px;
}

.dist-empty-sub {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
}

/* ===== 最近添加 ===== */
.recent-zone {
  padding: 36px 0 0;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  margin-bottom: 14px;
}

.recent-header .section-label {
  margin-bottom: 0;
}

.recent-link {
  display: flex;
  align-items: center;
  gap: 2px;
  transition: opacity 0.2s ease;
}

.recent-link-hover { opacity: 0.6; }

.recent-link-text {
  font-family: $font-sans;
  font-size: 11px;
  font-weight: 600;
  color: $color-terra;
}

.recent-link-arrow {
  width: 14px;
  height: 14px;
  stroke: $color-terra;
}

.recent-scroll {
  width: 100%;
  white-space: nowrap;
}

.recent-list {
  display: inline-flex;
  gap: 12px;
  padding: 0 28px;
}

.recent-card-wrap {
  flex-shrink: 0;
  width: 240rpx;
}

/* 最近添加骨架屏 */
.recent-skeleton-card {
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  overflow: hidden;
}

.recent-skel-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0;
}

.recent-skel-info {
  padding: 16rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.recent-skel-name { height: 22rpx; width: 60%; border-radius: 4rpx; }
.recent-skel-sub { height: 18rpx; width: 40%; border-radius: 4rpx; }

/* 最近添加空状态 */
.recent-empty {
  margin: 0 28px;
  padding: 24px 20px;
  border-radius: $radius-card;
  background: $color-bg-card-end;
  border: 1px dashed $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.recent-empty-hover { background: $color-bg-chip; }

.recent-empty-text {
  font-family: $font-sans;
  font-size: 13px;
  color: $color-text-placeholder;
}

.recent-empty-icon {
  width: 16px;
  height: 16px;
  stroke: $color-terra;
  opacity: 0.7;
}

/* ===== 核心操作 ===== */
.actions-zone {
  padding: 36px 28px 0;
  display: flex;
  gap: 12px;
}

.action-card {
  flex: 1;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.action-card.dark {
  background: linear-gradient(145deg, $color-primary-dark 0%, $color-primary 100%);
  padding: 22px 20px;
  box-shadow: 0 6px 24px rgba(45, 67, 52, 0.15);
}

.action-card-dark-hover {
  background: linear-gradient(145deg, $color-primary-soft 0%, $color-primary 100%);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(45, 67, 52, 0.25);
}

.action-card.light {
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  padding: 22px 20px;
  box-shadow: 0 4px 16px rgba(58, 84, 67, 0.06);
}

.action-card-light-hover {
  background: #ffffff;
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(58, 84, 67, 0.12);
}

/* 卡片装饰图案 */
.card-deco-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.card-deco-svg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 160px;
  height: 160px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-number-wrap {
  display: flex;
  align-items: baseline;
}

.card-number {
  font-family: $font-serif;
  font-size: 44px;
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -2px;
}

.action-card.dark .card-number { color: $color-sage-light; }
.action-card.light .card-number { color: $color-terra; }

.card-number-unit {
  font-family: $font-mono;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-left: 4px;
  opacity: 0.5;
}

.card-icon-wrap { margin-top: 4px; }

.card-icon {
  width: 20px;
  height: 20px;
  opacity: 0.4;
  display: block;
}

.action-card.dark .card-icon { stroke: $color-sage-light; }
.action-card.light .card-icon { stroke: $color-primary; }

.card-bottom { margin-top: 20px; }

.card-title {
  font-family: $font-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 2px;
  display: block;
}

.action-card.dark .card-title { color: $color-text-inverse; }
.action-card.light .card-title { color: $color-primary-dark; }

.card-subtitle {
  font-family: $font-sans;
  font-size: 11px;
  line-height: 1.4;
  display: block;
}

.action-card.dark .card-subtitle { color: $inverse-50; }
.action-card.light .card-subtitle { color: $color-text-placeholder; }

.card-arrow {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 16px;
  height: 16px;
  opacity: 0.3;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.action-card.dark .card-arrow { stroke: $color-sage-light; }
.action-card.light .card-arrow { stroke: $color-primary; }

/* ===== 家庭协作区 ===== */
.family-zone {
  padding: 36px 28px 0;
}

.family-info-box {
  padding: 24px;
  border-radius: 20px;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  box-shadow: 0 4px 16px rgba(58, 84, 67, 0.05);
}

.family-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.family-name {
  font-family: $font-serif;
  font-size: 17px;
  font-weight: 600;
  color: $color-primary-dark;
}

.family-role {
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-terra;
  padding: 3px 10px;
  border: 1px solid rgba(184, 92, 58, 0.25);
  border-radius: $radius-btn;
}

.family-summary-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 14px;
  border-top: 1px solid $color-border-soft;
  border-bottom: 1px solid $color-border-soft;
}

.family-summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0;
  border-radius: $radius-sm;
  transition: background 0.2s ease;
}

.family-summary-item-hover { background: rgba(58, 84, 67, 0.03); }

.family-summary-divider {
  width: 1px;
  height: 28px;
  background: $color-border-soft;
}

.family-summary-val {
  font-family: $font-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  color: $color-primary-dark;
  letter-spacing: -0.5px;
}

.family-summary-label {
  font-family: $font-sans;
  font-size: 10px;
  font-weight: 600;
  color: $color-text-placeholder;
}

.members-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: $color-moss;
  color: $color-text-inverse;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-serif;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid $color-bg-card-end;
}

.member-avatar.admin { background: $color-terra; }

.member-more {
  font-family: $font-sans;
  font-size: 11px;
  color: $color-text-placeholder;
  margin-left: 4px;
}

.family-manage-link {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border-radius: $radius-btn;
  background: $color-bg-chip;
  transition: opacity 0.2s ease;
}

.family-manage-link-hover { opacity: 0.7; }

.family-manage-text {
  font-family: $font-sans;
  font-size: 11px;
  font-weight: 600;
  color: $color-primary-dark;
}

.family-manage-arrow {
  width: 12px;
  height: 12px;
  stroke: $color-primary-dark;
}

/* 未加入家庭 */
.family-empty-box {
  padding: 30px 24px;
  border-radius: 20px;
  background: $color-bg-card-end;
  border: 1px solid $color-border;
  text-align: center;
  box-shadow: 0 4px 16px rgba(58, 84, 67, 0.05);
}

.family-empty-title {
  display: block;
  font-family: $font-serif;
  font-size: 16px;
  font-weight: 600;
  color: $color-primary-dark;
  margin-bottom: 6px;
}

.family-empty-title .em {
  transform: skewX(-8deg);
  transform-origin: left center;
  display: inline-block;
  color: $color-terra;
}

.family-empty-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $color-text-placeholder;
  line-height: 1.6;
  margin-bottom: 16px;
  display: block;
}

.family-empty-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $color-primary;
  color: $color-text-inverse;
  border: none;
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 600;
  line-height: 40px;
  transition: background 0.2s ease;
}

.btn-primary-hover { background: $color-primary-soft; }

.btn-secondary {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: transparent;
  color: $color-primary-dark;
  border: 1px solid $color-border;
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 600;
  line-height: 40px;
  transition: all 0.2s ease;
}

.btn-secondary-hover { background: $color-bg-chip; }

/* ===== 季节贴士 ===== */
.season-tip {
  margin: 36px 28px 0;
  padding: 20px 20px;
  border-radius: 16px;
  border-left: 3px solid $color-terra;
  background: linear-gradient(135deg, rgba(184, 92, 58, 0.04) 0%, rgba(212, 128, 95, 0.02) 100%);
  position: relative;
  overflow: hidden;
}

.season-tip-deco {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 50px;
  height: 50px;
  opacity: 0.6;
  pointer-events: none;
}

.season-deco-svg {
  width: 100%;
  height: 100%;
}

.season-tip-label {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-terra;
  margin-bottom: 6px;
  display: block;
}

.season-tip-text {
  display: block;
  font-family: $font-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: $color-text-secondary;
}

/* ===== 底部留白 ===== */
.bottom-spacer {
  height: 120px;
}

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.06) 100%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-num { height: 36px; width: 48px; border-radius: 4px; }
.skeleton-text-sm { height: 10px; width: 40%; margin-top: 6px; }

/* ===== 错误态卡片 ===== */
.error-card {
  padding: 18px 20px;
  border-radius: $radius-card;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.err-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke: $color-terra-soft;
  margin-top: 1px;
}

.err-content {
  flex: 1;
  min-width: 0;
}

.err-title {
  font-family: $font-serif;
  font-size: 14px;
  font-weight: 600;
  color: $color-text-inverse;
  margin-bottom: 2px;
  display: block;
}

.err-desc {
  font-family: $font-sans;
  font-size: 12px;
  color: $inverse-55;
  line-height: 1.5;
  display: block;
  margin-bottom: 8px;
}

.err-retry {
  font-family: $font-sans;
  font-size: 12px;
  font-weight: 600;
  color: $color-terra-soft;
  padding: 4px 0;
  display: inline-block;
  transition: all 0.2s ease;
}

.err-retry:active { opacity: 0.8; }
</style>
