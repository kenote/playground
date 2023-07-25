import { Context } from '@kenote/core'
import type { HttpError } from 'http-errors'
import * as DB from './service/db'

export { HttpError }

export declare interface Restful {

  api<T = any> (data: T, error?: HttpError): void

  notfound (): Promise<void>

  clientIP: string

  jwToken: string

  jwtlogin (user: DB.user.User): Promise<DB.user.SafeUser>

  getUser (): Promise<DB.user.SafeUser | undefined | null>

  filterUserLevel (level: number, minlevel: number): Promise<void>

  sendStream (content: string, options?: StreamOptions): Context
}

export declare interface StreamOptions {
  mode          : 'preview' | 'stream' | 'download'
  contentType  ?: string
}

export declare type PageRequest = {
  page      ?: number
  size      ?: number
  sort      ?: string[]
}