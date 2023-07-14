import { Context, Controller, NextHandler, Post, Get } from '@kenote/core'
import * as Store from '~/services/store'
import { authenticate } from '~/plugins/passport'
import { httpError, logger, nextError , ErrorCode} from '~/services'
import path from 'path'
import { keys } from 'lodash'

@Controller()
export default class StoreController {

  @Post('/upload', )
  @Post('/upload/:type', { filters: authenticate })
  async upload (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    let { dir } = ctx.query
    try {
      let store = Store.store(type)(ctx.req)
      if (!store) {
        return await ctx.notfound()
      }
      let filePath = Store.getSavePath(type, dir, ctx.user!)
      let putStream = Store.putStreams?.[store.type??'local']
      if (!putStream) {
        throw httpError(ErrorCode.ERROR_MISSING_CONFIG_PARAMETER)
      }
      let result = await store.upload(putStream, httpError, filePath)
      if (result.length === 0) {
        throw httpError(ErrorCode.ERROR_UPLOAD_NOT_FILE)
      }
      result = result.map(Store.parsePutResul(ctx))
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Get('/uploadfiles/:filename')
  @Get('/uploadfiles/:type/:filename')
  async download (ctx: Context, next: NextHandler) {
    let { type, filename } = ctx.params
    let { dir } = ctx.query
    let { root_dir } = Store.getOptions(type)
    let mode: 'preview' | 'download' = keys(ctx.query).includes('download') ? 'download' : 'preview'
    try {
      if (!root_dir) {
        return await ctx.notfound()
      }
      let rootDir = path.resolve(process.cwd(), root_dir!, String(dir ?? '').replace(/^\//, ''))
      let filePath = path.resolve(rootDir, filename)
      return ctx.sendStream(filePath, { mode })
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}