import { defineStore } from 'pinia'
import type { AccountConfigure, PageSetting } from '@/types'

type State = AccountConfigure & {
  current   ?: string
  pages     ?: string[]
  timestamp ?: number
  loading   ?: boolean
}

export const useAccountStore = defineStore('account', {
  state: () => reactive<State>({
    navigator: [],
    current: '',
    invitation: false,
    pages: ['/', '/login', '/register', '/lostpass'],
    setting: {},
    timestamp: 0,
    loading: false
  }),
  getters: {
    currentChannel: state => state.navigator?.find( v => v.key == state.current )
  },
  actions: {
    setConfigure (config?: AccountConfigure) {
      this.invitation = config?.invitation
      this.navigator = updateNavigatorRoute(config?.navigator)
      this.authpanel = config?.authpanel
      this.navOpts = config?.navOpts
    },
    async selectChannel (channel?: string) {
      this.current = channel
    },
    setPageSetting (setting: PageSetting) {
      this.setting = setting
      this.timestamp = Date.now()
    },
    refresh () {
      this.timestamp = Date.now()
    },
    setLoading (value: boolean) {
      this.loading = value
    }
  }
})