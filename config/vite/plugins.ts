import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
export const vitePlugins = [
  vue(),
  Unocss(),
  // 自动导入
  AutoImport({
    imports: ['vue'],
    // 自动导入elp的api 如ElMessage
    resolvers: [ElementPlusResolver()],
    // 自动生成的ts声明文件
    dts: './types/auto-imports.d.ts',
  }),
  // 默认的，该插件会导入src/components下的组件,可以通过配置项 dirs 去更改
  Components({
    // 自动导入elp组件
    resolvers: [ElementPlusResolver()],
    dts: './types/components.d.ts',
    // 注册全局组件类型 默认的该组件会自动检测工作区内支持的库，然后自动添加它 例如Vue-Router,所以下方代码会自动被添加
    types: [
      {
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      },
    ],
  }),
  // 这个是为了更方便的使用svg
  // 虽然Icons和createSvgIconsPlugin 插件都支持加载自定义svg 但是createSvgIconsPlugin适合动态加载自定义svg Icons 适合静态加载
  // 传统的使用方式是将svg代码粘贴到要显示的位置 为了在vue模板中不显示这些代码 所以使用了该插件
  // 使用方式为 <svg-icon name="top_menu"></svg-icon> 其中的name 为 assets/icons/ 下svg的名字
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [resolve(process.cwd(), 'src/assets/icons/')],
    // 指定symbolId格式
    symbolId: 'svg-[dir]-[name]',
  }),
]
