import { Context, Controller, Delete, NextHandler, Get, Post, Put } from '@kenote/core'
import { nextError, db, httpError, ErrorCode } from '~/services'
import { getPlotList } from '~/services/plot'
import { pick } from 'lodash'

@Controller('/plot')
export default class PlotController {

  @Get('/:type?')
  async list (ctx: Context, next: NextHandler) {
    try {
      let list = getPlotList()
      if (ctx.params?.type == 'list') {
        return ctx.api(list.map( v => pick(v, ['key', 'name']) ))
      }
      return ctx.api(list)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}