import { FormItemType, FormItemOptions, PropDataItem, RequestConfig } from '../base'

export declare type FormItemProps = {
  type          ?: FormItemType
  placeholder   ?: string | string[]
  modelValue    ?: any
  disabled      ?: boolean
  options       ?: FormItemOptions
  width         ?: number | string
  height        ?: number | string
  size          ?: Size
  data          ?: Array<Partial<PropDataItem> & { [x: string]: any }> | string | RequestConfig
  props         ?: Partial<Record<keyof PropDataItem, string> & { [x: string]: any }>
  format        ?: string
  valueFormat   ?: string
}