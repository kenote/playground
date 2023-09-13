import { defineStore } from 'pinia'
import type { AccountConfigure } from '@/types'

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
    },
    async selectChannel (channel?: string) {
      this.current = channel
    }
  }
})