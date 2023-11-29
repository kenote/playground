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
          :plots="auth.plots"
          :user="auth.user"
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
      <div class="sidebar" @contextmenu.prevent>
        <navigation-sidebar v-if="getNavigator(account.currentChannel)" 
          :data="getNavigator(account.currentChannel)?.children" 
          :plots="auth.plots"
          :user="auth.user"
          :default-active="route.path">
          <template #header>
            <div class="sidebar-header">
              <i v-if="getNavigator(account.currentChannel)?.icon" v-bind:class="getNavigator(account.currentChannel)?.icon"></i>
              <span>{{ getNavigator(account.currentChannel)?.name }}</span>
            </div>
          </template>
        </navigation-sidebar>
      </div>
      <div class="warpper">
        <navigation-breadcrumb :navigator="getNavigator(account.currentChannel)" :route-path="route.path" >
          <el-button v-if="pageSetting?.refresh" @click="handleCommand('command:refresh')">
            <el-icon v-bind:class="account.loading ? 'is-loading' : ''"><Refresh /></el-icon>
          </el-button>
        </navigation-breadcrumb>
        <client-only placeholder="loading...">
          <slot v-if="isPermission(auth.userLevel, permissions)('access')"></slot>
          <el-empty v-else class="mt-30" >
            <template #description>
              <h3 class="text-3xl text-dark-100">403 Forbidden</h3>
              <p class="!text-dark-100">您尚未获得该页面的访问权限</p>
            </template>
          </el-empty>
        </client-only>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { Channel } from '@/types/base'
import { runCommand } from '~/utils/command'
import { dataNodeProxy, getChannelKey } from '@kenote/common'
import { useAccountStore } from '~/store/account'
import { useUserStore } from '~/store/user'
import { Refresh } from '@element-plus/icons-vue'

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
const permissions = ref<string[]>()

const loading = ref(false)

watch(
  () => route.path,
  async (value, oldVal) => {
    if (value == oldVal) return
    loading.value = true
    await updateChannel(value)
    permissions.value = getRoutePlot(value, auth.plots)
  },
  { immediate: true }
)

const self = {
  router
}

async function updateChannel (routePath: string) {
  let channelId = getChannelKey(account.navigator??[], routePath, 'route')
  pageSetting.value = dataNodeProxy(account.navigator??[])?.find({ route: routePath })
  loading.value = false
  if (channelId == account.currentChannel?.key) return
  await account.selectChannel(channelId)
}

function getNavigator (navigator?: Channel.DataNode) {
  if (navigator) return navigator
  let channelId = getChannelKey(account.navigator??[], route.path, 'route')
  return account.navigator?.find( v => v.key == channelId )
}

function handleCommand (value: string, row?: any) {
  return runCommand(self, {
    bookmark: () => {
      console.log('bookmark')
    },
    refresh: () => {
      account.refresh()
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