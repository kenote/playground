import * as aliclound from './alicloud'
import type { AlicloudConfigure } from '~/types/config/alicloud'
import { loadConfig } from '@kenote/config'
import type { SMSConfigure } from '~/types/config/sms'
import ruleJudgment from 'rule-judgment'

/**
 * 发送短信
 * @param mobile 
 * @param template 
 * @param params 
 * @param sdkname
 * @returns 
 */
export async function send (mobile: string, template: keyof SMSConfigure.Templete, assign: object, sdkname?: string) {
  let { usage, sdks } = loadConfig<SMSConfigure>('config/sms', { mode: 'merge' })
  let sdk = sdks.find(ruleJudgment({ key: sdkname ?? usage }))
  if (sdk?.type == 'alicloud') {
    let options: AlicloudConfigure.Options = {
      accessKey: sdk.sign,
      sdk: 'dysms'
    }
    let params = {
      PhoneNumbers: mobile,
      SignName: sdk.name,
      TemplateCode: sdk.tpls?.[template],
      TemplateParam: JSON.stringify(assign)
    }
    return await aliclound.request('SendSms', params, aliclound.requestOption)(options)
  }
}