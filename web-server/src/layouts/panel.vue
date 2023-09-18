<!-- Layout::Panel -->
<template>
  <div class="page-main">
    <header>
      <div class="header-start">
        <div class="header-link-box">
          <a class="header-link header-link-icon" @click="handleCollapse">
            <i class="iconfont" v-bind:class="collapse ? 'icon-menu-fold' : 'icon-menu-unfold'"></i>
          </a>
        </div>
        <div class="header-link-box">
          <NuxtLink to="/" class="header-link logo" target="_blank">
            <el-image src="/images/logo.png" class="h-6" />
          </NuxtLink>
        </div>
        <div class="header-link-box">
          <a class="header-link header-link-icon">
            产品与服务<i class="iconfont icon-arrow-down ml-1"></i>
          </a>
        </div>
      </div>
      <div class="header-end">

        <dropdown-auth
          :trigger="account.authpanel?.trigger"
          :username="auth.user?.nickname??auth.user?.username"
          :uid="auth.user?._id"
          :top="account.authpanel?.top" 
          :main="account.authpanel?.main"
          @command="handleCommand"
          />
      </div>
    </header>
    <div class="bodyer" v-bind:class="collapse ? '!left-[-260px]' : ''">
      <div class="sidebar">
        <navigation-sidebar :data="account.currentChannel?.children" :default-active="route.path">
          <template #header>
            <div class="sidebar-header">
              <i v-if="account.currentChannel?.icon" v-bind:class="account.currentChannel?.icon"></i>
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
import { useAccountStore } from '~/store/account'
import { useUserStore } from '~/store/user'

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
const auth = useUserStore()
const account = useAccountStore()
await updateChannel(route.path)

const collapse = ref<boolean>(false)

console.log(
  toTypeNavigator(account.navigator??[])
)

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

function handleCollapse () {
  collapse.value = !collapse.value
}
</script>

<style lang="less">
@import url('~/assets/less/panel/layout.less');
</style>