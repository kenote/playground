import { defineStore } from 'pinia'
import type { AccountConfigure } from '@/types'

export const useAccountStore = defineStore('account', {
  state: () => reactive<AccountConfigure>({}),
  actions: {
    setConfigure (config?: AccountConfigure) {
      this.invitation = config?.invitation
    }
  }
})