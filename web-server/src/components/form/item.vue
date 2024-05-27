<template>
  <!-- text | password -->
  <el-input v-if="['text', 'password'].includes(type)"
    v-model="modelValue"
    type="text"
    :placeholder="<string>placeholder"
    :disabled="disabled"
    :minlength="props.options?.min"
    :maxlength="props.options?.max"
    :size="size"
    :clearable="props.options?.clearable"
    :show-word-limit="props.options?.showWordLimit"
    :show-password="type == 'password' || props.options?.showPassword"
    :style="styles"
    />
  <!-- textarea -->
  <el-input v-if="type == 'textarea'"
    v-model="modelValue"
    type="textarea"
    :placeholder="<string>placeholder"
    :disabled="disabled"
    :minlength="props.options?.min"
    :maxlength="props.options?.max"
    :clearable="props.options?.clearable"
    :show-word-limit="props.options?.showWordLimit"
    :resize="props.options?.resize"
    :rows="props.options?.rows"
    :autosize="props.options?.autosize"
    :style="styles"
    />
  <!-- number -->
  <el-input-number v-if="type == 'number'"
    v-model="modelValue"
    :placeholder="<string>placeholder"
    :disabled="disabled"
    :min="props.options?.min"
    :max="props.options?.max"
    :size="size"
    :step="props.options?.step"
    :precision="props.options?.precision"
    :step-strictly="props.options?.stepStrictly"
    :controls-position="props.options?.controlsPosition"
    :controls="props.options?.controls"
    :style="styles"
    />
  <!-- radio-button -->
  <el-radio-group v-if="type == 'radio-button'" 
    v-model="modelValue" 
    :disabled="disabled" 
    :size="size" 
    :style="styles"
    >
    <el-radio-button v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
      {{ toFormatString(<any>props)(item, format) }}
    </el-radio-button>
  </el-radio-group>
  <!-- radio -->
  <el-radio-group v-if="type == 'radio'" 
    v-model="modelValue" 
    :disabled="disabled" 
    :size="size" 
    :style="{ maxHeight: toPixelSize(height), width: toPixelSize(width) }">
    <el-radio v-for="(item) in propData" 
      :key="item.value" 
      :label="item.value" 
      :disabled="item?.disabled" 
      :style="{ width: toPixelSize(props.options?.rows!) }"
      >
      <el-tooltip :content="toFormatString(<any>props)(item, format)" placement="top-start">
        {{ toFormatString(<any>props)(item, format) }}
      </el-tooltip>
    </el-radio>
  </el-radio-group>
  <!-- checkbox-button -->
  <el-checkbox-group v-if="type == 'checkbox-button'" 
    v-model="modelValue" 
    :disabled="disabled" 
    :size="size" 
    :min="props.options?.min" 
    :max="props.options?.max" 
    :style="styles"
    >
    <el-checkbox-button v-for="(item) in propData" :key="item.value" :label="item.value" :disabled="item?.disabled" >
      {{ toFormatString(<any>props)(item, format) }}
    </el-checkbox-button>
  </el-checkbox-group>
  <!-- checkbox -->
  <input-checkbox v-if="type == 'checkbox'"
    v-model="modelValue"
    :disabled="disabled" 
    :data="propData"
    :props="props"
    :options="options"
    :width="toPixelSize(width)"
    :height="toPixelSize(height)"
  />
  <!-- select -->
  <el-select v-if="type == 'select'" 
    v-model="modelValue" 
    :placeholder="<string>placeholder"
    :disabled="disabled" 
    :size="size"
    :clearable="props.options?.clearable"
    :filterable="props.options?.filterable"
    :allow-create="props.options?.allowCreate"
    :multiple="props.options?.multiple"
    :multiple-limit="props.options?.multipleLimit"
    :collapse-tags="props.options?.collapseTags"
    :max-collapse-tags="props.options?.maxCollapseTags"
    :style="styles"
    collapse-tags-tooltip>
    <template v-for="(item) in propData">
      <el-option-group v-if="'children' in item" :key="item.label" :label="item.label">
        <el-option v-for="(ele) in item.children" 
          :key="ele.value" 
          :label="toFormatString(<any>props)(ele, format)" 
          :value="ele.value" 
          :disabled="ele?.disabled">
          <div v-if="props.options?.template" v-html="toFormatString(<any>props)(ele, props.options?.template)" ></div>
        </el-option>
      </el-option-group>
      <el-option v-else :key="item.value" 
        :label="toFormatString(<any>props)(item, format)" 
        :value="item.value" 
        :disabled="item?.disabled">
        <div v-if="props.options?.template" v-html="toFormatString(<any>props)(item, props.options?.template)" ></div>
      </el-option>
    </template>
  </el-select>
  <!-- select-v2 -->
  <el-select-v2 v-if="type == 'select-v2'" 
    v-model="modelValue" 
    :placeholder="<string>placeholder"
    :disabled="disabled" 
    :size="size"
    :options="propData?.map( v => ({ ...v, label: toFormatString(<any>props)(v, format) }) )"
    :clearable="props.options?.clearable"
    :filterable="props.options?.filterable"
    :allow-create="props.options?.allowCreate"
    :multiple="props.options?.multiple"
    :multiple-limit="props.options?.multipleLimit"
    :collapse-tags="props.options?.collapseTags"
    :max-collapse-tags="props.options?.maxCollapseTags"
    :style="styles"
    collapse-tags-tooltip>
    <template v-if="props.options?.template" #default="{ item }">
      <div v-html="toFormatString(<any>props)(item, props.options?.template)" ></div>
    </template>
  </el-select-v2>
  <!-- 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' -->
  <el-date-picker v-if="['year', 'month', 'date', 'dates', 'week', 'datetime'].includes(type)"
    v-model="modelValue"
    :type="<any>type"
    :placeholder="<string>placeholder"
    :disabled="disabled"
    :size="size"
    :format="format"
    :value-format="valueFormat"
    :clearable="props.options?.clearable"
    :editable="props.options?.editable"
    :arrow-control="props.options?.arrowControl"
    :default-time="parseTime(props.options?.defaultTime!)??undefined"
    :shortcuts="props.options?.shortcuts?.map(parseShortcut)"
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
    :type="<any>type"
    :start-placeholder="placeholder?.[0]"
    :end-placeholder="placeholder?.[1]"
    :disabled="disabled"
    :size="size"
    :format="format"
    :value-format="valueFormat"
    :clearable="props.options?.clearable"
    :editable="props.options?.editable"
    :arrow-control="props.options?.arrowControl"
    :default-time="parseTime(props.options?.defaultTime!)??undefined"
    :shortcuts="props.options?.shortcuts?.map(parseShortcut)"
    :disabled-date="disabledDate"
    :range-separator="props.options?.separator"
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
    :placeholder="<string>placeholder"
    :disabled="disabled"
    :size="size"
    :format="format"
    :clearable="props.options?.clearable"
    :editable="props.options?.editable"
    :arrow-control="props.options?.arrowControl"
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
    :clearable="props.options?.clearable"
    :editable="props.options?.editable"
    :arrow-control="props.options?.arrowControl"
    :disabled-hours="disabledHours"
    :disabled-minutes="disabledMinutes"
    :disabled-seconds="disabledSeconds"
    :range-separator="props.options?.separator"
    :style="styles"
  />
  <!-- cascader -->
  <el-cascader v-if="['cascader'].includes(type)"
    v-model="modelValue"
    :placeholder="<string>placeholder"
    :disabled="disabled" 
    :size="size"
    :props="cascaderProps"
    :options="propData"
    :clearable="props.options?.clearable"
    :filterable="props.options?.filterable"
    :collapse-tags="props.options?.collapseTags"
    :max-collapse-tags="props.options?.maxCollapseTags"
    :separator="props.options?.separator"
    :style="styles"
    collapse-tags-tooltip >
    <template v-if="props.options?.template" #default="{ node, data }">
      <div v-html="toFormatString(<any>props)(data, props.options?.template)" ></div>
    </template>
  </el-cascader>
  <!-- cascader-panel -->
  <el-cascader-panel v-if="['cascader-panel'].includes(type)"
    v-model="modelValue"
    :props="cascaderProps"
    :options="propData"
    :style="styles" >
    <template v-if="props.options?.template" #default="{ node, data }">
      <div v-html="toFormatString(<any>props)(data, props.options?.template)" ></div>
    </template>
  </el-cascader-panel>
  <!-- switch -->
  <el-switch v-if="type == 'switch'"
    v-model="modelValue"
    :disabled="disabled" 
    :size="size"
    :active-text="props.options?.activeText"
    :inactive-text="props.options?.inactiveText"
    :active-value="props.options?.activeValue"
    :inactive-value="props.options?.inactiveValue"
  />
  <!-- slider -->
  <el-slider v-if="type == 'slider'"
    v-model="modelValue"
    :disabled="disabled"
    :min="props.options?.min"
    :max="props.options?.max"
    :size="size"
    :show-input="props.options?.showInput"
    :step="props.options?.step"
    :input-size="props.options?.inputSize"
    :show-stops="props.options?.showStops"
    :show-tooltip="props.options?.showTooltip"
    :range="props.options?.range"
    :vertical="props.options?.vertical"
    :marks="props.options?.marks"
    :height="toPixelSize(height)"
  />
  <!-- color-picker -->
  <div class="inline-flex" v-if="type == 'color-picker'">
    <el-input v-model="modelValue" :disabled="disabled" :size="size" readonly class="mr-1" />
    <el-color-picker
      v-model="modelValue"
      :disabled="disabled"
      :size="size"
      :show-alpha="props.options?.showAlpha"
      :predefine="props.options?.predefine"
      :color-format="props.options?.colorFormat"
    />
  </div>
  <!-- rate -->
  <el-rate v-if="type == 'rate'"
    v-model="modelValue"
    :disabled="disabled"
    :size="size"
    :max="props.options?.max"
    :clearable="props.options?.clearable"
    :allow-half="props.options?.allowHalf"
    :low-threshold="props.options?.lowThreshold"
    :high-threshold="props.options?.highThreshold"
    :colors="props.options?.colors"
    :texts="props.options?.texts"
    :show-text="props.options?.showText"
    :show-score="props.options?.showScore"
    :text-color="props.options?.textColor"
    :score-template="props.options?.template"
  />
  <!-- transfer -->
  <el-transfer v-if="type == 'transfer'"
    v-model="modelValue"
    :disabled="disabled"
    :size="size"
    :data="propData"
    :props="toProps('key')"
    :filterable="props.options?.filterable"
    :filter-placeholder="<string>placeholder"
    :titles="props.options?.titles"
    :button-texts="props.options?.buttonTexts"
    :target-order="props.options?.targetOrder"
    :left-default-checked="props.options?.leftDefaultChecked"
    :right-default-checked="props.options?.rightDefaultChecked"
    :filter-method="<any>filterMethod">
    <template v-if="props.options?.template" #default="{ option }">
      <div v-html="toFormatString(<any>props)(option, props.options?.template)" ></div>
    </template>  
  </el-transfer>
</template>

<script setup lang="ts">
import type { PropDataItem, Shortcut, FormItemType, FormItemOptions, Size, RequestConfig } from '@/types/base'
import { type CascaderProps, dayjs, useFormItem } from 'element-plus'
import type { DateCell } from 'element-plus/es/components/date-picker/src/date-picker.type'
import { isArray, isString, merge, unset, isPlainObject } from 'lodash'
import ruleJudgment from 'rule-judgment'
import type { FormItemProps } from '@/types/views/form-item'

defineOptions({
  inheritAttrs: false
})

type Props = FormItemProps

type Style = {
  width         ?: string
  height        ?: string
} & Record<string, any>

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

// const { formItem } = useFormItem()
const modelValue = ref(props.modelValue)
const styles = reactive<Style>({})
const propData = ref<PropDataItem[]>([])
const filterMethod = ref<Function>()
const cascaderProps = ref({})

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

const emit = defineEmits(['change', 'get-data', 'update:modelValue'])

initProps(props)

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
    emit('get-data', __request, {}, (data: Array<Partial<PropDataItem> & { [x: string]: any }>) => {
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