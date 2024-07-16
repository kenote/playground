import RPCClient from '@alicloud/pop-core'
import type { AlicloudConfigure } from '~/types/config/alicloud'
import { loadConfig } from '@kenote/config'
import ruleJudgment from 'rule-judgment'
import logger from './logger'

/**
 * 请求选项
 */
export const requestOption = {
  method: 'POST'
}

/**
 * 创建客户端
 * @param options 
 * @returns 
 */
export function createClient (options: AlicloudConfigure.Options) {
  let { sdks, accessKeys } = loadConfig<AlicloudConfigure>('config/alicloud', { mode: 'merge' })
  let { endpoint, apiVersion, opts } = sdks?.find(ruleJudgment({ key: options.sdk })) ?? {}
  let { accessKeyId, accessKeySecret } = accessKeys?.find(ruleJudgment({ key: options.accessKey })) ?? {}
  let config: RPCClient.Config = {
    accessKeyId: accessKeyId ?? '',
    accessKeySecret: accessKeySecret ?? '',
    endpoint: endpoint ?? '',
    apiVersion: apiVersion ?? '',
    opts
  }
  return new RPCClient(config)
}

/**
 * 封装请求
 * @param action 
 * @param params 
 * @param options 
 * @returns 
 */
export function request<T>(action: string, params: Object, options?: Object) {
  return async (IOptions: AlicloudConfigure.Options) => {
    let client = createClient(IOptions)
    try {
      let reslut = await client.request<T>(action, params, options)
      logger.info(action, params)
      logger.info(reslut)
      return reslut
    } catch (error) {
      logger.error(error?.message)
    }
  }
}