import { useUserStore } from '~/store/user'
import type { AccessToken } from '@/types'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useUserStore()
  const { url_callback } = to.query
  
  try {
    const { data } = await useHttpProxy<AccessToken>('/api/uc/account/accesstoken', { interceptor: true })
    store.setUser(data ?? null)
  } catch (error) {
    if (!store.refreshing) {
      store.setUser(null)
    }
  }
  
  if (store.user && url_callback) {
    return navigateTo(url_callback)
  }
  
})