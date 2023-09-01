import type { HttpClient } from "@kenote/common"
import { get } from 'lodash'

type UniqueOptions = {
  url     ?: string
  method  ?: keyof HttpClient
  params  ?: any
}

/**
 * 查询名称占用
 * @param user 
 * @param options 
 * @returns 
 */
export function useUniqueFunc (user: any, options: UniqueOptions = {}) {
  return async (name: string, path: string | null, type: string) => {
    let url = parseTemplate(options.url??'/api/uc/account/check/{{type}}', { type })
    try {
      let { data, error } = await useHttpProxy<boolean>(url, {
        method: <keyof HttpClient>options.method ?? 'PUT',
        data: parseParams(options.params??{ name: '{{name}}' })({ name, uid: get(user, path??'_id') })
      })
      if (error) return false
      return data
    } catch (error) {
      return true
    }
  }
}