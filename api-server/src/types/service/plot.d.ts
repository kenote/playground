import { Method, FilterQuery } from '@kenote/common'
import { BaseInfo } from '../config'

export declare type Plot<T> = BaseInfo & {
  key           : string
  channels      : Plot.ChannelOptions<T>[]
  apis          : Plot.APIOptions[]
}

export declare namespace Plot {
  type APIOptions = {
    path          : string
    method       ?: Array<Method | string>
  }
  
  type PageOptions<T> = {
    path          : string
    permissions  ?: string[]
    filters      ?: Record<string, FilterQuery<T>>
  }
  
  type ChannelOptions<T> = {
    name          : string
    pages         : PageOptions<T>[]
    api           : APIOptions[]
  }
}