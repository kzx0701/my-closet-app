"use strict";
const common_vendor = require("../vendor.js");
function safeNavigateTo(url, options = {}) {
  const pages = getCurrentPages();
  const stackLength = pages.length;
  if (stackLength >= 9) {
    common_vendor.index.redirectTo({
      url,
      success: options.success,
      fail: () => {
        common_vendor.index.reLaunch({ url });
      }
    });
  } else {
    common_vendor.index.navigateTo({
      url,
      success: options.success,
      fail: () => {
        common_vendor.index.redirectTo({
          url,
          fail: () => {
            common_vendor.index.reLaunch({ url });
          }
        });
      }
    });
  }
}
function safeNavigateBack(fallbackUrl = "/pages/home/index") {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    common_vendor.index.navigateBack({
      fail: () => {
        common_vendor.index.reLaunch({ url: fallbackUrl });
      }
    });
  } else {
    common_vendor.index.reLaunch({ url: fallbackUrl });
  }
}
exports.safeNavigateBack = safeNavigateBack;
exports.safeNavigateTo = safeNavigateTo;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/utils/nav-helper.js.map
