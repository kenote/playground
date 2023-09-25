import { useAccountStore } from '~/store/account'
import type { AccountConfigure } from '@/types'
import { getChannelKey } from '@kenote/common'

export default defineNuxtRouteMiddleware(async (to) => {
  const store = useAccountStore()
  const configure = await useSetting<AccountConfigure>('/api/uc/account')
  store.setConfigure(configure)

  const { navigator } = useAccountStore()
  const channelId = getChannelKey(navigator??[], to.path, 'route')
    ?? navigator?.find( v => v.route == to.path )?.key
  if (!channelId) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  const setting = await usePage(to.path)
  store.setPageSetting(setting)
})