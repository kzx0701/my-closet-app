"use strict";
const CLOTHES_CATEGORY_OPTIONS = [
  { code: "top", name: "上装" },
  { code: "bottom", name: "下装" },
  { code: "outerwear", name: "外套" },
  { code: "shoes", name: "鞋子" },
  { code: "accessory", name: "配饰" }
];
const CLOTHES_SEASON_OPTIONS = [
  { code: "spring", name: "春" },
  { code: "summer", name: "夏" },
  { code: "autumn", name: "秋" },
  { code: "winter", name: "冬" }
];
const SEASON_COLOR_MAP = {
  spring: "#a8bcae",
  summer: "#7a9580",
  autumn: "#b85c3a",
  winter: "#8b6f47"
};
const CLOTHES_COLOR_OPTIONS = [
  { code: "black", label: "黑色", hex: "#1a1a1a" },
  { code: "white", label: "白色", hex: "#f5f5f0" },
  { code: "gray", label: "灰色", hex: "#8a8a8a" },
  { code: "beige", label: "米色", hex: "#d4c5a9" },
  { code: "brown", label: "棕色", hex: "#6b4423" },
  { code: "navy", label: "藏蓝", hex: "#1e3a5f" },
  { code: "blue", label: "蓝色", hex: "#4a7c8c" },
  { code: "green", label: "绿色", hex: "#5a7a4a" },
  { code: "red", label: "红色", hex: "#b85c3a" },
  { code: "pink", label: "粉色", hex: "#d4a0a0" },
  { code: "yellow", label: "黄色", hex: "#d4b850" },
  { code: "purple", label: "紫色", hex: "#7a5a7a" },
  { code: "multicolor", label: "花色", hex: "linear-gradient(135deg, #b85c3a, #d4b850, #5a7a4a, #4a7c8c)" },
  { code: "other", label: "其他", hex: "#cccccc" }
];
exports.CLOTHES_CATEGORY_OPTIONS = CLOTHES_CATEGORY_OPTIONS;
exports.CLOTHES_COLOR_OPTIONS = CLOTHES_COLOR_OPTIONS;
exports.CLOTHES_SEASON_OPTIONS = CLOTHES_SEASON_OPTIONS;
exports.SEASON_COLOR_MAP = SEASON_COLOR_MAP;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/constants/clothes-options.js.map
