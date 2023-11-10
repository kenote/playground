import type { HttpClient } from "@kenote/common"
import { get } from 'lodash'
import type { RequestConfig } from '@/types/base'

/**
 * 查询名称占用
 * @param user 
 * @param options 
 * @returns 
 */
export function useUniqueFunc (env: any, options: Partial<RequestConfig> = {}) {
  return async (name: string, path: string | null, type: string) => {
    let url = parseTemplate(options.url??'/api/uc/account/check/{{type}}', { type })
    let { user } = env ?? {}
    try {
      let { data, error } = await useHttpProxy<boolean>(url, {
        headers: options.headers,
        method: <keyof HttpClient>options.method ?? 'PUT',
        data: parseParams(options.data??{ name: '{{name}}' })({ name, uid: get(user, path??'_id'), ...env })
      })
      if (error) return false
      return data
    } catch (error) {
      return true
    }
  }
}