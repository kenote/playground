// import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  srcDir: './src',

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/color-mode'
  ],

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
  }
})
