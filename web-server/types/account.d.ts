
import { Channel, NavMenu } from './base'

export declare type AccountConfigure = {
  invitation  ?: boolean
  navigator   ?: Channel.DataNode[]
  authpanel   ?: AuthPanel
}

type AuthPanel = {
  top         ?: NavMenu.DataItem[]
  main        ?: NavMenu.DataItem[]
}