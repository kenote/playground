<!-- Account::Verify -->
<template>
  <p class="text-warm-gray-500 mt-[-8px] text-center">忘记密码？请在下方输入您的电子邮件地址，开始重置程序。</p>
  <el-form ref="formRef" size="large" 
    :model="form" 
    :rules="<any>rules" 
    @submit.native.prevent="submitForm(formRef)" 
    label-position="top" 
    hide-required-asterisk >
    <el-form-item prop="email" :rules="<any>rules.email" label="电子邮箱地址" class="h-20">
      <el-input placeholder="电子邮箱地址" v-model="form.email" />
    </el-form-item>
    <el-form-item >
      <el-button type="primary" native-type="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { type FilterData } from 'parse-string'
import type { FormInstance } from 'element-plus'

type LostpassForm = {
  email: string
}

const emit = defineEmits(['submit'])

const formRef = ref<FormInstance>()

const form = reactive(<LostpassForm>{
  email: ''
})

const rules: Record<keyof LostpassForm, FilterData.rule[]> = {
  email: [
    { required: true, message: '请输入注册邮箱地址' }
  ]
}

const submitForm = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      emit('submit', formEl.$props.model)
    }
    else {
      return
    }
  })
}

</script>