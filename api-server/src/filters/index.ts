import { Context, NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { loadConfig } from '@kenote/config'
import { nextError, customize, assign } from '~/services'
import { isNumber, isArray, compact, toSafeInteger, omit } from 'lodash'
import { QueryOptions } from '@kenote/mongoose'
import { PageRequest } from '~/types/restful'

interface FilterItem {
  name        : string
  payload    ?: FilterData.options[]
  auth       ?: number | true
}

export function loadFilter (path: string, name: string, level?: number | true) {
  return async (ctx: Context, next: NextHandler) => {
    let filter = loadConfig<FilterItem[]>(`config/filters/${path}`, { type: 'array', assign })?.find( v => v.name === name )
    let authlevel = level ?? filter?.auth
    try {
      if (authlevel) {
        let user = await ctx?.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
        if (isNumber(authlevel)) {
          await ctx.filterUserLevel(0, authlevel)
        }
      }
      let result = filterData(filter?.payload??[], customize)(ctx.body)
      ctx.payload = result
      return next()
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}

export function getRequestId (ctx: Context, name: string, batch: string = 'ids'): string | string[] {
  if (ctx.params?.[name]) {
    return ctx.params?.[name]
  }
  let splitter = /\,/
  let ids: string | string[] = ctx.body?.[batch]
  if (isArray(ids)) {
    return ids
  }
  return compact(ids.replace(/(^\s*)|(\s*$)/g, '').split(splitter))
}

export function parsePayload (body: Record<string, any> & PageRequest) {
  let options: QueryOptions = {}
  if (body?.page) {
    let { page, skip, limit } = toPageInfo(body.page, body?.size)
    options.limit = limit
    options.skip = skip
  }
  if (body?.sort) {
    options.sort = toSortOptions(body.sort)
  }
  let payload = omit(body, ['page', 'size', 'sort'])
  return { payload, options }
}

export function toPageInfo (pageno: number, size: number = 10) {
  size = toSafeInteger(size)
  let limit = isNaN(size) || size < 1 ? 10 : size
  let parseVal = toSafeInteger(pageno ?? 1)
  let val = isNaN(parseVal) ? 1 : parseVal
  let page = isNaN(val) || val < 1 ? 1 : parseVal
  let skip = (page -1) * limit
  return { page, skip, limit }
}

export function toSortOptions (value?: string[]) {
  let [ prop, order ] = value ?? []
  if (!prop) return undefined
  let options = { [prop]: /^(desc)/.test(order ?? 'asc') ? -1 : 0 }
  return options
}