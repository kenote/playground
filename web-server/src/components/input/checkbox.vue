<template>
  <div class="w-full flex items-center">
    <el-checkbox v-if="props.options?.checkAll" class="!mr-4"
      v-model="checkAll" 
      :indeterminate="isIndeterminate" 
      @change="<any>handleCheckAllChange"
      >
      全选
    </el-checkbox>
    <el-input v-if="props.options?.filterable" class="!w-48" 
      v-model="keywords" 
      size="default" 
      clearable 
      placeholder="检索内容；可以使用正则" 
      />
  </div>
  <el-checkbox-group class="overflow-auto"
    v-model="modelValue"
    :disabled="disabled"
    :size="size"
    @change="<any>handleCheckedValuesChange"
    :style="{ maxHeight: height, width }"
    >
    <el-checkbox v-for="(item) in data?.filter(filterKeywords)" 
      :key="item.value" 
      :label="item.value" 
      :disabled="item?.disabled"
      :style="{ width: toPixelSize(props.options?.rows!) }"
      >
      <el-tooltip :content="toFormatString(<any>props)(item, format)" placement="top-start">
        {{ toFormatString(<any>props)(item, format) }}
      </el-tooltip>
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
/* __placeholder__ */
import type { Size, PropDataItem, FormItemOptions } from '@/types/base';
import { map, compact, trim } from 'lodash'
import ruleJudgment from 'rule-judgment'

type Props = {
  modelValue    ?: (string | number)[]
  disabled      ?: boolean
  size          ?: Size
  data          ?: Array<Partial<PropDataItem> & { [x: string]: any }>
  props         ?: Partial<Record<keyof PropDataItem, string> & { [x: string]: any }>
  format        ?: string
  height        ?: string
  width         ?: string
  options       ?: FormItemOptions
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large'
})

const checkAll = ref(false)
const isIndeterminate = ref(false)
const keywords = ref('')
const modelValue = ref(props.modelValue)
const emit = defineEmits(['change', 'update:modelValue'])
const values = compact(map(props.data?.filter(ruleJudgment<PropDataItem>({
  disabled: { $not: { $eq: true } }
})), 'value'))

handleCheckedValuesChange(props.modelValue??[])

watch(
  () => modelValue.value,
  (value, oldVal) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
)
watch(
  () => props.modelValue,
  (value, oldVal) => {
    modelValue.value = value
  }
)

function filterKeywords (item: Partial<PropDataItem> & { [x: string]: any }) {
  let __keywords = trim(keywords.value).replace(/\s+/g, '|')
  return ruleJudgment<PropDataItem>({ 
    $or: [
      { value: { $regex: new RegExp(__keywords) } },
      { label: { $regex: new RegExp(__keywords) } }
    ]
  })(item)
}

function handleCheckAllChange (val: boolean) {
  modelValue.value = val ? values : []
  isIndeterminate.value = modelValue.value.length > 0 && values.length < (props.data??[]).length
}

function handleCheckedValuesChange (value: (string | number)[]) {
  let checkedCount = value.length
  checkAll.value = checkedCount == values.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < (props.data??[]).length
}
</script>