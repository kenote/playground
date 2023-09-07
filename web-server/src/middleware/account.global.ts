import { useAccountStore } from '~/store/account'
import type { AccountConfigure } from '@/types'

export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useSetting<AccountConfigure>('/api/uc/account') ?? {}
  useAccountStore().setConfigure(data)
})