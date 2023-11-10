import { Context, Controller, Delete, NextHandler, Post, Put } from '@kenote/core'
import { nextError, db, httpError, ErrorCode } from '~/services'
import * as filters from '~/filters'
import type * as DB from '~/types/service/db'
import type { FilterQuery } from 'mongoose'

@Controller('/user')
export default class UserController {

  @Post('/', { filters: [ filters.loadFilter('user', 'list', 9998) ] })
  async list (ctx: Context, next: NextHandler) {
    let { payload, options } = filters.parsePayload(ctx.payload)
    let conditions: FilterQuery<DB.user.SafeUser> = {}
    if (payload?.findname) {
      conditions[payload?.findtype] = new RegExp(payload.findname)
    }
    if (payload?.create_at?.length == 2) {
      let [ begin, end ] = payload.create_at
      conditions.create_at = { $gte: begin, $lt: end }
    }
    options.select = ['id', 'username', 'email', 'mobile', 'nickname', 'avatar', 'sex', 'group', 'teams', 'binds', 'create_at', 'update_at']
    try {
      let result = await db.user.Dao.list(conditions, options)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/edit/:UID', { filters: [ filters.loadFilter('user', 'edit', 9998) ] })
  async edit (ctx: Context, next: NextHandler) {
    let UID = filters.getRequestId(ctx, 'UID')
    let conditions = db.toFilterQueryById<DB.user.User>(UID)
    try {
      let result = await db.user.updateInfo(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/create', { filters: [ filters.loadFilter('user', 'create', 9998) ] })
  async create (ctx: Context, next: NextHandler) {
    try {
      let result = await db.user.create(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Delete('/:UID', { filters: [ filters.loadFilter('user', 'remove', 9998) ] })
  async remove (ctx: Context, next: NextHandler) {
    let UID = filters.getRequestId(ctx, 'UID')
    let conditions = db.toFilterQueryById<DB.user.User>(UID)
    try {
      let result = await db.user.Dao.remove(conditions)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}