import { defineConfig } from "vite";
import { loadEnv } from "vite";
import { resolve } from "path";
import { vitePlugins } from "./config/vite/index";
// https://vitejs.dev/config/
export default defineConfig((config) => {
  const root = process.cwd();
  // FIXME 缺少TS类型支持
  const env = loadEnv(config.mode, root);
  return {
    plugins: vitePlugins,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist/" + env.VITE_WEB_TITLE,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将node_modules的扩展单独进行打包
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
    },
    esbuild: {
      // 移除打包环境的console 和 debugger
      drop: config.mode === "development" ? [] : ["debugger", "console"],
      logOverride: {
        // 忽略未使用变量警告
        "assign-to-constant": "silent",
        // 忽略return空警告
        "semicolon-after-return": "silent",
      },
    },
  };
});
