<!-- Layout::Panel -->
<template>
  <div class="page-main">
    <header>
      <div class="header-start">
        <div class="header-link-box w-[56px]">
          <a class="header-link header-link-icon" @click="handleCollapse">
            <i class="iconfont" v-bind:class="collapse ? 'icon-menu-fold' : 'icon-menu-unfold'"></i>
          </a>
        </div>
        <div class="header-link-box w-[202px]">
          <NuxtLink to="/" class="header-link logo" target="_blank">
            <el-image src="/images/logo.png" class="h-6" />
          </NuxtLink>
        </div>
        <dropdown-service
          :name="account.navOpts?.name??`产品与服务`"
          :trigger="account.navOpts?.trigger"
          :group="account.navOpts?.group??[]"
          :navigator="toTypeNavigator(account.navigator??[], account.navOpts?.types)"
          @command="handleCommand"
          />
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
        <navigation-breadcrumb :navigator="account.currentChannel" :route-path="route.path" >
          <el-button v-if="pageSetting?.refresh" @click="handleCommand('command:refresh')">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </navigation-breadcrumb>
        <el-scrollbar>
          <slot></slot>
        </el-scrollbar>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { NavMenu, Channel } from '@/types/base'
import { runCommand } from '~/utils/command'
import { ChannelDataNode, dataNodeProxy, getChannelKey } from '@kenote/common'
import { useAccountStore } from '~/store/account'
import { useUserStore } from '~/store/user'
import { Refresh } from '@element-plus/icons-vue'
import type { PageSetting } from '@/types'

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


const collapse = ref<boolean>(false)
const pageSetting = ref<Channel.DataNode>()

// await new Promise((resolve) => setTimeout(resolve, 1000))

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
  let channel = account.navigator?.find( v => v.route == routePath )
  let channelId = getChannelKey(account.navigator??[], routePath, 'route') 
    ?? channel?.key
  if (channel?.route == routePath && channel.index) {
    router.push(channel.route + channel.index)
  }
  pageSetting.value = dataNodeProxy(account.navigator??[])?.find({ route: routePath })
  if (channelId == account.currentChannel?.key) return
  await account.selectChannel(channelId)
}

function handleCommand (value: string, row?: any) {
  return runCommand(self, {
    bookmark: () => {
      console.log('bookmark')
    },
    refresh: () => {
      console.log('refresh')
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