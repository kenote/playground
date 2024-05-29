<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#DBE1EC" viewBox="0 0 48 48">
        <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
      </svg>
    </div>

    <div class="title">{{ error.message }}</div>
    <p v-if="error.statusCode === 404" class="description">
      <NuxtLink v-if="isLastPage()" class="error-link" :to="lastpage">Back to the last page</NuxtLink>
      <NuxtLink v-else class="error-link" to="/">Back to the home page</NuxtLink>
    </p>
    <p v-else-if="error.statusCode === 403" class="description">
      This page is forbidden and you may not have access
    </p>
    <p class="description" v-else>
      An error occurred while rendering the page. Check developer tools console for details.
    </p>
    <div class="logo">
      <a href="https://github.com/kenote/playground" target="_blank" rel="noopener">Kenote.js</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const error = useError()
const state = useRouter().options.history.state
const lastpage = state.forward ?? state.back

const isLastPage = () => {
  if (!lastpage || lastpage == '/') {
    return false
  }
  if (lastpage == state.current) {
    return false
  }
  return true
}
</script>

<style>
.__nuxt-error-page {
  padding: 1rem;
  background: #F7F8FB;
  color: #47494E;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.__nuxt-error-page .error {
  max-width: 450px;
}
.__nuxt-error-page .title {
  font-size: 1.5rem;
  margin-top: 15px;
  color: #47494E;
  margin-bottom: 8px;
}
.__nuxt-error-page .description {
  color: #7F828B;
  line-height: 21px;
  margin-bottom: 10px;
}
.__nuxt-error-page a {
  color: #7F828B !important;
  text-decoration: none;
}
.__nuxt-error-page .logo {
  position: fixed;
  left: 12px;
  bottom: 12px;
}
</style>