import { loadConfig } from '@kenote/config'
import { UploadStoreOptions, uploadStore, PutStreamFunction, putStream, PutStreamOptions, NextPutResult, PutResult } from '@kenote/upload'
import { ErrorCode } from './error'
import { BaseInfo } from '~/types/config'
import type { IncomingMessage } from 'http'
import { compact, isArray } from 'lodash'
import type * as DB from '~/types/service/db'
import type { Context } from '@kenote/core'
import path from 'path'
import type { ServerConfigure } from '~/types/config'
import type { StreamOptions } from '~/types/restful'
import ruleJudgment from 'rule-judgment'

const storeErrors: Record<'limit' | 'mimetype', number> = {
  limit     : ErrorCode.ERROR_UPLOAD_FILESIZE_LARGEMAX,
  mimetype  : ErrorCode.ERROR_UPLOAD_FILE_MIMETYPE
}

interface StoreBaseInfo extends BaseInfo {
  userDir  ?: boolean
}

export const getOptions = (name: string = 'default') => {
  let stores = loadConfig<Record<string, UploadStoreOptions<StoreBaseInfo>>>('config/store', { mode: 'merge' })
  for (let [key] of Object.entries(stores)) {
    stores[key].errors = storeErrors
  }
  return stores?.[name] ?? stores?.['default']
}

export const store = (name: string) => (req: IncomingMessage) => {
  let options = getOptions(name)
  if (!options) {
    return null
  }
  return uploadStore(options, req)
}

export const putStreams: Record<string, PutStreamFunction> = {
  'local': putStream,
  // 'oss': (stream: NodeJS.ReadStream, options: PutStreamOptions<{ key: string }>, done: NextPutResult) => {
  //   // 
  // }
}

export function getSavePath (type: string, dir: string | string[], user: DB.user.SafeUser) {
  let filePath = (isArray(dir) ? dir[0] : dir) ?? ''
  let { userDir } = getOptions(type)
  if (userDir) {
    let dirArr = compact([ filePath ])
    dirArr?.push(user?._id)
    filePath = dirArr.join('/')
  }
  return filePath
}

export function parsePutResul (ctx: Context) {
  return (result: PutResult) => {
    let { url } = result
    if (/^(\/)/.test(result.url)) {
      result.url = `${ctx.protocol}://${ctx.headers.host}${url}`
    }
    return result
  }
}

export function getContentType (filename: string, options: StreamOptions) {
  let contentType = options.contentType
  let { previewTypes } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
  if (options.mode === 'preview') {
    let extname = path.extname(filename)
    let filter = ruleJudgment<ServerConfigure.FileType>({ extname: { $_in: [extname] } })
    contentType = previewTypes?.find(filter)?.type ?? contentType
  }
  return contentType ?? 'application/octet-stream'
}