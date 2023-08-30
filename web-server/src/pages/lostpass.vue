<!-- Page::Lostpass -->
<template>
  <div class="account-body min-h-10 p-8 w-[380px]">
    <h1 class="text-center pb-8 m-0">重置密码</h1>
    <account-verify @submit="handleSubmit" />
    <div class="border-0 border-t border-[#dcdfe6] border-solid pt-[24px] text-center text-warm-gray-500">
      还没有会员？<NuxtLink to="/register">创建新账户</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'account'
})


const handleSubmit = (values: any) => {
  console.log('values', values)
}

</script>
