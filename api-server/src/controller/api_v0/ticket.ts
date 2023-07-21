import { Context, Controller, Delete, NextHandler, Post, Put } from '@kenote/core'
import { nextError, db } from '~/services'
import * as filters from '~/filters'
import type * as DB from '~/types/service/db'
import { isBoolean } from 'lodash'
import type { FilterQuery } from 'mongoose'

@Controller('/ticket')
export default class TicketController {

  @Post('/', { filters: [ filters.loadFilter('ticket', 'list') ] })
  async list (ctx: Context, next: NextHandler) {
    let { payload, options } = filters.parsePayload(ctx.payload)
    let conditions: FilterQuery<DB.ticket.Ticket> = {}
    if (payload?.name) {
      conditions.name = { $regex: new RegExp(payload.name, 'i') }
    }
    if (payload?.type) {
      conditions.type = { $eq: payload.type }
    }
    if (isBoolean(payload?.usage)) {
      conditions.$expr = {
        [payload.usage ? '$lte' : '$gt']: [ '$stint', '$usage' ]
      }
    }
    if (isBoolean(payload?.expired)) {
      conditions.last_at = {
        [payload.expired ? '$lte' : '$gt']: new Date()
      }
    }
    try {
      let result = await db.ticket.Dao.list(conditions, options)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/create', { filters: [ filters.loadFilter('ticket', 'create') ] })
  async create (ctx: Context, next: NextHandler) {
    try {
      let result = await db.ticket.create(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Post('/edit/:_id', { filters: [ filters.loadFilter('ticket', 'create') ] })
  async edit (ctx: Context, next: NextHandler) {
    let id = filters.getRequestId(ctx, '_id')
    let conditions = db.toFilterQueryById<DB.ticket.Ticket>(id)
    try {
      let result = await db.ticket.Dao.updateOne(conditions, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Delete('/', { filters: [ filters.loadFilter('ticket', 'remove') ] })
  @Delete('/:_id', { filters: [ filters.loadFilter('ticket', 'remove') ] })
  async remove (ctx: Context, next: NextHandler) {
    let id = filters.getRequestId(ctx, '_id', 'ids')
    let conditions = db.toFilterQueryById<DB.ticket.Ticket>(id)
    try {
      let result = await db.ticket.Dao.remove(conditions)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  @Put('/verify', { filters: [ filters.loadFilter('ticket', 'verify') ] })
  async verify (ctx: Context, next: NextHandler) {
    let { ticket, name, type } = ctx.payload
    try {
      let result = await db.ticket.valid(ticket, name, type)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}