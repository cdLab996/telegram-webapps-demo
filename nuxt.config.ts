import process from 'node:process'
import pkg from './package.json'

const proxyPaths = ['/api', '/tgapi', '/user']

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width',
        },
      ],
      noscript: [{ children: 'Javascript is required.' }],
      script: [
        // { src: 'https://telegram.org/js/telegram-web-app.js' },
        { src: '/telegram-web-app.js' },
      ],
      title: '',
    },
    keepalive: true,
    pageTransition: { name: 'page-slide', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      DATE: `${new Date().toLocaleString()}.${new Date().getMilliseconds()}`,
      VERSION: pkg.version,
    },
  },
  devtools: { enabled: false },
  css: ['@/styles/scss/index.scss', '@/styles/scss/public/index.scss'],
  devServer: {
    host: process.env.SERVER_HOST,
    port: Number(process.env.SERVER_PORT) || undefined,
  },
  experimental: {
    headNext: true,
    payloadExtraction: false,
  },
  imports: {
    dirs: ['./composables/*', './composables/**/*'],
  },
  modules: ['@vueuse/nuxt', '@nuxtjs/i18n', '@unocss/nuxt', 'nuxt-purgecss', 'nuxt-svgo'],
  nitro: {
    compressPublicAssets: true,
    devProxy: Object.fromEntries(
      proxyPaths.map((path) => [
        path,
        {
          changeOrigin: true,
          target: `${process.env.VITE_APP_API_URL}/${path}`,
        },
      ])
    ),
  },
  purgecss: {
    enabled: true,
    safelist: {
      deep: [
        /** Scss */
        // Background color
        /bg-(banker|player|tie)/,

        // Chip
        /chip-\d+/,

        // Color
        /color-(banker|player|tie)/,

        // Public
        /--unocss--/,
        /-\[\S+\]/,
        /__uno_hash_(\w{6})/,
        /swal2/,
      ],
      standard: [
        /-(appear|enter|leave)(|-(active|from|to))$/,
        /.*data-v-.*/,
        /:deep/,
        /:global/,
        /:slotted/,
        /^(?!cursor-move).+-move$/,
        /^nuxt-link(|-exact)-active$/,
        '__nuxt',
        'body',
        'html',
        'nuxt-progress',
      ],
    },
  },
  // ssr: false,
  // typescript: {
  //   tsConfig: {
  //     compilerOptions: {
  //       noImplicitOverride: true,
  //       noUncheckedIndexedAccess: true,
  //       noUnusedLocals: true,
  //       noUnusedParameters: true,
  //     },
  //   },
  //   typeCheck: true,
  // },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/scss/global-import.scss";',
        },
      },
    },
  },
})
