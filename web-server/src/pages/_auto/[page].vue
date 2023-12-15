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
      @get-data="handleGetData"
      :env="env"
    />
  </View>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'
import type { RequestConfig, SubmitActionOptions, PageInfo } from '@/types/base'
import { storeToRefs } from 'pinia'
import { pick, set, merge, assign } from 'lodash'
import { ElMessage, ElMessageBox, ElMessageBoxOptions } from 'element-plus'
import { useUserStore } from '~/store/user'
import type { Action, Confirm } from '@/types/account'

const route = useRoute()
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
  { 
    user: useUserStore().user,
    permissions: getRoutePlot(route.path, useUserStore().plots)
  }
))

initialData()

/**
 * 监听页面刷新
 */
watch(
  () => timestamp?.value,
  (value, oldVal) => {
    if (Date.now() - Number(value) < 100) {
      initialData()
    }
  }
)

/**
 * 初始化数据
 */
function initialData () {
  if (route.path != setting?.value?.pathname) return
  let permissions = getRoutePlot(setting?.value?.pathname!, useUserStore().plots)
  if (!isPermission(useUserStore().userLevel, permissions)('access')) return
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
      let { confirm, request, options } = <Action> getActionOptions(setting?.value?.actions)(name)
      if (confirm) {
        let result = await actionConfirm(confirm)
        if (!result) return
      }
      if (request?.url) {
        let pageInfo: PageInfo | undefined = options?.pageInfo 
          && assign(options?.pageInfo, { page: 1, sort: [] })
        let values = parseParams(request.data??{})(env.value)
        handleSubmit(values, request, merge(options, { pageInfo, row: params }))
      }
    },
    // 处理弹框
    dialog: (name: string, params: Record<string, any>) => {
      setDialogInfo(name, 'open', true)
      setDialogInfo(name, 'row', params)
    },
    // 处理选中单元
    'selectionChange': (key: string, value: Record<string, any>[]) => {
      set(env.value, ['cache', key, 'selection'], value)
    },
    // 处理远程分页请求
    'toPage': (key: string, value: PageInfo) => {
      let { request, options } = getActionByAssokey(setting?.value?.actions)(key) ?? {}
      if (request?.url) {
        let pageInfo: PageInfo = merge(pick(options?.pageInfo, ['size']), value)
        handleSubmit(env.value?.cache?.[key]?.payload, request, assign(options, { pageInfo, refresh: false }))
      }
    }
  })(value, row)
}

async function handleGetData (request: RequestConfig, options: any, next: (data: any) => void) {
  let url = parseTemplate(request?.url??'', env.value)
  if (/^(cache)/.test(url)) {
    let data = (<Record<string, any>[]>getCacheData(env.value)(url)??[])
      .map(appendDisabled(env.value, request.headers?.disabled))
    
    return next(data)
  }
  let __options = merge(pick(request, ['method', 'headers']), { data: request, interceptor: true })
  try {
    let result = await useHttpProxy(url, __options)
    if (result.data) {
      next(result.data)
    }
  } catch (error) {
    
  }
}

/**
 * 请求 Http 数据
 * @param values 
 * @param action 
 * @param options 
 */
function handleSubmit (values: Record<string, any>, action: RequestConfig, options: SubmitActionOptions) {
  setCacheLoading(options.assokey, true)
  if (!action?.url) {
    setTimeout(() => options?.dialog?.(true), 300)
    return
  }
  let url = parseTemplate(action?.url??'', merge(env.value, { row: options.row }))
  let __options = merge(pick(action, ['method', 'headers']), { data: assign(options.pageInfo, values), interceptor: true })
  setTimeout(async () => {
    try {
      let result = await useHttpProxy(url??'', __options)
      if (result.error) {
        ElMessage.warning(result.error)
        options?.dialog?.(false)
        return
      }
      setCacheData(env.value, {
        request: action,
        options: pick(options, ['assokey', 'assignment', 'pageInfo', 'refresh'])
      })(values, result)
      runCommands(options.afterCommand)
      options?.next?.(null)
      options?.dialog?.(true)
    } catch (error) {
      if (error instanceof Error) {
        // ElMessage.error(error.message)
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
 * 运行指令集
 * @param commands 
 */
async function runCommands (commands?: string[]) {
  for (let command of commands??[]) {
    await handleCommand(command)
  }
}

/**
 * 确认操作
 * @param config 
 */
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