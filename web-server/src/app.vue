<template>
  <NuxtLayout>
    <!-- <NuxtWelcome /> -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { UserEntitie, AuthToken } from '@/types'
import { useUserStore } from '~/store/user'
import type { AccountConfigure } from '@/types'
import { useAccountStore } from '~/store/account'

const auth = useCookie<AuthToken | null>('auth').value
const store = useUserStore()
store.setAuth(auth)

if (auth?.accessToken) {
  try {
    let { data } = await useHttpProxy<UserEntitie>('/api/uc/account/accesstoken', { 
      token: auth?.accessToken, 
      interceptor: true 
    })
    store.setUser(data ?? null)
  } catch (error) {
    
  }
}

const { data: account } = await useSetting<AccountConfigure>('/api/uc/account') ?? {}
useAccountStore().setConfigure(account)
</script>