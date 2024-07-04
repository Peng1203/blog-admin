import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import viteCompression from 'vite-plugin-compression'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd())
  return {
    // vueSetupExtend(),
    plugins: [
      vue(),
      DefineOptions(),
      viteCompression(),
      UnoCSS({ presets: [] }),
      vueJsx(),
    ],
    root: process.cwd(),
    resolve: {
      alias: {
        '@': resolve(__dirname, '.', 'src'),
        // '@': './src',
      },
    },
    base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
    // base: '/PengBlogAdmin/',
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as unknown as number,
      open: JSON.parse(env.VITE_OPEN),
      hmr: true,
      // proxy: {
      //   '/api': {
      //     target: env.VITE_SERVER_GATEWAY as string,
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          compact: true,
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            echarts: ['echarts'],
          },
        },
      },
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
    },
  }
})

export default viteConfig
