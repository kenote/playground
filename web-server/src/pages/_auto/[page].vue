<template>
  <client-only>
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
  </client-only>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'
import { RequestConfig, SubmitOptions, SubmitActionOptions, FormItemColumn } from '@/types/base'
import { storeToRefs } from 'pinia'
import { omit, pick, set, get, merge } from 'lodash'
import { ElMessage, ElMessageBox, ElMessageBoxOptions } from 'element-plus'
import { useUserStore } from '~/store/user'
import { Confirm } from '@/types/account'
// import { ElMessage, ElMessageBox } from 'element-plus'

// ReferenceError: document is not defined
if (process.browser) {
  require('external_library')
}
// const document = {}
const router = useRouter()

const { setting, currentChannel, timestamp } = storeToRefs(useAccountStore())

// 加载中间件
definePageMeta({
  middleware: ['auto']
})

// 设置页面样式
useHead({
  style: setting?.value?.style ? [{ children: setting.value.style }] : [],
})

// 设置页面变量
const env = ref(merge(
  parseParams(setting?.value?.env)({ channel: currentChannel.value?.label }), 
  { user: useUserStore().user }
))

initialData()

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
watch(
  () => timestamp?.value,
  (value) => {
    initialData()
  }
)

/**
 * 初始化数据
 */
function initialData () {
  // for (let command of setting?.value?.initial??[]) {
  //   handleCommand(command)
  // }
  runCommands(setting?.value?.initial)
}

/**
 * 指令
 * @param value 
 * @param row 
 */
function handleCommand (value: string, row?: Record<string, any>) {
  let __self = { router }
  
  return runCommand(__self, {
    // 处理 Action 请求
    action: async (name: string, params: Record<string, any>) => {
      // console.log(name, getActionOptions(name), params)
      let { request, options, confirm } = getActionOptions(name) ?? {}
      if (confirm) {
        let result = await actionConfirm(confirm)
        if (!result) return
      }
      if (request?.url) {
        handleSubmit({}, request, merge(options, { row: params }))
      }
    },
    dialog: (name: string, params: Record<string, any>) => {
      console.log(name, params)
      // env.value = { ...env.value, [name]: true }
      setDialogInfo(name, 'open', true)
      setDialogInfo(name, 'row', params)
    },
    // submit: (name: string, options: any) => {
      
    //   // options?.next()
    // }
    'selectionChange': (key: string, value: Record<string, any>[]) => {
      console.log('selectionChange', key, value)
    }
  })(value, row)
}

/**
 * 请求 Http 数据
 * @param values 
 * @param action 
 * @param options 
 */
function handleSubmit (values: Record<string, any>, action: RequestConfig, options: SubmitActionOptions) {
  // console.log(values)
  setCacheLoading(options.assokey, true)
  if (!action?.url) {
    setTimeout(() => options?.dialog?.(true), 300)
    return
  }
  let url = parseTemplate(action?.url??'', merge(env.value, { row: options.row }))
  // console.log(merge(env.value, { row: options.row }))
  let __options = merge(pick(action, ['method', 'headers']), { data: values, interceptor: true })
  setTimeout(async () => {
    try {
      let result = await useHttpProxy(url??'', __options)
      if (result.error) {
        ElMessage.warning(result.error)
        options?.dialog?.(false)
        return
      }
      setCacheData(result, options)
      runCommands(options.afterCommand)
      options?.next?.(null)
      options?.dialog?.(true)
    } catch (error) {
      if (error instanceof Error) {
        ElMessage.error(error.message)
        options?.next?.(null)
        options?.dialog?.(false)
      }
    }
    setCacheLoading(options.assokey, false)
  }, 500)
}

/**
 * 写入 Cache loading 状态
 * @param assokey 
 * @param value 
 */
function setCacheLoading (assokey: string | undefined, value: boolean) {
  if (!assokey) return
  set(env.value, ['cache', assokey, 'loading'], value)
  useAccountStore().setLoading(value)
}

/**
 * 写入 Cache Data
 * @param value 
 * @param options
 */
function setCacheData (value: any, options: SubmitActionOptions) {
  let { assokey, assignment } = options
  if (!assokey || !assignment) return
  // timestamp
  set(env.value, ['cache', assokey, 'timestamp'], Date.now())
  for (let [key, name] of Object.entries(assignment)) {
    set(env.value, ['cache', assokey, key], get(value, name))
  }
}

/**
 * 写入弹框信息
 * @param name 
 * @param key 
 * @param value 
 */
function setDialogInfo (name: string, key: string, value: any) {
  if (key == 'open') {
    set(env.value, [`dialog:${name}`], value)
  }
  else {
    set(env.value, ['dialog', name, key], value)
  }
}

/**
 * 获取相关 Action 选项
 * @param name 
 */
function getActionOptions (name: string) {
  return setting?.value?.actions?.[name]
}

/**
 * 运行指令集
 * @param commands 
 */
function runCommands (commands?: string[]) {
  for (let command of commands??[]) {
    handleCommand(command)
  }
}


async function actionConfirm (config: Confirm) {

  let options: ElMessageBoxOptions = {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }
  try {
    return await ElMessageBox.confirm(config.message, '提示', options)
  } catch (error) {
    ElMessage.info(config.cancel??`您已取消操作`)
    return null
  }
}
</script>