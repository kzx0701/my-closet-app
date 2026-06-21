<template>
  <view class="basic-form">
    <!-- 名称 -->
    <view class="section">
      <text class="section-title">名称</text>
      <input
        class="form-input"
        :class="{ 'form-input-focus': nameFocused }"
        type="text"
        :value="name"
        maxlength="50"
        :adjust-position="true"
        :cursor-spacing="80"
        placeholder="例如：米色亚麻衬衫"
        placeholder-class="form-input-placeholder"
        @focus="nameFocused = true"
        @blur="nameFocused = false"
        @input="emit('update:name', $event.detail.value)"
      />
    </view>

    <!-- 分类 -->
    <view class="section">
      <text class="section-title">分类</text>
      <view class="chip-row">
        <view
          v-for="item in categoryOptions"
          :key="item.code"
          class="chip"
          :class="{ active: category === item.code }"
          @click="emit('update:category', item.code)"
        >
          <text class="chip-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 颜色 -->
    <view class="section">
      <view class="section-title">
        <text>Color · 颜色</text>
        <text class="hint">选填</text>
      </view>
      <scroll-view scroll-x class="color-scroll" :show-scrollbar="false">
        <view class="color-chip-row">
          <view
            v-for="item in colorOptions"
            :key="item.code"
            class="color-chip"
            :class="{ active: color === item.code }"
            @click="emit('update:color', item.code)"
          >
            <view
              class="color-dot"
              :class="{ 'color-dot-multicolor': item.code === 'multicolor' }"
              :style="getDotStyle(item)"
            ></view>
            <text class="color-label">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 适合季节（多选） -->
    <view class="section">
      <view class="section-title">
        <text>适合季节</text>
        <text class="hint">可多选</text>
      </view>
      <view class="chip-row">
        <view
          v-for="item in seasonOptions"
          :key="item.code"
          class="chip"
          :class="{ active: selectedSeasons.includes(item.code) }"
          @click="toggleSeason(item.code)"
        >
          <text class="chip-text">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  season: {
    type: String,
    default: "",
  },
  categoryOptions: {
    type: Array,
    default() {
      return [];
    },
  },
  colorOptions: {
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

const emit = defineEmits(["update:name", "update:category", "update:color", "update:season"]);

const nameFocused = ref(false);

// 处理颜色圆点样式：纯色用 background，花色用渐变
function getDotStyle(item) {
  if (!item) return {};
  const hex = item.hex || "";
  if (hex.startsWith("linear-gradient")) {
    return { background: hex };
  }
  return { background: hex };
}

const selectedSeasons = computed(() => {
  return String(props.season || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

function toggleSeason(code) {
  const current = [...selectedSeasons.value];
  const index = current.indexOf(code);

  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(code);
  }

  emit("update:season", current.join(","));
}
</script>

<style lang="scss" scoped>
.basic-form {
  margin-top: 48rpx;
}

.section {
  margin-top: 48rpx;
}

.basic-form .section:first-child {
  margin-top: 0;
}

.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-family: $font-mono;
  font-size: 20rpx;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: $color-text-placeholder;
}

.hint {
  font-family: $font-sans;
  font-size: 22rpx;
  letter-spacing: 0;
  text-transform: none;
  color: $color-text-placeholder;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: $radius-btn;
  background: rgba(58, 84, 67, 0.04);
  border: 1px solid $color-border-soft;
  font-family: $font-sans;
  font-size: 28rpx;
  color: $color-text-title;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-input-focus {
  border-color: $color-primary;
}

.form-input-placeholder {
  color: $color-text-placeholder;
  font-size: 26rpx;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip {
  padding: 14rpx 28rpx;
  border-radius: $radius-btn;
  background: $color-bg-chip;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.chip.active {
  background: $color-primary;
  border-color: $color-primary;
}

.chip-text {
  font-family: $font-sans;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.chip.active .chip-text {
  color: $color-text-inverse;
  font-weight: 600;
}

/* 颜色选择器 */
.color-scroll {
  width: 100%;
  white-space: nowrap;
}

.color-chip-row {
  display: inline-flex;
  align-items: center;
  gap: 24rpx;
  padding: 4rpx 0;
}

.color-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 8rpx;
  border-radius: $radius-btn;
  border: 2rpx solid transparent;
  transition: all 0.25s ease;
}

.color-chip.active {
  border-color: $color-primary;
  background: rgba(58, 84, 67, 0.06);
}

.color-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* 花色：使用渐变背景 */
.color-dot-multicolor {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.color-label {
  font-family: $font-sans;
  font-size: 22rpx;
  color: $color-text-secondary;
}

.color-chip.active .color-label {
  color: $color-text-title;
  font-weight: 600;
}
</style>
