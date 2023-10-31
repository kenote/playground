<template>
  <component :is="components?.[component]" 
    v-bind="options" 
    v-model="modelValue"
    v-bind:env="env"
    @command="handleCommand"
    @change="handleChange"
    @get-data="handleGetData"
    @submit="handleSubmit"
    >
    <template v-if="children">
      <View v-for="(item) in children??[]" 
        :name="item.name"
        v-model="env![item.name!]"
        :component="item?.component" 
        :options="item?.options" 
        :children="item?.children"
        @command="handleCommand"
        @change="handleChange"
        @get-data="handleGetData"
        @submit="handleSubmit"
        :env="env">
        <slot></slot>
      </View>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import type { RequestConfig, SubmitActionOptions } from '@/types/base'
import { merge } from 'lodash'
import Container from './Container.vue'
import Dialog from './Dialog.vue'
import DialogForm from './dialog/form.vue'
import FormItem from './form/item.vue'
import FormWrap from './form/wrap.vue'
import Table from './Table.vue'
import WrapperPanel from './wrapper/panel.vue'
import type { ViewComponent } from '@/types/views'

const components: Record<string, any> = {
  Container,
  Dialog,
  DialogForm,
  FormItem,
  FormWrap,
  Table,
  WrapperPanel,
}

type Props = {
  name       ?: string
  component  ?: ViewComponent
  options    ?: Record<string, any>
  children   ?: Props[]
  env        ?: Record<string, any>
  modelValue ?: any
}

const props = withDefaults(defineProps<Props>(), {
  component: 'Container'
})

const modelValue = ref(props.modelValue)

const emit = defineEmits(['command', 'change', 'get-data', 'submit', 'update:modelValue'])

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
  }
)

const handleCommand = (value: string, params?: Record<string, any>) => {
  emit('command', value, params)
}

const handleChange = (value?: any) => {
  emit('change', value)
}

const handleGetData = (request: RequestConfig, options: any, next: (data: any) => void) => {
  emit('get-data', request, options, next)
}

const handleSubmit = (values: Record<string, any> | Event, action: RequestConfig, options: SubmitActionOptions) => {
  if (values?.target) return
  emit('submit', values, action, options)
}
</script>