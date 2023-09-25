import { defineStore } from 'pinia'
import type { AccountConfigure, PageSetting } from '@/types'

type State = AccountConfigure & {
  current ?: string
}

export const useAccountStore = defineStore('account', {
  state: () => reactive<State>({
    navigator: [],
    current: '',
    invitation: false,
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
    }
  }
})