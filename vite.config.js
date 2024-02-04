import {VantResolver} from '@vant/auto-import-resolver'
import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import pxtovw from 'postcss-px-to-viewport'
import path from 'path'

const my_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改
  unitToConvert: "px", // 要转化的单位
  viewportWidth: 375, // UI设计稿的宽度
  unitPrecision: 6, // 转换后的精度，即小数点位数
  propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
  viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
  fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
  selectorBlackList: [], // 指定不转换为视窗单位的类名，
  minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
  mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
  replace: true, // 是否转换后直接更换属性值
  exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
  landscape: false // 是否处理横屏情况
})

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [my_pxtovw]
    },
    preprocessorOptions: {
      less: {
        // 全局变量文件
        additionalData: '@import "./src/assets/css/global.less";',
      },
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      // 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
      // dts: 'src/auto-imports.d.ts',
      imports: ['vue', 'vue-router']
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8088,
    proxy: {
      '/api': {
        // target: 'https://mapp.hbsk.com',
        target: 'https://tmapp.hbsk.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  },
})
