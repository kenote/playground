<template>
  <component :is="components?.[component]" 
    v-bind="merge(options, { env })" 
    @command="handleCommand"
    @change="handleChange"
    @get-data="handleGetData"
    @submit="handleSubmit"
    >
    <template v-if="children">
      <View v-for="(item) in children??[]" 
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
import type { RequestConfig, SubmitOptions } from '@/types/base'
import { merge } from 'lodash'
import Container from './Container.vue'
import FormItem from './form/item.vue'
import FormWrap from './form/wrap.vue'
import WrapperPanel from './wrapper/panel.vue'
import type { ViewComponent } from '@/types/views'

const components: Record<string, any> = {
  Container,
  FormItem,
  FormWrap,
  WrapperPanel,
}

type Props = {
  component  ?: ViewComponent
  options    ?: Record<string, any>
  children   ?: Props[]
  env        ?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  component: 'Container'
})

const emit = defineEmits(['command', 'change', 'get-data', 'submit'])

const handleCommand = (value?: string) => {
  emit('command', value)
}

const handleChange = (value?: any) => {
  emit('change', value)
}

const handleGetData = (request: RequestConfig, options: any, next: (data: any) => void) => {
  emit('get-data', request, options, next)
}

const handleSubmit = (values: Record<string, any> | Event, action: RequestConfig, options: SubmitOptions) => {
  if (values?.target) return
  emit('submit', values, action, options)
}
</script>