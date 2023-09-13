<!-- Layout::Panel -->
<template>
  <div class="page-main">
    <header>
      <div class="header-start">
        <div class="header-link-box">
          <NuxtLink to="/" class="header-link logo" target="_blank">
            <el-image src="/images/logo.png" class="h-6" />
          </NuxtLink>
        </div>
      </div>
      <div class="header-end">

        <dropdown-auth
          :top="account.authpanel?.top" 
          :main="account.authpanel?.main"
          @command="handleCommand"
          />
      </div>
    </header>
    <div class="bodyer">
      <div class="sidebar">
        <navigation-sidebar :data="account.currentChannel?.children" :default-active="route.path">
          <template #header>
            <div class="sidebar-header">
              <span>{{ account.currentChannel?.name }}</span>
            </div>
          </template>
        </navigation-sidebar>
      </div>
      <div class="warpper">
        <slot></slot>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { NavMenu } from '@/types/base'
import { runCommand } from '~/utils/command'
import { ChannelDataNode, getChannelKey } from '@kenote/common'
import { useAccountStore } from '../store/account';

useHead({
  title: 'Panel',
  link: [
    { }
  ],
  bodyAttrs: {
    id: 'panel-layout'
  }
})

const route = useRoute()
const router = useRouter()
const account = useAccountStore()
await updateChannel(route.path)

watch(
  () => route.path,
  async (value, oldVal) => {
    if (value == oldVal) return
    await updateChannel(value)
  },
  { immediate: true }
)

const self = {
  router
}

async function updateChannel (routePath: string) {
  let channelId = getChannelKey(account.navigator??[], routePath, 'route')
  if (channelId == account.currentChannel?.key) return
  await account.selectChannel(channelId)
}

function handleCommand (value: string, row?: any) {
  return runCommand(self, {
    bookmark: () => {
      console.log('bookmark')
    }
  })(value, row)
  
}
</script>

<style lang="less">
@import url('~/assets/less/panel/layout.less');
</style>