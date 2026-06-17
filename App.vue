<template>
  <view>
    <slot />
    <u-toast ref="uToastRef" />
    <u-modal ref="uModalRef" />
  </view>
</template>

<script setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import initUniIdPages from "./uni_modules/uni-id-pages/init.js";

const uToastRef = ref(null);
const uModalRef = ref(null);

onLaunch(async () => {
  try {
    await initUniIdPages();
  } catch (error) {
    console.error("uni-id-pages init failed", error);
  }
});

onShow(() => {});

onHide(() => {});

// 挂载全局方法供页面使用
uni.$u.toast = (options) => {
  uToastRef.value?.show(options);
};

uni.$u.modal = (options) => {
  return uModalRef.value?.show(options);
};
</script>

<style>
/* #ifdef H5 */
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400;1,9..144,500&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
/* #endif */

view {
  box-sizing: border-box;
}
</style>
