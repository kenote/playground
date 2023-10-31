import { ParseData } from 'parse-string'
import { FormItemColumn, Verify, Size, RequestConfig, SubmitOptions } from '../base'

export declare type FormWrapProps = {
  defaultValues    ?: Record<string, any> | string
  verifyRules      ?: Partial<Record<string, Verify.Rule[]>>
  columns          ?: FormItemColumn[]
  size             ?: Size
  labelWidth       ?: string | number
  labelPosition    ?: 'left' | 'right' | 'top'
  labelSuffix      ?: string
  disabled         ?: boolean
  inline           ?: boolean
  inlineMessage    ?: boolean
  statusIcon       ?: boolean
  hideAsterisk     ?: boolean
  asteriskPosition ?: 'left' | 'right'
  mergeField       ?: Record<string, string[]>
  exclude          ?: string[]
  valueFormat      ?: Record<string, ParseData.format | ParseData.format[]>
  action           ?: RequestConfig
  options          ?: SubmitOptions
  submitName       ?: string
  uniqueOptions    ?: Partial<RequestConfig>
}