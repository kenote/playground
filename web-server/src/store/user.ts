import { defineStore } from 'pinia'
import { UserEntitie, AuthToken } from '@/types'

type State = {
  user         ?: UserEntitie | null
  accessToken  ?: string
  refreshToken ?: string
}

export const useUserStore = defineStore('user', {
  state: () => reactive<State>({}),
  getters: {
    userLevel: state => state.user?.group.level ?? 0,
  },
  actions: {
    // 更新 Token
    setToken(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      update_cookie({ accessToken, refreshToken, user: this.user })
    },
    // 
    setUser (user: UserEntitie | null) {
      this.user = user
      update_cookie({ accessToken: this.accessToken, refreshToken: this.refreshToken, user })
    },
    // 存储登录/导出
    setAuth (payload: AuthToken | null) {
      this.user = payload?.user
      this.accessToken = payload?.accessToken
      this.refreshToken = payload?.refreshToken
      update_cookie(payload)
    },
    // 更改 Email
    setEmail (email: string) {
      if (!this.user) return
      this.user.email = email
      this.user.binds = Array.from(new Set([...this.user.binds, 'email']))
    },
    // 更改 Mobile
    setMobile (mobile: string) {
      if (!this.user) return
      this.user.mobile = mobile
      this.user.binds = Array.from(new Set([...this.user.binds, 'mobile']))
    },
    // 更改头像
    setAvatar (avatar: string) {
      if (!this.user) return
      this.user.avatar = avatar
    },
  },
  persist: true
})

function update_cookie (payload: Partial<AuthToken> | null) {
  const auth = useCookie('auth')
  auth.value = JSON.stringify(payload)
}