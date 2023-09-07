<!-- Page::Login -->
<template>
  <div class="account-body min-h-10 p-8 w-[380px]">
    <h1 class="text-center pb-8 m-0">用户登录</h1>
    <el-form ref="formRef" size="large" 
      :model="form" 
      :rules="rules" 
      @submit.native.prevent="submitForm(formRef)" 
      label-position="top" 
      hide-required-asterisk >
      <el-form-item prop="username" :rules="rules.username" label="用户名" class="h-20">
        <el-input placeholder="账号/邮箱/手机号" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password" :rules="rules.password" class="h-20">
        <div slot="label" class="el-form-item__label flex! flex-1! justify-between! flex-row! pr-0!">
          <span>密码</span>
          <span><NuxtLink to="/lostpass">密码忘记了?</NuxtLink></span>
        </div>
        <el-input type="password" placeholder="密码" v-model="form.password" />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" native-type="submit" :loading="loading">登 录</el-button>
      </el-form-item>
    </el-form>
    <div class="border-0 border-t border-[#dcdfe6] border-solid pt-[24px] text-center text-warm-gray-500">
      还没有会员？<NuxtLink to="/register">创建新账户</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { AuthToken } from '@/types'
import { useUserStore } from '~/store/user'

definePageMeta({
  layout: 'account'
})

const router = useRouter()
const { url_callback } = useURLParams()

type LoginForm = {
  username: string
  password: string
}

const store = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref<boolean>(false)

const form = ref(<LoginForm>{
  username: '',
  password: ''
})

// 验证规则
const rules = useVerifyRule<keyof LoginForm>({
  username: [
  { required: true, message: '请输入账号/邮箱/手机号' }
  ],
  password: [
    { required: true, message: '请输入密码' }
  ]
})

// 提交数据
function submitForm (formEl?: FormInstance) {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      loading.value = true
      setTimeout(async () => {
        try {
          let { data, error } = await useHttpProxy<AuthToken>('/api/uc/account/login', { 
            method: 'POST', 
            data: formEl.$props.model 
          })
          if (error) {
            ElMessage.warning(error)
          }
          else if (data) {
            store.setAuth(data)
            formEl.resetFields()
            router.push({ path: url_callback ?? '/' })
          }
        } catch (error) {
          if (error instanceof Error) {
            ElMessage.error(error.message)
          }
        }
        loading.value = false
      }, 500)
    }
    else {
      return false
    }
  })
}

</script>
