<template>
  <View :component="setting?.wrapper?.name??'Container'" :options="setting?.wrapper?.options">
    
    <View v-for="(item) in setting?.views??[]"
      :name="item.name"
      v-model="env[item.name]"
      :component="item.component"
      :options="item.options" 
      :children="item.children"
      @submit="handleSubmit"
      @command="handleCommand"
      :env="env"
    />

    
  </View>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'
import { RequestConfig, SubmitOptions, SubmitActionOptions, FormItemColumn } from '@/types/base'
import { storeToRefs } from 'pinia'
import { omit, pick } from 'lodash'
import { ElMessage } from 'element-plus'

const router = useRouter()

const { setting, currentChannel } = storeToRefs(useAccountStore())

// 加载中间件
definePageMeta({
  middleware: ['auto']
})

// 设置页面样式
useHead({
  style: setting?.value?.style ? [{ children: setting.value.style }] : [],
})

// 设置页面变量
const env = ref(parseParams(setting?.value?.env??{})({ channel: currentChannel.value?.label }))


watch(
  () => setting?.value,
  (value) => {
    console.log(value)
  }
)
watch(
  () => env.value,
  (value) => {
    console.log(value)
  }
)

/**
 * 指令
 * @param value 
 * @param row 
 */
function handleCommand (value: string, row?: Record<string, any>) {
  let __self = { router }
  console.log(value, row)
  return runCommand(__self, {

    dialog: (name: string) => {
      env.value = { ...env.value, [name]: true }
    },
    // submit: (name: string, options: any) => {
      
    //   // options?.next()
    // }
  })(value, row)
}

/**
 * 提交表单数据
 * @param values 
 * @param action 
 * @param options 
 */
function handleSubmit (values: Record<string, any>, action: RequestConfig, options: SubmitActionOptions) {
  console.log(values, action, options)
  if (!action?.url) {
    setTimeout(() => options?.dialog?.(false), 300)
    return
  }
  let url = parseTemplate(action?.url??'', env.value)
  let __options = pick(action, ['method', 'headers'])
  setTimeout(async () => {
    try {
      let result = await useHttpProxy(url??'', __options)
      if (result.error) {
        ElMessage.warning(result.error)
        options?.dialog?.(false)
        return
      }
      options?.dialog?.(true)
    } catch (error) {
      if (error instanceof Error) {
        ElMessage.error(error.message)
        options?.dialog?.(false)
      }
    }
  }, 500)
}


const dialogVisible = ref(false)
function handleOpen () {
  dialogVisible.value = true
}
</script>