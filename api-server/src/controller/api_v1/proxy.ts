import { Context, Controller, NextHandler, Get, Post, Put, Delete } from '@kenote/core'
import { APIProxy, getEntrance, getProxyResponse } from '@kenote/api-proxy'
import { logger, nextError } from '~/services'
import { isPlotAPI, getPlot } from '~/services/plot'
import path from 'path'
import * as nedb from '~/services/nedb'
import * as sqlite from '~/services/sqlite'
import { omit } from 'lodash'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '~/types/config'
import { apilog } from '~/middlewares/restful'
import { readChannelFile } from '~/services/channel'
import createError, { HttpError } from 'http-errors'

@Controller()
export default class ProxyController {
  
  @Get('/:channel/:label?/:tag?')
  @Post('/:channel/:label?/:tag?')
  @Put('/:channel/:label?/:tag?')
  @Delete('/:channel/:label?/:tag?')
  async handler (ctx: Context, next: NextHandler) {
    let { channel, label } = ctx.params
    let { channelOpts } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
    let options: APIProxy.EntranceOptions<any> = {
      channel,
      pathLabel: label,
      sandbox: { 
        service: ctx.service, 
        Nedb: nedb.DB(channel),
        Sqlite: sqlite.DB(channel),
        readFile: readChannelFile(channel),
        Buffer: Buffer,
        __dirname: path.resolve(process.cwd(), 'channels', channel) 
      },
      getUser: ctx.getUser
    }
    try {
      let { 
        notFound, 
        authenticationState, isUser, 
        entrance, payload, serviceModules, setting 
      } = await getEntrance(options)(ctx, 'channels')
      if (notFound) return ctx.notfound()
      if (authenticationState?.type === 'jwt' && isUser === 'Unauthorized') {
        return await ctx.status(401).send('Unauthorized')
      }
      // 使用策略
      let user = await ctx.getUser()
      let plotChannelOptions = getPlot(user?.group.plot??'default')?.channels
      let pathname = entrance?.router.find( v => v.method == ctx.method )?.path ?? label
      let isPlot = isPlotAPI(channel, pathname, ctx.method)(plotChannelOptions)
      if (!isPlot) {
        return await ctx.status(401).send('Unauthorized')
      }
      //
      let [ type, result ] = await getProxyResponse(entrance, payload)({ 
        ctx, 
        logger, 
        serviceModules: omit(serviceModules, ['service.db', ...channelOpts?.ignoreModules??[]]), 
        setting 
      })
      if (entrance?.native) {
        ctx.setHeader('content-type', entrance.native == 'json' ? 'application/json; charset=utf-8' : type)
        apilog(result, ctx)
        return ctx.send(result)
      }
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == 'jwt expired') {
          return await ctx.status(401).send('Unauthorized')
        }
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}