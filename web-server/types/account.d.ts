import { CommonDataNode } from '@kenote/common'
import { Channel, NavMenu, RequestConfig, SubmitActionOptions } from './base'

export declare type AccountConfigure = {
  invitation  ?: boolean
  navigator   ?: Channel.DataNode[]
  authpanel   ?: AuthPanel
  navOpts     ?: NavOptions
  setting     ?: PageSetting
}

export declare type PlotOptions = {
  name          : string
  pages         : PagePlot[]
}

type PagePlot = {
  path          : string
  permissions  ?: string[]
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
  pathname    ?: string
}

export declare type ViewItem = {
  name         : string
  component    : string
  options     ?: Record<string, any>
  children    ?: ViewItem[]
}

export declare type Wrapper = {
  name         : string
  options     ?: Record<string, any>
}

export declare type Action = {
  request      : RequestConfig
  options     ?: SubmitActionOptions
  confirm     ?: Confirm
}

export declare type Confirm = {
  title       ?: string
  message      : string
  cancel      ?: string
}