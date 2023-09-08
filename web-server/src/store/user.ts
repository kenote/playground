import { defineStore } from 'pinia'
import { UserEntitie, AuthToken } from '@/types'

type State = {
  user         ?: UserEntitie | null
  accessToken  ?: string
  refreshToken ?: string
  refreshing   ?: boolean
}

export const useUserStore = defineStore('auth', {
  state: () => reactive<State>({
    refreshing: false,
    accessToken: '',
    refreshToken: '',
    user: null
  }),
  getters: {
    userLevel: state => state.user?.group.level ?? 0,
  },
  actions: {
    // 更新 Token
    setToken(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.refreshing = false
    },
    // 设置刷新 Token 状态
    setRefresh() {
      this.refreshing = true
    },
    // 更新用户信息
    setUser (user: UserEntitie | null) {
      this.user = user
    },
    // 存储登录/导出
    setAuth (payload: AuthToken | null) {
      this.user = payload?.user
      this.accessToken = payload?.accessToken
      this.refreshToken = payload?.refreshToken
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