<template>
  <view class="closet-card" hover-class="closet-card-hover" :hover-stay-time="100" @tap="goDetail">
    <view class="closet-card__left">
      <view
        class="closet-card__color-circle"
        :style="{ backgroundColor: colorOption.color }"
      >
        <view class="closet-card__style-icon">
          <!-- 简约平门柜 -->
          <svg
            v-if="closet.style_code === 'modern-flat'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          <!-- 弧顶复古柜 -->
          <svg
            v-else-if="closet.style_code === 'arched-vintage'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 20V10a9 9 0 0 1 18 0v10" />
            <line x1="3" y1="20" x2="21" y2="20" />
            <line x1="12" y1="20" x2="12" y2="10" />
          </svg>
          <!-- 开放式收纳柜 -->
          <svg
            v-else-if="closet.style_code === 'open-rack'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="3" x2="4" y2="21" />
            <line x1="20" y1="3" x2="20" y2="21" />
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="14" x2="20" y2="14" />
          </svg>
          <!-- 抽屉组合柜 -->
          <svg
            v-else-if="closet.style_code === 'drawer-mix'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="8" y1="6" x2="8" y2="8" />
            <line x1="16" y1="12" x2="16" y2="14" />
          </svg>
          <!-- 默认图标 -->
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="1" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        </view>
      </view>
    </view>

    <view class="closet-card__center">
      <text class="closet-card__name">{{ closet.name }}</text>
      <view class="closet-card__meta">
        <text class="closet-card__meta-text">{{ styleOption.name }}</text>
        <text v-if="formatUpdateTime" class="closet-card__update-time">· {{ formatUpdateTime }}</text>
      </view>
      <view v-if="closet.room_name || isFamilyScope" class="closet-card__tags">
        <view v-if="closet.room_name" class="closet-card__room-tag">
          <text class="closet-card__room-tag-text">{{ closet.room_name }}</text>
        </view>
        <view v-if="isFamilyScope && creatorName" class="closet-card__creator-tag">
          <view class="closet-card__creator-avatar">{{ creatorInitial }}</view>
          <text class="closet-card__creator-tag-text">{{ creatorName }}</text>
        </view>
      </view>
    </view>

    <view class="closet-card__right">
      <text class="closet-card__count">{{ closet.clothes_count || 0 }}</text>
      <text class="closet-card__unit">件衣物</text>
    </view>
  </view>
</template>

<script>
import { CLOSET_COLOR_OPTIONS, CLOSET_STYLE_OPTIONS } from "@/common/constants/closet-options.js";
import { ROUTES } from "@/common/constants/routes.js";

export default {
  name: "ClosetListCard",
  props: {
    closet: {
      type: Object,
      required: true,
    },
  },
  computed: {
    colorOption() {
      return CLOSET_COLOR_OPTIONS.find((o) => o.code === this.closet.color_code) || CLOSET_COLOR_OPTIONS[0];
    },
    styleOption() {
      return CLOSET_STYLE_OPTIONS.find((o) => o.code === this.closet.style_code) || CLOSET_STYLE_OPTIONS[0];
    },
    isFamilyScope() {
      return this.closet.scope_type === "family";
    },
    creatorName() {
      return String(this.closet.creator_name || "").trim();
    },
    creatorInitial() {
      const name = this.creatorName;
      if (!name) return "?";
      return name.charAt(0).toUpperCase();
    },
    formatUpdateTime() {
      const ts = this.closet.updated_at || this.closet.created_at;
      if (!ts) return "";
      const date = new Date(ts);
      if (Number.isNaN(date.getTime())) return "";

      const now = Date.now();
      const diff = now - date.getTime();
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;

      if (diff < minute) return "刚刚";
      if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
      if (diff < day) return `${Math.floor(diff / hour)}小时前`;
      if (diff < day * 7) return `${Math.floor(diff / day)}天前`;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
  },
  methods: {
    goDetail() {
      uni.navigateTo({
        url: `${ROUTES.closetDetail}?id=${this.closet._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.closet-card {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 32rpx;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.closet-card-hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.closet-card__left {
  flex-shrink: 0;
  margin-right: 28rpx;
}

.closet-card__color-circle {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.closet-card__style-icon {
  position: relative;
  z-index: 1;
  width: 44rpx;
  height: 44rpx;
  color: rgba(255, 255, 255, 0.85);

  &::after {
    content: "";
    position: absolute;
    inset: -8rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.12);
    z-index: -1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.closet-card__center {
  flex: 1;
  min-width: 0;
}

.closet-card__name {
  font-family: $font-serif;
  font-size: 32rpx;
  font-weight: 700;
  color: $color-text-title;
  line-height: 1.3;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.closet-card__meta {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}

.closet-card__meta-text {
  font-size: 24rpx;
  color: $color-text-secondary;
  line-height: 1.4;
}

.closet-card__update-time {
  font-size: 24rpx;
  color: $color-text-placeholder;
  line-height: 1.4;
  margin-left: 6rpx;
}

.closet-card__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10rpx;
  margin-top: 12rpx;
  align-self: flex-start;
}

.closet-card__room-tag,
.closet-card__creator-tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.closet-card__room-tag {
  background: $color-sage-light;
}

.closet-card__room-tag-text {
  font-family: $font-mono;
  font-size: 20rpx;
  color: $color-moss;
  line-height: 1.4;
}

.closet-card__creator-tag {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(196, 92, 62, 0.08);
}

.closet-card__creator-avatar {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-terra;
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 600;
  line-height: 1;
}

.closet-card__creator-tag-text {
  font-family: $font-mono;
  font-size: 20rpx;
  color: $color-terra;
  line-height: 1.4;
}

.closet-card__right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 20rpx;
  align-self: center;
}

.closet-card__count {
  font-family: $font-sans;
  font-size: 44rpx;
  font-weight: 700;
  color: $color-primary;
  line-height: 1.1;
}

.closet-card__unit {
  font-size: 20rpx;
  color: $color-text-secondary;
  line-height: 1.2;
  margin-top: 4rpx;
}
</style>
