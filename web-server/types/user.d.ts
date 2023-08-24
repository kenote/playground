import { FilterQuery } from '@kenote/common'
import { BaseEntitie } from './base'

export declare interface UserEntitie extends BaseEntitie {
  username     : string
  nickname    ?: string
  avatar      ?: string
  sex          : number
  email       ?: string
  mobile      ?: string
  binds        : string[]
  create_at    : Date
  update_at    : Date
  group        : GroupEntitie
}

export declare interface GroupEntitie extends BaseEntitie {
  name         : string
  level        : number
  description ?: string
  plot        ?: string
}

export declare type AuthToken = {
  user        ?: UserEntitie
  accessToken  : string
  refreshToken : string
}

export declare interface PlotItem<T = any> {
  path         : string
  permissions  ?: string[]
  filters      ?: Record<string, FilterQuery<T>>
}