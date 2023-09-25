<template>
  <View :component="wrapper?.name??'Container'" :options="wrapper?.options">
    test 
  </View>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'

const { setting } = useAccountStore()
const { wrapper } = setting ?? {}

// 加载中间件
definePageMeta({
  middleware: ['auto']
})

// 设置页面样式
useHead({
  style: setting?.style ? [{ children: setting.style }] : [],
})

// 设置页面变量
const env = reactive(setting?.env??{})

</script>