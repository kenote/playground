import { useUserStore } from '~/store/user'
import type { UserEntitie, AuthToken } from '@/types'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useCookie<AuthToken | null>('auth').value
  const store = useUserStore()
  store.setAuth(auth)
  
  if (auth?.accessToken) {
    try {
      const { data } = await useHttpProxy<UserEntitie>('/api/uc/account/accesstoken', {
        token: auth?.accessToken, 
        interceptor: true
      })
      store.setUser(data ?? null)
      if (!store.user) {
        return navigateTo(`/login?url_callback=${to.fullPath}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      }
    }
  }
  else {
    return navigateTo(`/login?url_callback=${to.fullPath}`)
  }
})