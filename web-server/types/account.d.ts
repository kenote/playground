import { CommonDataNode } from '@kenote/common'
import { Channel, NavMenu } from './base'

export declare type AccountConfigure = {
  invitation  ?: boolean
  navigator   ?: Channel.DataNode[]
  authpanel   ?: AuthPanel
  navOpts     ?: NavOptions
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