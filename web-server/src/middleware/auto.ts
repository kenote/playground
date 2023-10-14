
import { useAccountStore } from '../store/account'
import authMiddleware from './auth'
import type { RouteMiddleware } from 'nuxt/app'
import { isArray } from 'lodash'

const middlewares: Record<string, RouteMiddleware> = {
  auth: authMiddleware
}

export default defineNuxtRouteMiddleware( (to, from) => {
  const { setting } = useAccountStore()
  setPageLayout(setting?.layout??'default')
  if (setting?.middleware) {
    let names = isArray(setting.middleware) ? setting.middleware : [setting.middleware]
    for (let item of names) {
      middlewares?.[item]?.(to, from)
    }
  }
})