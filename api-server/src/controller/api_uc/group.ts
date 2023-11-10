import { Context, Controller, Delete, NextHandler, Post, Put } from '@kenote/core'
import { nextError, db, httpError, ErrorCode } from '~/services'
import * as filters from '~/filters'
import type * as DB from '~/types/service/db'
import type { FilterQuery } from 'mongoose'
import type { QueryOptions } from '@kenote/mongoose'
import { pick, merge } from 'lodash'

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
      let result = await db.group.Dao.find(conditions)
      if (ctx.params?.type == 'list') {
        return ctx.api(result.map(toListObject(<DB.user.User>user)))
      }
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/edit/:GID', { filters: [ filters.loadFilter('group', 'edit', 9998) ] })
  async edit (ctx: Context, next: NextHandler) {
    let GID = filters.getRequestId(ctx, 'GID')
    let conditions = db.toFilterQueryById<DB.group.Group>(GID)
    try {
      let result = await db.group.Dao.updateOne(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Delete('/:GID', { filters: [ filters.loadFilter('group', 'remove', 9998) ] })
  async remove (ctx: Context, next: NextHandler) {
    let GID = filters.getRequestId(ctx, 'GID')
    let conditions = db.toFilterQueryById<DB.group.Group>(GID)
    try {
      let result = await db.group.remove(conditions, ctx.payload?.['migrated'])
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Put('/attribute/:GID', { filters: [ filters.loadFilter('group', 'attribute', 9998) ] })
  async attributes (ctx: Context, next: NextHandler) {
    let GID = filters.getRequestId(ctx, 'GID')
    let conditions = db.toFilterQueryById<DB.group.Group>(GID)
    try {
      let result = await db.group.Dao.updateOne(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}

function toListObject (user: DB.user.User) {
  return (group: DB.group.Group) => {
    let __group = group.toObject({ virtuals: true })
    let disabled: boolean = false
    if (__group.level >= user.group.level) {
      disabled = true
    }
    return merge(pick(__group, ['_id', 'id', 'name', 'level']), { disabled })
  }
}