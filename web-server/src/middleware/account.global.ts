import { useAccountStore } from '~/store/account'
import type { AccountConfigure, PageSetting } from '@/types'
import { getChannelKey } from '@kenote/common'

export default defineNuxtRouteMiddleware(async (to) => {
  const store = useAccountStore()
  const configure = await useSetting<AccountConfigure>('/api/uc/account')
  store.setConfigure(configure)
  
  const channelId = getChannelKey(store.navigator??[], to.path, 'route')
    ?? store.navigator?.find( v => v.route == to.path )?.key
  if (!channelId && !store.pages?.includes(to.path)) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  
  const channel = store.currentChannel
  if (channel?.route == to.path?.replace(/\/$/, '') && channel?.index) {
    return navigateTo(channel.route + channel.index)
  }
  
  if (!store.pages?.includes(to.path)) {
    const setting = await usePage<PageSetting>(to.path)
    store.setPageSetting(setting??{})
  }
})