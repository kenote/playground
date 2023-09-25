<template>
  <component :is="components?.[component]" 
    v-bind="options" 
    @command="handleCommand"
    @change="handleChange"
    >
    <template v-if="children">
      <View v-for="(item) in children??[]" 
        :component="item?.component" 
        :options="item?.options" 
        :children="item?.children"
        @command="handleCommand"
        @change="handleChange"
        >
        <slot></slot>
      </View>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import Container from './Container.vue'
import FormItem from './form/item.vue'
import WrapperPanel from './wrapper/panel.vue'

const components: Record<string, any> = {
  Container,
  FormItem,
  WrapperPanel,
}

type Props = {
  component  ?: string
  options    ?: Record<string, any>
  children   ?: Props[]
}

const props = withDefaults(defineProps<Props>(), {
  component: 'Container'
})

const emit = defineEmits(['command', 'change'])

const handleCommand = (value?: string) => {
  emit('command', value)
}

const handleChange = (value?: any) => {
  emit('change', value)
}
</script>