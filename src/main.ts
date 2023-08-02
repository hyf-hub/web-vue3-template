import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";
import "uno.css";
import "element-plus/dist/index.css";
import "virtual:svg-icons-register";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
// 全局管理
const pinia = createPinia();
// 数据持久化插件
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
// 路由
app.use(router);

app.mount("#app");
