import { Context, Controller, NextHandler, Post, Get, Put } from '@kenote/core'
import { logger, nextError, db, name, ErrorCode, httpError } from '~/services'
import { readConfigFile } from '~/services/channel'

@Controller('/channel')
export default class ChannelController {

  @Get('page/:channel/:label?')
  async handlePage (ctx: Context, next: NextHandler) {
    let { channel, label } = ctx.params
    try {
      let config = readConfigFile(label??'home', [channel, 'pages'].join('/'))
      config.pathname = [, channel, label].join('/') 
      return ctx.api(config)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Get('/')
  async list (ctx: Context, next: NextHandler) {

    try {
      
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/create')
  async create (ctx: Context, next: NextHandler) {

  }
}