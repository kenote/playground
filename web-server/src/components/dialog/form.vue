<template>
  <Dialog
    v-model="modelValue"
    :title="title"
    :width="width"
    :height="height"
    :close-on-click-modal="false"
    :show-footer="props.options?.hide"
    :loading="loading"
    @command="handleCommand"
    >
    <form-wrap ref="formRef" class="!ml-4 !mr-4"
      :default-values="defaultValues"
      :columns="columns"
      :verify-rules="verifyRules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :label-suffix="labelSuffix"
      :inline-message="inlineMessage"
      :status-icon="statusIcon"
      :hide-asterisk="hideAsterisk"
      :asterisk-position="asteriskPosition"
      :exclude="exclude"
      :merge-field="mergeField"
      :value-format="valueFormat"
      :unique-options="uniqueOptions"
      :action="action"
      :submit-name="submitName"
      :size="size"
      :options="options"
      :loading="loading"
      :env="env"
      @submit="handleSubmit"
      @get-data="handleGetData"
    />
  </Dialog>
</template>

<script setup lang="ts">
import type { FormWrapProps } from '@/types/views/form-wrap'
import type { FormInstance } from 'element-plus'
import type { RequestConfig, SubmitActionOptions } from '@/types/base'

type Props = FormWrapProps & {
  title      ?: string
  width      ?: string | number
  height     ?: string | number
  modelValue ?: boolean
  env        ?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  labelPosition: 'left'
})

const modelValue = ref(props.modelValue)
const formRef = ref<FormInstance>()
const loading = ref(false)

const emit = defineEmits(['command', 'submit', 'get-data', 'update:modelValue'])

watch(
  () => modelValue.value,
  (value, oldVal) => {
    emit('update:modelValue', value)
  }
)
watch(
  () => props.modelValue,
  (value, oldVal) => {
    modelValue.value = value
    loading.value = false
  }
)

const handleGetData = (request: RequestConfig, options: any, next: (data: any) => void) => {
  emit('get-data', request, options, next)
}

function handleCommand (value: string) {
  let command = parseCommand(value)
  if (command?.type == 'submit') {
    formRef.value?.["submit"]()
  }
}

function handleSubmit (values: any, action: RequestConfig, options: SubmitActionOptions) {
  loading.value = true
  emit('submit', values, action, <SubmitActionOptions>{...options,
    dialog: data => {
      loading.value = false
      if (data) {
        modelValue.value = false
      }
    }
  })
}

</script>