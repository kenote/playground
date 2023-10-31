import { CommonDataNode } from '@kenote/common'
import { Channel, NavMenu, RequestConfig, SubmitActionOptions } from './base'

export declare type AccountConfigure = {
  invitation  ?: boolean
  navigator   ?: Channel.DataNode[]
  authpanel   ?: AuthPanel
  navOpts     ?: NavOptions
  setting     ?: PageSetting
}

type AuthPanel = {
  top         ?: NavMenu.DataItem[]
  main        ?: NavMenu.DataItem[]
  trigger     ?: string
}

type NavOptions = {
  name         : string
  types        : Pick<CommonDataNode, 'key' | 'name'>[]
  group        : string[][]
  trigger     ?: string
}

export declare type PageSetting = {
  layout      ?: string
  middleware  ?: string | string[]
  style       ?: string
  views       ?: ViewItem[]
  env         ?: Record<string, any>
  wrapper     ?: Wrapper
  actions     ?: Record<string, Action>
  initial     ?: string[]
}

type ViewItem = {
  name         : string
  component    : string
  options     ?: Record<string, any>
  children    ?: ViewItem[]
}

type Wrapper = {
  name         : string
  options     ?: Record<string, any>
}

type Action = {
  request      : RequestConfig
  options     ?: SubmitActionOptions
  confirm     ?: Confirm
}

type Confirm = {
  title       ?: string
  message      : string
  cancel      ?: string
}