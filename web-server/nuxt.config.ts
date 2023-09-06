// import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  srcDir: './src',

  css: [
    '~/assets/less/common.less'
  ],

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/color-mode'
  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
    
  },

  vueuse: {
    ssrHandlers: true
  },

  colorMode: {
    classPrefix: ''
  },

  unocss: {
    uno: true,
    attributify: true,
    icons: {
      scale: 1.2
    }
  },

  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'css',
    themes: [ 'dark' ]
  },

  // alias: {
  //   '~': resolve(__dirname)
  // },

  vite: {
    resolve: {
      alias: [
        { find: '@', replacement: __dirname },
        { find: '~', replacement: resolve(__dirname, 'src') }
      ]
    }
  },

  hooks: {
    'pages:extend': pages => {
      pages.push({
        name: 'cmsPage',
        path: '/:catchAll(.*)',
        file: resolve(__dirname, 'src/pages/_auto/[page].vue')
      })
    }
  }
})
