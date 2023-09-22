<template>
  <component :is="components?.[component]" v-bind="options" @command="handleCommand">
    <template v-if="children">
      <View v-for="(item) in children??[]" 
        :component="item?.component" 
        :options="item?.options" 
        :children="item?.children"
        @command="handleCommand"
        >
        <slot></slot>
      </View>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import Container from './Container.vue'

const components: any = {
  Container
}

type Props = {
  component  ?: string
  options    ?: Record<string, any>
  children   ?: Props[]
}

const props = withDefaults(defineProps<Props>(), {
  component: 'Container'
})

const emit = defineEmits(['command'])

const handleCommand = (value?: string) => {
  emit('command', value)
}
</script>