<template>
  <Container layout="horizontal" justify-content="space-between">
    
    <Container layout="horizontal">
      <!-- <el-button>新建用户组</el-button> -->
      <form-expand :data="expands" @command="handleCommand" />
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
    <el-table :data="pdata.filter(filterData)"

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
  <!--  -->
  
    <el-pagination v-if="pagination" class="mt-4" background 
      layout="->, total, prev, pager, next, jumper" 
      :total="total" 
      :page-size="pagination"
      @current-change="handleCurrentChange"
    />
  
  </div>
</template>

<script setup lang="ts">
import type { Selection, TableColumn, PageInfo } from '@/types/base'
import { chunk, trim, isEqual } from 'lodash'
import type { Sort } from 'element-plus'
import ruleJudgment from 'rule-judgment'

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
  counts: 0,
})

// const selection = ref(props.selection)
// const multipleSelection = ref([])
const pdata = ref(props.data??[])
const total = ref(0)
const current = ref(1)

const env = ref(props.env)
const loading = ref(false)
const keywords = ref('')

watchDeep(env, (value, oldVal) => {
  loading.value = value?.cache?.[props.assokey!]?.loading
  initialData(value?.cache?.[props.assokey!]?.data)
  if (loading.value) {
    keywords.value = ''
  }
})

initialData(props.data)

const emit = defineEmits(['get-data', 'submit', 'command', 'change', 'update:data'])

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
  if (props.pagination) {
    total.value = value?.length ?? 0
    let pagesize = props.pagination
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
  let __data = props.env?.cache?.[props.assokey!]?.data ?? props.data
  // 远端分页
  if ((__data?.length??0) < total.value) {
    pdata.value = __data??[]
  }
  // 本地分页
  else if (props.pagination) {
    pdata.value = chunk(<any[]>__data, props.pagination)?.[page-1]
  }
}

function handleSortChange (column: Sort) {
  let { order, prop } = column
  if (props.sorter && props.pagination) {
    let pageInfo: PageInfo = {
      size: props.pagination,
      page: current.value,
      sort: [ prop, order ]
    }
    let conditions = { 
      pageInfo
    }
    emit('submit', conditions, props.sorter)
  }
  else {
    handleCurrentChange(current.value)
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
// const filterData = getFilter(props.filter?.method, { keywords: keywords.value })

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
</script>