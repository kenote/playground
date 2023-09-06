<template>
  <div class="account-body min-h-10 p-8 w-[480px]">
    <h1 class="text-center pb-8 m-0">注册账户</h1>
    <account-ticket v-if="account.invitation && !invitation" name="邀请码" :loading="loading" @submit="verifyTicket" >
      <p class="text-warm-gray-500 mt-[-8px] text-center">必须要有邀请码才能注册；请在下方输入您的邀请码。</p>
    </account-ticket>
    <el-form v-else ref="formRef" size="large" 
      :model="form" 
      :rules="rules" 
      @submit.native.prevent="submitForm(formRef)" 
      label-position="top" 
       >
      <el-form-item prop="username" :rules="rules.username" label="账户名" class="h-20">
        <el-input placeholder="请填写账户名" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="email" :rules="rules.email" label="电子邮箱" class="h-20">
        <el-input placeholder="请填写电子邮箱地址" v-model="form.email" />
      </el-form-item>
      <el-form-item prop="password" :rules="rules.password" label="密码" class="h-20">
        <el-input type="password" placeholder="请填写密码" v-model="form.password" show-password />
      </el-form-item>
      <el-form-item prop="repassed" :rules="rules.repassed" label="确认密码" class="h-20">
        <el-input type="password" placeholder="请确认密码" v-model="form.repassed" show-password />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" native-type="submit" :loading="loading">注 册</el-button>
      </el-form-item>
    </el-form>
    <div class="border-0 border-t border-[#dcdfe6] border-solid pt-[24px] text-center text-warm-gray-500">
      已经注册？<NuxtLink to="/login">登录</NuxtLink> 或 <NuxtLink to="/lostpass">重置密码</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { useAccountStore } from '~/store/account'
import type { TicketEntitie } from '@/types'

definePageMeta({
  layout: 'account'
})

// 获取 Account 配置
const account = useAccountStore()

// 获取 URL 参数
const urlParams = useURLParams()

// 获取邀请函
const invitation = ref<string>()


const loading = ref<boolean>(false)

// 挂载页面时
onMounted(async () => {
  // 核验邀请码
  if (account.invitation && urlParams?.invitation) {
    let { data } = await useVerifyTicket<TicketEntitie>(<string>urlParams?.invitation??'', '邀请码', 'register') ?? {}
    if (data) {
      invitation.value = data.ticket
    }
    else {
      invitation.value = ''
    }
  }
})

function verifyTicket (value: string) {
  loading.value = true
  setTimeout(async () => {
    try {
      let { data, error } = await useVerifyTicket<TicketEntitie>(value, '邀请码', 'register') ?? {}
      if (error) {
        ElMessage.warning(error)
      }
      else if (data) {
        invitation.value = data.ticket
      }
    } catch (error) {
      if (error instanceof Error) {
        ElMessage.error(error.message)
      }
    }
    loading.value = false
  }, 500)
}

type RegisterForm = {
  username: string
  email: string
  password: string
  repassed: string
}

const formRef = ref<FormInstance>()

const form = ref(<RegisterForm>{
  username: '',
  email: '',
  password: '',
  repassed: ''
})

// 验证规则
const rules = useVerifyRule<keyof RegisterForm>({
  username: [
    { required: true, message: '请填写账户名' },
    { validator: [ 'validateUsername', 'username', null ], trigger: [ 'blur', 'change' ] }
  ],
  email: [
    { required: true, message: '请填写电子邮箱地址' },
    { validator: [ 'validateEmail', 'email', null ], trigger: [ 'blur', 'change' ] }
  ],
  password: [
    { required: true, message: '请填写密码' },
    { validator: [ 'validatePassword' ], trigger: [ 'blur', 'change' ] }
  ],
  repassed: [
    { required: true, message: '请再输一遍密码，以便确认' },
    { validator: [ 'validateRepassed', 'form._value.password' ] }
  ]
}, { form, uniqueFunc: useUniqueFunc(null) })

function submitForm (formEl?: FormInstance) {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      console.log(formEl.$props.model)
        
    }
    else {
      return false
    }
  })
}
</script>