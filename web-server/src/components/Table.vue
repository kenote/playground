<template>
  <Container layout="horizontal" justify-content="space-between">
    <Container layout="horizontal">
      <form-expand :data="expands" :env="env" @command="handleCommand" />
    </Container>
    <form-item v-if="filter" 
      v-model="keywords" 
      type="text" 
      :width="180" 
      :placeholder="filter?.placeholder??'输入名称检索...'" 
      :options="{ clearable: true }"
    />
  </Container>
  <div v-loading="loading">
    <el-table ref="tableRef" :data="pdata?.filter(filterData)"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      >
      <!-- 多选列 -->
      <el-table-column v-if="getSelection(selection)?.open"
        type="selection"
        fixed="left"
        width="50"
        :selectable="selectable"
      />
      <!-- 常规列 -->
      <el-table-column v-for="(item) in columns??[]"
        :prop="item.key"
        :label="item.label"
        :width="toPixelSize(item.width)"
        :min-width="toPixelSize(item.minWidth)"
        :fixed="item.fixed"
        :align="item.align"
        :sortable="item.sortable"
        show-overflow-tooltip >
        <template #default="scope">
          <table-column-cell :scope="scope" :column="item" :env="env" @command="handleCommand"></table-column-cell>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-if="getPropValue('pagination')" class="mt-4" background 
      layout="->, total, prev, pager, next, jumper" 
      :total="total" 
      :current-page="env?.cache?.[props.assokey!]?.pageInfo?.page??current"
      :page-size="getPropValue('pagination')"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { Selection, TableColumn, PageInfo } from '@/types/base'
import { chunk, trim } from 'lodash'
import type { Sort, TableInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '~/store/account'

const { timestamp } = storeToRefs(useAccountStore())

type Props = {
  assokey      ?: string
  modelValue   ?: any
  loading      ?: boolean
  data         ?: Record<string, any>[]
  columns      ?: TableColumn[]
  selection    ?: Selection | boolean
  env          ?: Record<string, any>
  pagination   ?: number | false  // 分页大小
  counts       ?: number   // 数据总数
  pageno       ?: number   // 页码
  sorter       ?: any  // 远程排序配置
  queryer      ?: Record<string, any>
  filter       ?: {
    placeholder  ?: string
    fielid       ?: string[]
    method   ?: any
  }
  expands      ?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  pageno: 1,
  counts: -1,
})

const tableRef = ref<TableInstance>()
const pdata = ref(props.data??[])
const total = ref(0)
const current = ref(1)

const env = ref(props.env)
const loading = ref(false)
const keywords = ref('')

onMounted(() => {
  loading.value = env.value?.cache?.[props.assokey!]?.loading
})

/**
 * 监听页面刷新
 */
watch(
  () => [timestamp?.value, env.value?.cache?.[props.assokey!]?.refresh],
  (value, oldVal) => {
    let [ timestamp, refresh ] = value
    if (Date.now() - Number(timestamp) < 100 || refresh) {
      tableRef.value?.clearSort()
    }
  }
)

/**
 * 监听绑定的 assokey 是否加载状态
 */
watch(
  () => env.value?.cache?.[props.assokey!]?.loading,
  (value, oldVal) => {
    loading.value = value
    if (value) {
      keywords.value = ''
    }
  }
)

/**
 * 监听数据变化
 */
watch(
  () => env.value?.cache?.[props.assokey!]?.data,
  (value, oldVal) => {
    initialData(value)
  }
)

initialData(props.data)

const emit = defineEmits(['get-data', 'submit', 'command', 'change'])

watch(
  () => props.data,
  (value, oldVal) => {
    initialData(value)
  }
)

const handleCommand = (value: string, params?: Record<string, any>) => {
  emit('command', value, params)
}

function initialData (value?: Record<string, any>[]) {
  let pagination = getPropValue('pagination')
  if (pagination) {
    total.value = getPropValue('counts') == -1 ? (value?.length ?? 0) : getPropValue('counts')
    let __data = getPropValue('data')
    if ((__data?.length??0) < total.value) {
      handleCurrentChange(env.value?.cache?.[props.assokey!]?.pageInfo?.page)
      return
    }
    let pagesize = pagination
    let pageno = parseInt(String((total.value + pagesize - 1) / pagesize)) || 1
    handleCurrentChange(props.pageno > pageno ? pageno : props.pageno)
  }
  else {
    pdata.value = value ?? []
    total.value = pdata.value?.length ?? 0
    current.value = 1
  }
}

function handleCurrentChange(page: number) {
  let pagination = getPropValue('pagination')
  let __data = getPropValue('data')
  // 远端分页
  if ((__data?.length??0) < total.value) {
    pdata.value = __data??[]
    if (getCurrentPage() !== page) {
      emit('command', `command:toPage|${props.assokey}`, { page })
    }
  }
  // 本地分页
  else if (pagination) {
    current.value = page
    pdata.value = chunk(<any[]>__data, pagination)?.[page-1]
  }
}

function handleSortChange (column: Sort) {
  let { order, prop,  } = column
  // 远端排序
  let __data = getPropValue('data')
  if ((__data?.length??0) < total.value) {
    let pageInfo: PageInfo = {
      page: getCurrentPage(),
      sort: [ prop, order ]
    }
    emit('command', `command:toPage|${props.assokey}`, pageInfo)
  }
}

const filterData = (value: Record<string, any>) => {
  let __keywords = trim(keywords.value)
  if (!__keywords) return true
  let regxp = new RegExp(`${__keywords}`)
  for (let name of props?.filter?.fielid??[]) {
    if (regxp.test(value?.[name])) {
      return value
    }
  }
  return false
}

const selectable = (row: Record<string, any>[]) => {
  return !isDisabled(props?.env)(getSelection(props?.selection)?.disabled, { row })
}

function handleSelectionChange (value: Record<string, any>[]) {
  emit('command', `command:selectionChange|${props.assokey}`, value)
}

function getSelection (value?: Selection | boolean) {
  if (!value) return undefined
  if (value == true) {
    return <Selection> { open: true }
  }
  return value
}

function getPropValue (name: keyof Props) {
  return env?.value?.cache?.[props.assokey!]?.[name] ?? props?.[name]
}

function getCurrentPage () {
  return env.value?.cache?.[props.assokey!]?.pageInfo?.page??current.value
}
</script>