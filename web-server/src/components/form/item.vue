<template>
  <!-- text | password -->
  <el-input v-if="['text', 'password'].includes(type)"
    v-model="modelValue"
    type="text"
    :placeholder="placeholder"
    :disabled="disabled"
    :minlength="min"
    :maxlength="max"
    :size="size"
    :clearable="options?.clearable"
    :show-word-limit="options?.showWordLimit"
    :show-password="type == 'password' || options?.showPassword"
    :style="styles"
    />
  <!-- textarea -->
  <el-input v-if="type == 'textarea'"
    v-model="modelValue"
    type="textarea"
    :placeholder="placeholder"
    :disabled="disabled"
    :minlength="min"
    :maxlength="max"
    :clearable="options?.clearable"
    :show-word-limit="options?.showWordLimit"
    :resize="options?.resize"
    :rows="options?.rows"
    :autosize="options?.autosize"
    :style="styles"
    />
  <!-- number -->
  <el-input-number v-if="type == 'number'"
    v-model="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="min"
    :max="max"
    :size="size"
    :step="options?.step"
    :precision="options?.precision"
    :step-strictly="options?.stepStrictly"
    :controls-position="options?.controlsPosition"
    :controls="options?.controls"
    :style="styles"
    />
  <!-- radio ｜ radio-button -->
  <el-radio-group v-if="/^(radio)/.test(type)" 
    v-model="modelValue" 
    :disabled="disabled" 
    :size="size" 
    :style="styles">
    <template v-if="/(button)$/.test(type)">
      <el-radio-button v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
        {{ toFormatString(props)(item, format) }}
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
        {{ toFormatString(props)(item, format) }}
      </el-radio>
    </template>
  </el-radio-group>
  <!-- checkbox ｜ checkbox-button -->
  <el-checkbox-group v-if="/^(checkbox)/.test(type)" 
    v-model="modelValue" 
    :disabled="disabled" 
    :size="size" 
    :min="min" 
    :max="max" 
    :style="styles">
    <template v-if="/(button)$/.test(type)">
      <el-checkbox-button v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
        {{ toFormatString(props)(item, format) }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
        {{ toFormatString(props)(item, format) }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
  <!-- select -->
  <el-select v-if="type == 'select'" 
    v-model="modelValue" 
    :placeholder="placeholder"
    :disabled="disabled" 
    :size="size"
    :clearable="options?.clearable"
    :filterable="options?.filterable"
    :allow-create="options?.allowCreate"
    :multiple="options?.multiple"
    :multiple-limit="options?.multipleLimit"
    :collapse-tags="options?.collapseTags"
    :max-collapse-tags="options?.maxCollapseTags"
    :style="styles"
    collapse-tags-tooltip>
    <template v-for="(item) in propData">
      <el-option-group v-if="'children' in item" :key="item.label" :label="item.label">
        <el-option v-for="(ele) in item.children" 
          :key="ele.value" 
          :label="toFormatString(props)(ele, format)" 
          :value="ele.value" 
          :disabled="ele?.disabled">
          <div v-if="options?.template" v-html="toFormatString(props)(ele, options?.template)" ></div>
        </el-option>
      </el-option-group>
      <el-option v-else :key="item.value" 
        :label="toFormatString(props)(item, format)" 
        :value="item.value" 
        :disabled="item?.disabled">
        <div v-if="options?.template" v-html="toFormatString(props)(item, options?.template)" ></div>
      </el-option>
    </template>
  </el-select>
  <!-- select-v2 -->
  <el-select-v2 v-if="type == 'select-v2'" 
    v-model="modelValue" 
    :placeholder="placeholder"
    :disabled="disabled" 
    :size="size"
    :options="propData?.map( v => ({ ...v, label: toFormatString(props)(v, format) }) )"
    :clearable="options?.clearable"
    :filterable="options?.filterable"
    :allow-create="options?.allowCreate"
    :multiple="options?.multiple"
    :multiple-limit="options?.multipleLimit"
    :collapse-tags="options?.collapseTags"
    :max-collapse-tags="options?.maxCollapseTags"
    :style="styles"
    collapse-tags-tooltip>
    <template v-if="options?.template" #default="{ item }">
      <div v-html="toFormatString(props)(item, options?.template)" ></div>
    </template>
  </el-select-v2>
  <!-- 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' -->
  <el-date-picker v-if="['year', 'month', 'date', 'dates', 'week', 'datetime'].includes(type)"
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :format="format"
    :value-format="valueFormat"
    :clearable="options?.clearable"
    :editable="options?.editable"
    :arrow-control="options?.arrowControl"
    :default-time="parseTime(options?.defaultTime!)??undefined"
    :shortcuts="options?.shortcuts?.map(parseShortcut)"
    :disabled-date="disabledDate"
    :style="styles"
    >
    <template #default="cell">
      <div class="el-date-table-cell" :class="{ current: cell.isCurrent }">
        <span class="el-date-table-cell__text">{{ cell.text }}</span>
        <span v-if="isHoliday(cell)" class="el-date-table-cell__holiday" />
      </div>
    </template>
  </el-date-picker>
  <!-- 'datetimerange' | 'daterange' | 'monthrange' -->
  <el-date-picker v-if="['datetimerange', 'daterange', 'monthrange'].includes(type)"
    v-model="modelValue"
    :type="type"
    :start-placeholder="placeholder?.[0]"
    :end-placeholder="placeholder?.[1]"
    :disabled="disabled"
    :size="size"
    :format="format"
    :value-format="valueFormat"
    :clearable="options?.clearable"
    :editable="options?.editable"
    :arrow-control="options?.arrowControl"
    :default-time="parseTime(options?.defaultTime!)??undefined"
    :shortcuts="options?.shortcuts?.map(parseShortcut)"
    :disabled-date="disabledDate"
    :range-separator="options?.separator"
    :style="styles"
    >
    <template #default="cell">
      <div class="el-date-table-cell" :class="{ current: cell.isCurrent }">
        <span class="el-date-table-cell__text">{{ cell.text }}</span>
        <span v-if="isHoliday(cell)" class="el-date-table-cell__holiday" />
      </div>
    </template>
  </el-date-picker>
  <!-- time -->
  <el-time-picker v-if="['time'].includes(type)"
    v-model="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :format="format"
    :clearable="options?.clearable"
    :editable="options?.editable"
    :arrow-control="options?.arrowControl"
    :disabled-hours="disabledHours"
    :disabled-minutes="disabledMinutes"
    :disabled-seconds="disabledSeconds"
    :style="styles"
  />
  <!-- timerange -->
  <el-time-picker v-if="['timerange'].includes(type)" is-range
    v-model="modelValue"
    :start-placeholder="placeholder?.[0]"
    :end-placeholder="placeholder?.[1]"
    :disabled="disabled"
    :size="size"
    :format="format"
    :clearable="options?.clearable"
    :editable="options?.editable"
    :arrow-control="options?.arrowControl"
    :disabled-hours="disabledHours"
    :disabled-minutes="disabledMinutes"
    :disabled-seconds="disabledSeconds"
    :range-separator="options?.separator"
    :style="styles"
  />
  <!-- cascader -->
  <el-cascader v-if="['cascader'].includes(type)"
    v-model="modelValue"
    :placeholder="placeholder"
    :disabled="disabled" 
    :size="size"
    :props="cascaderProps"
    :options="propData"
    :clearable="options?.clearable"
    :filterable="options?.filterable"
    :collapse-tags="options?.collapseTags"
    :max-collapse-tags="options?.maxCollapseTags"
    :separator="options?.separator"
    :style="styles"
    collapse-tags-tooltip >
    <template v-if="options?.template" #default="{ node, data }">
      <div v-html="toFormatString(props)(data, options?.template)" ></div>
    </template>
  </el-cascader>
  <!-- cascader-panel -->
  <el-cascader-panel v-if="['cascader-panel'].includes(type)"
    v-model="modelValue"
    :props="cascaderProps"
    :options="propData"
    :style="styles" >
    <template v-if="options?.template" #default="{ node, data }">
      <div v-html="toFormatString(props)(data, options?.template)" ></div>
    </template>
  </el-cascader-panel>
  <!-- switch -->
  <el-switch v-if="type == 'switch'"
    v-model="modelValue"
    :disabled="disabled" 
    :size="size"
    :active-text="options?.activeText"
    :inactive-text="options?.inactiveText"
    :active-value="options?.activeValue"
    :inactive-value="options?.inactiveValue"
  />
  <!-- slider -->
  <el-slider v-if="type == 'slider'"
    v-model="modelValue"
    :disabled="disabled"
    :min="min"
    :max="max"
    :size="size"
    :show-input="options?.showInput"
    :step="options?.step"
    :input-size="options?.inputSize"
    :show-stops="options?.showStops"
    :show-tooltip="options?.showTooltip"
    :range="options?.range"
    :vertical="options?.vertical"
    :marks="options?.marks"
    :height="height && toPixelSize(height)"
  />
  <!-- color-picker -->
  <div class="inline-flex" v-if="type == 'color-picker'">
    <el-input v-model="modelValue" :disabled="disabled" :size="size" readonly class="mr-1" />
    <el-color-picker
      v-model="modelValue"
      :disabled="disabled"
      :size="size"
      :show-alpha="options?.showAlpha"
      :predefine="options?.precision"
      :color-format="options?.colorFormat"
    />
  </div>
  <!-- rate -->
  <el-rate v-if="type == 'rate'"
    v-model="modelValue"
    :disabled="disabled"
    :size="size"
    :max="max"
    :clearable="options?.clearable"
    :allow-half="options?.allowHalf"
    :low-threshold="options?.lowThreshold"
    :high-threshold="options?.highThreshold"
    :colors="options?.colors"
    :texts="options?.texts"
    :show-text="options?.showText"
    :show-score="options?.showScore"
    :text-color="options?.textColor"
    :score-template="options?.template"
  />
  <!-- transfer -->
  <el-transfer v-if="type == 'transfer'"
    v-model="modelValue"
    :disabled="disabled"
    :size="size"
    :data="propData"
    :props="toProps('key')"
    :filterable="options?.filterable"
    :filter-placeholder="placeholder"
    :titles="options?.titles"
    :button-texts="options?.buttonTexts"
    :target-order="options?.targetOrder"
    :left-default-checked="options?.leftDefaultChecked"
    :right-default-checked="options?.rightDefaultChecked"
    :filter-method="filterMethod">
    <template v-if="options?.template" #default="{ option }">
      <div v-html="toFormatString(props)(option, options?.template)" ></div>
    </template>  
  </el-transfer>
</template>

<script setup lang="ts">
import type { PropDataItem, Shortcut, FormItemType, FormItemOptions, Size, RequestConfig } from '@/types/base'
import { CascaderProps, dayjs } from 'element-plus'
import type { DateCell } from 'element-plus/es/components/date-picker/src/date-picker.type'
import { isArray, isString, merge, unset, isPlainObject } from 'lodash'
import ruleJudgment from 'rule-judgment'

type Props = {
  type          ?: FormItemType
  placeholder   ?: string | string[]
  value         ?: any
  disabled      ?: boolean
  options       ?: FormItemOptions
  width         ?: number | string
  height        ?: number | string
  min           ?: number
  max           ?: number
  size          ?: Size
  data          ?: Array<Partial<PropDataItem> & { [x: string]: any }> | string | RequestConfig
  props         ?: Partial<Record<keyof PropDataItem, string> & { [x: string]: any }>
  format        ?: string
  valueFormat   ?: string
}

type Style = {
  width         ?: string
  height        ?: string
} & Record<string, any>

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const modelValue = ref(props.value)
const styles = reactive<Style>({})
const propData = ref<PropDataItem[]>([])
const filterMethod = ref<Function>()
const cascaderProps = ref({})

watch(
  () => modelValue.value,
  (value, oldVal) => {
    emit('change', value)
  }
)

initProps(props)

const emit = defineEmits(['change', 'get-data', 'update:value'])

function initProps (value: Props) {
  if (value.width) {
    styles.width = toPixelSize(value.width)
  }
  if (value.height) {
    styles.height = toPixelSize(value.height)
  }
  let __request: RequestConfig | null = null
  if (isString(value.data)) {
    __request = { url: value.data }
  }
  else if (isPlainObject(value.data) && 'url' in <RequestConfig>value.data) {
    __request = <RequestConfig>value.data
  }
  if (__request) {
    emit('get-data', __request, (data: Array<Partial<PropDataItem> & { [x: string]: any }>) => {
      propData.value = data?.map( parseProps<PropDataItem>(value.props) ) ?? []
    })
  }
  else if (isArray(value.data)) {
    propData.value = value.data?.map( parseProps<PropDataItem>(value.props) ) ?? []
  }
  
  if (['cascader', 'cascader-panel'].includes(props.type)) {
    let options: CascaderProps = {}
    if (value?.options?.multiple) {
      options.multiple = value.options.multiple
    }
    if ([false, true].includes(value?.options?.emitPath!)) {
      options.emitPath = value.options?.emitPath
    }
    cascaderProps.value = merge(options, value.props)
  }
  if (value?.options?.filterMethod) {
    filterMethod.value = parseFunction(value.options.filterMethod)
  }
}

const toProps = (name: string, data?: Partial<Record<keyof PropDataItem, string> & { [x: string]: any }>) => {
  let __data = data ?? props.props
  let __props = merge(data, { [name]: !__data?.value || __data?.value == name ? 'value' : __data.value })
  if (!name || name !== 'value') {
    unset(__props, 'value')
  }
  return __props
}

const parseShortcut = (shortcut: Shortcut) => {
  if (isArray(shortcut?.value)) {
    return { ...shortcut, value: shortcut.value.map( v => parseDefaultTime(isString(v) ? parseDate(v) : v) )}
  }
  if (isString(shortcut?.value)) {
    return { ...shortcut, value: parseDefaultTime(parseDate(shortcut.value)) }
  }
  return shortcut
}

function parseDefaultTime (value: Date | null) {
  let date = value
  if (props?.options?.defaultTime) {
    return parseTime(props?.options?.defaultTime, date??new Date())
  }
  return date
}

const disabledDate = (value: Date) => {
  if (!props?.options?.disabledDate) return false
  if (isArray(props?.options?.disabledDate)) {
    let date = dayjs(value).format('YYYY-MM-DD')
    return props?.options?.disabledDate?.includes(date)
  }
  return ruleJudgment(props?.options?.disabledDate)(value)
}

const isHoliday = (cell: DateCell) => {
  return props?.options?.holidays?.includes(cell.dayjs?.format('YYYY-MM-DD')!)
}

const makeRange = (range: number[]) => {
  const [ start, end ] = range
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

const disabledHours = () => {
  if (!props.options?.disabledTime) return []
  let hours: number[] = []
  for (let item of props.options?.disabledTime) {
    let times = item.map( v => <Date>parseTime(v) )
    let minutes = times.map( v => v.getMinutes() )
    let [ start, end ] = times.map( v => v?.getHours() )
    if (start < end) {
      start = start + (minutes?.[0] > 0 ? 1 : 0)
      end = end - (minutes?.[1] < 59 ? 1 : 0)
      hours = hours.concat(makeRange([start, end]))
    }
  }
  return hours
}

const disabledMinutes = (hour: number) => {
  if (!props.options?.disabledTime) return []
  for (let item of props.options?.disabledTime) {
    let times = item.map( v => <Date>parseTime(v) )
    let hours = times.map( v => v.getHours() )
    let minutes = times.map( v => v.getMinutes() )
    let seconds = times.map( v => v.getSeconds() )
    minutes[0] += (seconds?.[0] == 0 ? 0 : 1)
    minutes[1] -= (seconds?.[1] == 59 ? 0 : 1)
    if (hours?.[0] == hours?.[1]) {
      return makeRange(minutes)
    }
    if (hours?.[0] == hour) {
      return makeRange([minutes?.[0], 59])
    }
    if (hours?.[1] == hour) {
      return makeRange([0, minutes?.[1]])
    }
  }
  return []
}

const disabledSeconds = (hour: number, minute: number) => {
  if (!props.options?.disabledTime) return []
  for (let item of props.options?.disabledTime) {
    let times = item.map( v => <Date>parseTime(v) )
    let hours = times.map( v => v.getHours() )
    let minutes = times.map( v => v.getMinutes() )
    let seconds = times.map( v => v.getSeconds() )
    if (hours?.[0] == hour && minutes?.[0] == minute) {
      return makeRange([seconds?.[0], 59])
    }
    if (hours?.[1] == hour && minutes?.[1] == minute) {
      return makeRange([0, seconds?.[1]])
    }
  }
  return []
}

</script>