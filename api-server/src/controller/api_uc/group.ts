import { Context, Controller, Delete, NextHandler, Post, Put } from '@kenote/core'
import { nextError, db, httpError, ErrorCode } from '~/services'
import * as filters from '~/filters'
import type * as DB from '~/types/service/db'
import type { FilterQuery } from 'mongoose'

@Controller('/group')
export default class GroupController {

  @Post('/create', { filters: [ filters.loadFilter('group', 'create', 9998) ] })
  async create (ctx: Context, next: NextHandler) {
    try {
      let result = await db.group.Dao.create(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/:type?', { filters: [ filters.loadFilter('group', 'list', 9998) ] })
  async list (ctx: Context, next: NextHandler) {
    let conditions: FilterQuery<DB.group.Group> = {}
    if (ctx.payload?.name) {
      conditions.name = { $regex: new RegExp(ctx.payload.name, 'i') }
    }
    try {
      let user = await ctx.getUser()
      if (ctx.params?.type == 'list') {
        conditions.level = { $lt: user?.group.level }
      }
      let result = await db.group.Dao.find(conditions)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/edit/:_id', { filters: [ filters.loadFilter('group', 'edit', 9998) ] })
  async edit (ctx: Context, next: NextHandler) {
    let id = filters.getRequestId(ctx, '_id')
    let conditions = db.toFilterQueryById<DB.group.Group>(id)
    try {
      let group = await db.group.Dao.findOne(conditions)
      if (!group) {
        throw httpError(ErrorCode.ERROR_AUTH_OPERATE_GROUP_NULL)
      }
      await ctx.filterUserLevel(group.level, 9998)
      let result = await db.group.Dao.updateOne(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Delete('/:_id', { filters: [ filters.loadFilter('group', 'remove', 9998) ] })
  async remove (ctx: Context, next: NextHandler) {
    let id = filters.getRequestId(ctx, '_id')
    let conditions = db.toFilterQueryById<DB.group.Group>(id)
    try {
      let group = await db.group.Dao.findOne(conditions)
      if (!group) {
        throw httpError(ErrorCode.ERROR_AUTH_OPERATE_GROUP_NULL)
      }
      await ctx.filterUserLevel(group.level, 9998)
      let result = await db.group.remove(conditions, ctx.payload?.['migrated'])
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Put('/attribute/:_id', { filters: [ filters.loadFilter('group', 'attribute', 9998) ] })
  async attributes (ctx: Context, next: NextHandler) {
    let id = filters.getRequestId(ctx, '_id')
    let conditions = db.toFilterQueryById<DB.group.Group>(id)
    try {
      let group = await db.group.Dao.findOne(conditions)
      if (!group) {
        throw httpError(ErrorCode.ERROR_AUTH_OPERATE_GROUP_NULL)
      }
      await ctx.filterUserLevel(group.level, 9998)
      let result = await db.group.Dao.updateOne(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}