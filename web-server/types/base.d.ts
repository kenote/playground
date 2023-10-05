import { FilterData } from 'parse-string'
import { ChannelDataNode, HttpClient } from '@kenote/common'
import { CSSProperties } from 'vue'
import { IncomingHttpHeaders } from 'http'

export declare interface BaseEntitie {
  _id     : string
  id      : number
}

export declare namespace Verify {

  type Rule = Partial<Omit<FilterData.rule, 'validator'>> & Verify.PlusFields

  type Validator = (rule: any, value: any, done: (message?: string) => any) => (message?: string) => any
  type PromiseValidtor = (rule: any, value: any, done: (message?: string) => any) => Promise<(message?: string) => any>

  interface PlusFields {
    type          ?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'data' | 'url' | 'hex' | 'email'
    trigger       ?: 'blur' | 'change' | Array<'blur' | 'change'>
    validator     ?: Validator | PromiseValidtor | Array<string | number | boolean | null>
  }
}

export declare namespace Command {

  type type = 'dialog' | 'action' | 'command' | 'router' | 'http'

  interface value<T> {
    type     : type | T
    path     : string
  }
}

export declare namespace NavMenu {

  interface DataItem extends BaseInfo {
    key          ?: string
    link         ?: string
    icon         ?: string
    divided      ?: booleanboolean
    buttons      ?: DataItem[]
  }

}

export declare type Size = 'large' | 'default' | 'small'

type Mark = {
  style   : CSSProperties
  label   : string
}

export declare type FormItemType = 'text'
| 'password' 
| 'number'
| 'textarea'
| 'radio' | 'radio-button'
| 'checkbox' | 'checkbox-button'
| 'select' | 'select-v2'
| 'year' | 'years' | 'month' | 'months' | 'date' | 'dates' | 'week' | 'datetime' | 'time' 
| 'datetimerange' | 'daterange' | 'monthrange' | 'timerange'
| 'cascader' | 'cascader-panel'
| 'switch' | 'slider'
| 'color-picker'
| 'rate'
| 'transfer'

export declare type FormItemOptions = {
  clearable          ?: boolean
  showWordLimit      ?: number
  showPassword       ?: boolean
  resize             ?: 'none' | 'both' | 'horizontal' | 'vertical'
  rows               ?: number
  autosize           ?: boolean | { minRows?: number, maxRows?: number }
  step               ?: number
  precision          ?: number
  stepStrictly       ?: boolean
  controlsPosition   ?: '' | 'right'
  controls           ?: boolean
  filterable         ?: boolean
  filterMethod       ?: Function | string
  allowCreate        ?: boolean
  multiple           ?: boolean
  multipleLimit      ?: number
  collapseTags       ?: boolean
  maxCollapseTags    ?: number
  template           ?: string
  editable           ?: boolean
  // date-picker
  arrowControl       ?: boolean
  defaultTime        ?: string
  shortcuts          ?: Shortcut[]
  disabledDate       ?: string[] | FilterQuery<any>
  holidays           ?: string[]
  disabledTime       ?: string[][]
  separator          ?: string
  // cascader
  emitPath           ?: boolean
  // switch
  activeText         ?: string
  inactiveText       ?: string
  activeValue        ?: boolean | string | number
  inactiveValue      ?: boolean | string | number
  // slider
  showInput          ?: boolean
  inputSize          ?: Size
  showStops          ?: boolean
  showTooltip        ?: boolean
  range              ?: boolean
  vertical           ?: boolean
  marks              ?: Record<number, Mark | string>
  // color-picker
  showAlpha          ?: boolean
  predefine          ?: string[]
  colorFormat        ?: 'hsl' | 'hsv' | 'hex' | 'rgb' | 'hex' | 'rgb'
  // rate
  allowHalf          ?: boolean
  lowThreshold       ?: number
  highThreshold      ?: number
  colors             ?: string[] | Record<number, string>
  showText           ?: boolean
  showScore          ?: boolean
  textColor          ?: string
  texts              ?: string[]
  // transfer
  titles             ?: string[]
  buttonTexts        ?: string[]
  // 右侧列表元素的排序策略： 若为 original，则保持与数据源相同的顺序； 若为 push，则新加入的元素排在最后； 若为 unshift，则新加入的元素排在最前
  targetOrder        ?: 'original' | 'push' | 'unshift'
  leftDefaultChecked ?: Array<string | number>
  rightDefaultChecked?: Array<string | number>
}

export declare type RequestConfig = {
  url            : string
  method        ?: keyof HttpClient
  headers       ?: IncomingHttpHeaders
  data          ?: any
}

export declare namespace Channel {

  type DataNode = ChannelDataNode<PlusNode>

  interface PlusNode {
    type          ?: string
    tag           ?: string
    refresh       ?: boolean
  }

  type ServiceNode = {
    key            : string
    name          ?: string
    children      ?: Pick<ChannelDataNode<{}>, 'key' | 'name' | 'route'>[]
  }
}

export declare interface BaseInfo {
  name          : string
  description  ?: string
}

export declare interface PropDataItem {
  value         ?: string | number
  label          : string
  disabled      ?: boolean
  children      ?: PropDataItem[]
  content       ?: string
}

export declare type Shortcut = {
  text           : string
  value         ?: Date | string | (() => Date | Date[]) | Array<Date | string>
}