import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetUno } from "unocss";
export default defineConfig({
  // 使unocss支持 css指令 如apply
  transformers: [transformerDirectives()],
  // 配置默认预设 其中包含了 tailwindcss 和 windicss
  // https://tailwindcss.com/
  // https://windicss.org/guide/
  presets: [presetUno()],
});
