<template>
  <div class="mt-5" v-bind:class="wrapClass">
    <el-form ref="formRef"
      :model="values" 
      :rules="rules"
      :size="size"
      :disabled="disabled"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :label-suffix="labelSuffix"
      :inline="inline"
      :inline-message="inlineMessage"
      :status-icon="statusIcon"
      :hide-required-asterisk="hideAsterisk"
      :require-asterisk-position="asteriskPosition"
      @keyup.enter.native="submitForm(formRef)"
      @submit.native.prevent="submitForm(formRef)">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item v-for="(item) in columns??[]" v-bind:class="formItemClass"
            :key="item.key" 
            :prop="item.key" 
            :rules="rules?.[item.key]" 
            :label="item.label"
            :label-width="item.labelWidth"
            >
            <template #label v-if="item.labelOptions">
              <form-item type="select"
                v-model="values[item.labelOptions.key]"
                
                :placeholder="item.labelOptions.placeholder"
                :disabled="isDisabled()(item.labelOptions.disabled)"
                :width="item.labelOptions.width"
                :data="item.labelOptions.data"
                :options="item.labelOptions.options"
                :format="item.labelOptions.format"
                :value-format="item.labelOptions.valueFormat"
                :size="item.labelOptions.size"
              />
            </template>
            <!-- <el-input v-model="values[item.key]" /> -->
            <form-item :type="item.type" 
              v-model="values[item.key]"
              :placeholder="item.placeholder"
              :disabled="isDisabled()(item.disabled)"
              :width="item.width"
              :data="item.data"
              :props="item.props"
              :options="item.options"
              :format="item.format"
              :value-format="item.valueFormat"
              :size="item.size"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- footer -->
      <el-row :gutter="20" v-if="!options?.hide">
        <el-col :span="24">
          <el-form-item class="footer">
            <el-button type="primary" native-type="submit" :loading="loading">{{ submitName }}</el-button>
            <el-button v-if="options?.reset" plain @click="handleRest(formRef)">{{ options?.reset }}</el-button>
            <form-expand :data="options?.emits" :env="env" :values="values" @command="handleCommand" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { Verify, FormItemColumn, Size, RequestConfig, SubmitOptions } from '@/types/base'
import type { FormInstance } from 'element-plus'
import { isDisabled } from '~/utils/parse'
import { ParseData, formatData } from 'parse-string'
import { get, set, pick, omit, merge, zipObject, unset, map, isString, isEmpty, isEqual, cloneDeep, omitBy, isUndefined } from 'lodash'
import ruleJudgment from 'rule-judgment'
import type { FormWrapProps } from '@/types/views/form-wrap'
import { ElMessage } from 'element-plus'

type Props = FormWrapProps & {
  loading    ?: boolean
  env        ?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  submitName: 'Submit',
  size: 'default'
})

const formRef = ref<FormInstance>()
const original = ref<Record<string, any>>(props.defaultValues??{})
const defaultValues = cloneDeep(props.defaultValues??{})
const values = ref<Record<string, any>>(defaultValues)
const rules = useVerifyRule(props.verifyRules??{}, { 
  form: values, 
  uniqueFunc: useUniqueFunc(get(props, 'env.user'), props.uniqueOptions) 
})

const wrapClass = ref<string>('')
const formItemClass = ref<string>('')
initProps(props)


const emit = defineEmits(['get-data', 'submit', 'command', 'update:values'])

const handleCommand = (value: string | undefined, row: Record<string, any>) => {
  emit('command', value, row)
}

function initProps (value: Props) {
  let names: string[] = [formItemMarginBottom(value.size)]
  if (value.inline) {
    wrapClass.value = 'searcher'
  }
  if (value.inlineMessage) {
    names.push('inline-message')
  }
  formItemClass.value = names.join(' ')
}

function formItemMarginBottom (value?: Size) {
  if (value == 'large') {
    return '!mb-8'
  }
  if (value == 'small') {
    return '!mb-6'
  }
  return '!mb-7'
}

function submitForm (formEl?: FormInstance) {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      let labelKeys = map(props.columns?.filter(ruleJudgment<FormItemColumn>({ labelOptions: { $exists: true }})), 'labelOptions.key')
      let keys = map(props.columns?.filter( v => isFilter()(v.conditions) ), 'key').concat(labelKeys)
      let __values = parseValues(pick(formEl.$props.model, keys))
      let __original = parseValues(pick(original.value, keys))

      let { changeSubmit } = props.options ?? {}
      if (changeSubmit && isEqual(omitBy(__values, isUndefined), __original)) {
        ElMessage.warning(isString(changeSubmit) ? changeSubmit : '数据好像没什么改变，无需提交')
        return
      }

      // __values = merge(__values, pick(formEl.$props.model, labelKeys))
      let __options: SubmitOptions = merge(props.options, {
        next: (val: Record<string, any>) => {
          values.value = val
          original.value = val
        }
      })

      emit('submit', __values, props.action, __options)
    }
    else {
      return false
    }
  })
}

const customize = {
  format: (value: any, format: string) => {
    let __value = isString(value) ? JSON.parse(value) : value
    return toFormatString()(__value, format)
  },
  template:  (value: any, format: string) => {
    let __value = isString(value) ? JSON.parse(value) : value
    return parseTemplate(format, __value)
  }
}

function parseValues (value: Record<string, any>) {
  let __values = value
  let items = props.columns?.filter( v => ['datetimerange', 'daterange', 'monthrange', 'timerange'].includes(v.type) ) ?? []
  for (let item of items) {
    let keys = item.key.split(/\_{2}/)
    if (keys.length == 2) {
      __values = merge(__values, zipObject(keys, __values?.[item.key]))
      unset(__values, item.key)
    }
  }
  let __keys = map(__values, 'key')
  for (let [key, format] of Object.entries(props.valueFormat??{})) {
    if (__keys.includes(key)) {
      __values[key] = formatData(format, customize)(__values?.[key])
    }
    else if (!isEmpty(__values)) {
      __values[key] = formatData(format, customize)(__values)
    }
  }
  for (let [key, val] of Object.entries(props.mergeField??{})) {
    set(__values, key, pick(__values, val))
  }
  return omit(__values, props.exclude??[])
}

function handleRest (formEl?: FormInstance) {
  if (!formEl) return
  formEl.resetFields()
  values.value = cloneDeep(props.defaultValues??{})
}
</script>