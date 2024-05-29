import { useAccountStore } from '../store/account'
import authMiddleware from './auth'
import type { RouteMiddleware } from 'nuxt/app'
import { isArray } from 'lodash'
import { getChannelKey } from '@kenote/common'
import { useRouter, useRoute } from 'vue-router'

const middlewares: Record<string, RouteMiddleware> = {
  auth: authMiddleware
}

export default defineNuxtRouteMiddleware( (to, from) => {
  const { setting, navigator } = useAccountStore()
  const channelId = getChannelKey(navigator??[], to.path, 'route')
  if (!channelId) {
    useAccountStore().setPageSetting(null)
  }
  setPageLayout(<any>setting?.layout??'default')
  if (setting?.middleware) {
    let names = isArray(setting.middleware) ? setting.middleware : [setting.middleware]
    for (let item of names) {
      middlewares?.[item]?.(to, from)
    }
  }
})