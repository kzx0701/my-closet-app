<script setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import initUniIdPages from "./uni_modules/uni-id-pages/init.js";

onLaunch(async () => {
  try {
    await initUniIdPages();
  } catch (error) {
    console.error("uni-id-pages init failed", error);
  }
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>
view {
  box-sizing: border-box;
}
</style>
