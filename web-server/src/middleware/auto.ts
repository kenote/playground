import { useAccountStore } from '../store/account'
import authMiddleware from './auth'
import type { RouteMiddleware } from 'nuxt/app'
import { isArray } from 'lodash'
import { getChannelKey } from '@kenote/common'

const middlewares: Record<string, RouteMiddleware> = {
  auth: authMiddleware
}

export default defineNuxtRouteMiddleware( (to, from) => {
  const { setting, navigator } = useAccountStore()
  const channelId = getChannelKey(navigator??[], to.path, 'route')
  if (!channelId) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  setPageLayout(<any>setting?.layout??'default')
  if (setting?.middleware) {
    let names = isArray(setting.middleware) ? setting.middleware : [setting.middleware]
    for (let item of names) {
      middlewares?.[item]?.(to, from)
    }
  }
})