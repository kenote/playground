<template>
  <div v-if="content" class="flex-container" v-bind:class="layoutClass" :style="styles" v-html="content" />
  <div v-else class="flex-container" v-bind:class="layoutClass" :style="styles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { compact, isString, isPlainObject, keys, camelCase, values, zipObject, isEqual } from 'lodash'

type Props = {
  name           ?: string
  layout         ?: string
  width          ?: number | string
  minWidth       ?: number | string
  maxWidth       ?: number | string
  height         ?: number | string
  minHeight      ?: number | string
  maxHeight      ?: number | string
  margin         ?: string
  padding        ?: string
  background     ?: string | Record<'color' | 'image' | 'repeat' | 'attachment' | 'position' | 'size' | 'clip' | 'origin', string>
  border         ?: string | Record<string, string>
  justifyContent ?: string
  alignItems     ?: string
  flex           ?: string | Record<string, string>
  content        ?: string
}

type Style = {
  width          ?: string
  minWidth       ?: string
  maxWidth       ?: string
  height         ?: string
  minHeight      ?: string
  maxHeight      ?: string
  margin         ?: string
  padding        ?: string
  border         ?: string
  background     ?: string
  flex           ?: string
} & Record<string, any>

const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical'
})

const styles = reactive<Style>({})
const layoutClass = ref<string>()

watch(
  () => props,
  (value, oldVal) => {
    if (isEqual(value, oldVal)) return
    for (let item of ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight', 'margin', 'padding'] as const) {
      if (!value?.[item]) continue
      styles[item] = toPixelSize(value?.[item]!)
    }
    for (let item of ['border', 'background', 'flex'] as const) {
      if (!value?.[item]) continue
      if (isString(value?.[item])) {
        styles[item] = <string> value?.[item]
      }
      else if (isPlainObject(value?.[item])) {
        for (let [key, val] of Object.entries(toMapValue(<Record<string, string>>value?.[item], item))) {
          styles[key] = val
        }
      }
    }
    for (let item of ['justifyContent', 'alignItems'] as const) {
      styles[item] = value?.[item]!
    }
    layoutClass.value = compact([ value.layout, value.name && `container__${value.name}` ]).join(' ')
  },
  { immediate: true }
)

function toPixelSize (value: number | string) {
  return compact(String(value).split(/\s+/)).map( v => {
    if (/^(\d\.?)+$/.test(v)) {
      return v + 'px'
    }
    return v
  }).join(' ')
}

function toMapValue (value: Record<string, string>, name: string) {
  return zipObject(keys(value).map( v => camelCase([name, v].join(' '))), values(value))
}
</script>