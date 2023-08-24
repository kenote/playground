import { AxiosRequestConfig } from 'axios'
import { HttpClient, HeaderOptions } from '@kenote/common'

export declare type HttpClientOptions = HeaderOptions<AxiosRequestConfig> & { 
  method      ?: keyof HttpClient,
  data        ?: any
  interceptor ?: boolean
}

export declare interface HttpResult<T> {
  data   ?: T
  error  ?: string
}