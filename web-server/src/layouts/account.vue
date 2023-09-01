<!-- Layout::Account -->
<template>
  <div class="page-main">
    <div class="main-body">
      <div class="container flex justify-center">
        <div class="warpper my-10">
          <div class="account-header flex items-center justify-center h-24 pb-12">
            <el-image src="/images/logo.png" class="h-12" />
          </div>
          <slot ></slot>
        </div>
      </div>
    </div>
    <div class="text-center h-7 p-0 m-0 leading-6">Powered by Kenote.js</div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Account',
  link: [
    { }
  ],
  bodyAttrs: {
    id: 'account-layout'
  }
})
</script>

<style lang="less">
@import url('~/assets/less/account/layout.less');
</style>