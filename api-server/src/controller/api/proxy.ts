import { Context, Controller, NextHandler, Get, Post, Put, Delete } from '@kenote/core'
import { APIProxy, getEntrance, getProxyResponse } from '@kenote/api-proxy'
import { logger, nextError, ErrorCode } from '~/services'
import ruleJudgment from 'rule-judgment'
import { Plot } from '~/types/service/plot'
import { isPlotAPI } from '~/services/plot'

const plotChannelOptions: Plot.ChannelOptions<any>[] = [
  {
    name: 'fish',
    pages: [],
    api: [
      { path: 'base-info' }
    ]
  }
]

@Controller()
export default class ProxyController {
  
  @Get('/:channel/:label?/:tag?')
  @Post('/:channel/:label?/:tag?')
  @Put('/:channel/:label?/:tag?')
  @Delete('/:channel/:label?/:tag?')
  async handler (ctx: Context, next: NextHandler) {
    let { channel, label } = ctx.params
    let options: APIProxy.EntranceOptions<any> = {
      channel,
      pathLabel: label,
      sandbox: { service: ctx.service },
      getUser: () => ctx.user
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
      let pathname = entrance?.router.find( v => v.method == ctx.method )?.path ?? label
      let isPlot = isPlotAPI(channel, pathname, ctx.method)(plotChannelOptions)
      if (!isPlot) {
        return await ctx.status(401).send('Unauthorized')
      }
      // 
      let [ type, result ] = await getProxyResponse(entrance, payload)({ ctx, logger, serviceModules, setting })
      if (entrance?.native) {
        ctx.setHeader('content-type', entrance.native == 'json' ? 'application/json; charset=utf-8' : type)
        return ctx.send(result)
      }
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}