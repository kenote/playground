<template>
  
  <el-input v-if="type == 'input'"
    v-model="modelValue"
    :placeholder="placeholder"
    />
</template>

<script setup lang="ts">
import { useModal } from "element-plus"


type Props = {
  type          ?: 'input'
  placeholder   ?: sting | string[]
  value         ?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'input',
})

const modelValue = ref(props.value)

watch(
  () => modelValue.value,
  (value, oldVal) => {
    emit('change', value)
  }
)

const emit = defineEmits(['change', 'update:value'])



</script>