<template>
  <!-- <p v-if="description" class="text-warm-gray-500 mt-[-8px] text-center">必须要有{{name}}才能注册；请在下方输入您的{{name}}。</p> -->
  <slot></slot>
  <el-form ref="formRef" size="large" 
    :model="form" 
    :rules="<FormRules>rules" 
    @submit.native.prevent="submitForm(formRef)" 
    label-position="top" 
    hide-required-asterisk >
    <el-form-item prop="token" :rules="rules.token" class="h-10">
      <el-input :placeholder="`请输入${name}`" v-model="form.token" />
    </el-form-item>
    <el-form-item >
      <el-button type="primary" native-type="submit" :loading="loading">下一步</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { type FilterData } from 'parse-string'
import type { FormInstance, FormRules } from 'element-plus'

type TicketForm = {
  token    : string
}

type Props = {
  name        : string
  description?: string
  loading     : boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '兑换码',
  loading: false
})

const emit = defineEmits(['submit'])

const formRef = ref<FormInstance>()

const form = reactive(<TicketForm>{
  token: ''
})

const rules: Record<keyof TicketForm, FilterData.rule[]> = {
  token: [
    { required: true, message: `请输入${props.name}` }
  ]
}

const submitForm = async (formEl?: FormInstance) => {
  if (!formEl) return
  
  await formEl.validate( valid => {
    if (valid) {
      emit('submit', formEl.$props.model?.token)
    }
    else {
      // return false
      return
    }
  })
}

</script>