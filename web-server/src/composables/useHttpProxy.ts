import axios from 'axios'
import { HttpClient } from '@kenote/common'
import { defu } from 'defu'
import type { HttpClientOptions, HttpResult, AuthToken } from '@/types'
import { useUserStore } from '~/store/user'

const REFRESH_TOKEN_API= 'api/uc/account/refresh_token'

/**
 * Http 请求代理
 * @param url 请求 URL
 * @param options 选项
 * @returns 
 */
export async function useHttpProxy<T extends any> (url: string, options?: HttpClientOptions) {
  const config = useRuntimeConfig()
  const state = useUserStore()
  const defaults: HttpClientOptions = {
    baseURL: config.public.apiBase,
    token: state.accessToken,
    timeout: 3000
  }
  const params = defu(options, defaults)
  const instance = getAxiosInstance(options?.interceptor)
  const client = new HttpClient(instance, params)
  return await client?.[options?.method??'GET']?.<HttpResult<T>>(url, options?.data) ?? {}
}

/**
 * 获取 Axios 实例
 * @param interceptor 是否启用拦截器
 * @returns 
 */
function getAxiosInstance (interceptor?: boolean) {
  if (!interceptor) return axios
  const state = useUserStore()
  const instance = axios.create()
  // 401 Unauthorized 请求拦截
  instance.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
  )
  // 401 Unauthorized 响应拦截
  instance.interceptors.response.use(
    response => response,
    async error => {
      let originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        let params: HttpClientOptions = {
          method: 'PUT',
          data: {
            refreshToken: state.refreshToken,
            uid: state.user?._id
          }
        }
        let { data } = await useHttpProxy<AuthToken>(REFRESH_TOKEN_API, params)
        if (data?.accessToken) {
          let { accessToken, refreshToken } = data
          state.setToken(accessToken, refreshToken)
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          originalRequest.headers.authorization = `Bearer ${accessToken}`
          return instance(originalRequest)
        }
      }
      return Promise.reject(error)
    }
  )
  return instance
}