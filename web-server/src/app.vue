<template>
  <NuxtLayout>
    <NuxtLoadingBar :duration="1000" />
    <el-config-provider :locale="locale">
      <NuxtPage />
    </el-config-provider>
  </NuxtLayout>
</template>

<script setup lang="ts">
// @ts-ignore
const locale = (await import(`element-plus/dist/locale/zh-cn.mjs`)).default
</script>