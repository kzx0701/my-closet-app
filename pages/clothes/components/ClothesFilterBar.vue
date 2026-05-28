<template>
  <view class="filter-card">
    <view class="filter-head">
      <text class="filter-title">筛选</text>
      <button class="reset-btn" @click="$emit('reset')">清空</button>
    </view>

    <view class="filter-group">
      <text class="group-label">衣橱</text>
      <scroll-view class="chip-scroll" scroll-x>
        <view class="chip-row">
          <button
            class="chip"
            :class="{ 'chip-active': filters.closetId === '' }"
            @click="updateFilter('closetId', '')"
          >
            全部
          </button>
          <button
            v-for="item in closetOptions"
            :key="item._id"
            class="chip"
            :class="{ 'chip-active': filters.closetId === item._id }"
            @click="updateFilter('closetId', item._id)"
          >
            {{ item.name }}
          </button>
        </view>
      </scroll-view>
    </view>

    <view class="filter-group">
      <text class="group-label">分类</text>
      <view class="chip-row chip-wrap">
        <button
          class="chip"
          :class="{ 'chip-active': filters.category === '' }"
          @click="updateFilter('category', '')"
        >
          全部
        </button>
        <button
          v-for="item in categoryOptions"
          :key="item.code"
          class="chip"
          :class="{ 'chip-active': filters.category === item.code }"
          @click="updateFilter('category', item.code)"
        >
          {{ item.name }}
        </button>
      </view>
    </view>

    <view class="filter-group">
      <text class="group-label">季节</text>
      <view class="chip-row chip-wrap">
        <button
          class="chip"
          :class="{ 'chip-active': filters.season === '' }"
          @click="updateFilter('season', '')"
        >
          全部
        </button>
        <button
          v-for="item in seasonOptions"
          :key="item.code"
          class="chip"
          :class="{ 'chip-active': filters.season === item.code }"
          @click="updateFilter('season', item.code)"
        >
          {{ item.name }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Object,
    default() {
      return {
        closetId: "",
        category: "",
        season: "",
      };
    },
  },
  closetOptions: {
    type: Array,
    default() {
      return [];
    },
  },
  categoryOptions: {
    type: Array,
    default() {
      return [];
    },
  },
  seasonOptions: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(["update:filters", "reset"]);

function updateFilter(key, value) {
  emit("update:filters", {
    ...props.filters,
    [key]: value,
  });
}
</script>

<style>
.filter-card {
  margin-bottom: 24rpx;
  padding: 26rpx 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  box-shadow: 0 14rpx 30rpx rgba(73, 81, 69, 0.06);
  border: 2rpx solid rgba(107, 126, 99, 0.08);
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #314033;
}

.reset-btn {
  height: 58rpx;
  line-height: 58rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #6c786b;
  background: #eef2eb;
  border: none;
}

.filter-group + .filter-group {
  margin-top: 20rpx;
}

.group-label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 23rpx;
  color: #6f7c6d;
}

.chip-scroll {
  white-space: nowrap;
}

.chip-row {
  display: flex;
  gap: 14rpx;
}

.chip-wrap {
  flex-wrap: wrap;
}

.chip {
  min-width: 108rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #5d6a5a;
  background: #eef2eb;
  border: none;
}

.chip-active {
  color: #243026;
  font-weight: 700;
  background: #dfe8d8;
}
</style>
