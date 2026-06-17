<template>
  <view class="filter-card">
    <view class="filter-head">
      <text class="filter-title">筛选</text>
      <u-button
        size="mini"
        shape="circle"
        customStyle="background: #eef2eb; border: none; color: #6c786b;"
        @click="$emit('reset')"
      >
        清空
      </u-button>
    </view>

    <view class="filter-group">
      <text class="group-label">衣橱</text>
      <scroll-view class="chip-scroll" scroll-x>
        <view class="chip-row">
          <u-tag
            text="全部"
            :type="filters.closetId === '' ? 'primary' : 'info'"
            :plain="filters.closetId !== ''"
            shape="circle"
            size="mini"
            :customStyle="filters.closetId === '' ? 'background: #314033; border-color: #314033;' : ''"
            @click="updateFilter('closetId', '')"
          />
          <u-tag
            v-for="item in closetOptions"
            :key="item._id"
            :text="item.name"
            :type="filters.closetId === item._id ? 'primary' : 'info'"
            :plain="filters.closetId !== item._id"
            shape="circle"
            size="mini"
            :customStyle="filters.closetId === item._id ? 'background: #314033; border-color: #314033;' : ''"
            @click="updateFilter('closetId', item._id)"
          />
        </view>
      </scroll-view>
    </view>

    <view class="filter-group">
      <text class="group-label">分类</text>
      <view class="chip-row chip-wrap">
        <u-tag
          text="全部"
          :type="filters.category === '' ? 'primary' : 'info'"
          :plain="filters.category !== ''"
          shape="circle"
          size="mini"
          :customStyle="filters.category === '' ? 'background: #314033; border-color: #314033;' : ''"
          @click="updateFilter('category', '')"
        />
        <u-tag
          v-for="item in categoryOptions"
          :key="item.code"
          :text="item.name"
          :type="filters.category === item.code ? 'primary' : 'info'"
          :plain="filters.category !== item.code"
          shape="circle"
          size="mini"
          :customStyle="filters.category === item.code ? 'background: #314033; border-color: #314033;' : ''"
          @click="updateFilter('category', item.code)"
        />
      </view>
    </view>

    <view class="filter-group">
      <text class="group-label">季节</text>
      <view class="chip-row chip-wrap">
        <u-tag
          text="全部"
          :type="filters.season === '' ? 'primary' : 'info'"
          :plain="filters.season !== ''"
          shape="circle"
          size="mini"
          :customStyle="filters.season === '' ? 'background: #314033; border-color: #314033;' : ''"
          @click="updateFilter('season', '')"
        />
        <u-tag
          v-for="item in seasonOptions"
          :key="item.code"
          :text="item.name"
          :type="filters.season === item.code ? 'primary' : 'info'"
          :plain="filters.season !== item.code"
          shape="circle"
          size="mini"
          :customStyle="filters.season === item.code ? 'background: #314033; border-color: #314033;' : ''"
          @click="updateFilter('season', item.code)"
        />
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
</style>
