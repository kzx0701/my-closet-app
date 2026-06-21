/**
 * 安全导航工具，防止页面栈溢出（微信小程序最大10层）
 */

/**
 * 安全跳转，当页面栈接近上限时使用 redirectTo 替代 navigateTo
 * @param {string} url - 跳转地址
 * @param {object} options - 选项
 */
export function safeNavigateTo(url, options = {}) {
  const pages = getCurrentPages();
  const stackLength = pages.length;

  // 微信小程序页面栈最大10层，保留1层余量
  if (stackLength >= 9) {
    // 接近上限，使用 redirectTo 替换当前页
    uni.redirectTo({
      url,
      success: options.success,
      fail: () => {
        // redirectTo 也失败，最后手段
        uni.reLaunch({ url });
      },
    });
  } else {
    uni.navigateTo({
      url,
      success: options.success,
      fail: () => {
        // navigateTo 失败（可能页面栈满了），尝试 redirectTo
        uni.redirectTo({
          url,
          fail: () => {
            uni.reLaunch({ url });
          },
        });
      },
    });
  }
}

/**
 * 安全返回，当页面栈只有1层时使用 reLaunch
 * @param {string} fallbackUrl - 页面栈为空时的回退地址
 */
export function safeNavigateBack(fallbackUrl = '/pages/home/index') {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({
      fail: () => {
        uni.reLaunch({ url: fallbackUrl });
      },
    });
  } else {
    uni.reLaunch({ url: fallbackUrl });
  }
}
