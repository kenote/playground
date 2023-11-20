import { Context, NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { loadConfig } from '@kenote/config'
import { nextError, customize, assign, db, httpError, ErrorCode } from '~/services'
import { isNumber, isArray, compact, toSafeInteger, omit, isNaN, unset, isUndefined, isNull } from 'lodash'
import { QueryOptions } from '@kenote/mongoose'
import { PageRequest } from '~/types/restful'
import type { HttpError } from 'http-errors'
import { isPlotAPI, getPlot } from '~/services/plot'
import ruleJudgment from 'rule-judgment'
import type { Plot } from '~/types/service/plot'

interface FilterItem {
  name        : string
  payload    ?: FilterData.options[]
  auth       ?: number | true
}

export function loadFilter (path: string, name: string, level?: number | true) {
  return async (ctx: Context, next: NextHandler) => {
    let filter = loadConfig<FilterItem[]>(`config/filters/${path}`, { type: 'array', assign })?.find( v => v.name === name )
    let authlevel = filter?.auth ?? level
    try {
      if (authlevel) {
        let user = await ctx?.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
        if (isNumber(authlevel)) {
          let anitLevel = await getAnitLevel(ctx.params)
          await ctx.filterUserLevel(anitLevel, authlevel)
        }
        if (user.group.level < 9998) {
          let plots = getPlot(user.group.plot).apis.find(ruleJudgment<Plot.APIOptions>({ 
            path: ctx.path,
            method: { $_in: [ctx.method.toLocaleLowerCase()] }
          }))
          if (!plots) {
            throw httpError(ErrorCode.ERROR_AUTH_FLAG_ACCESS)
          }
        }
      }
      let result = filterData(filter?.payload??[], customize)(ctx.body)
      ctx.payload = cleanNaNByPayload(result)
      return next()
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

export function cleanNaNByPayload (payload: Record<string, any>) {
  for (let [key, val] of Object.entries(payload)) {
    if (Number.isNaN(val) || val == undefined || (val == '' && ['password'].includes(key))) {
      unset(payload, key)
    }
  }
  return payload
}

/**
 * 获取操作对象等级
 * @param params 
 * @returns 
 */
async function getAnitLevel (params: Record<string, any> = {}) {
  let { UID, GID } = params
  if (UID) {
    let user = await db.user.Dao.findOne({ _id: UID })
    if (!user) {
      throw httpError(ErrorCode.ERROR_AUTH_OPERATE_USER_NULL)
    }
    return user.group.level
  }
  else if (GID) {
    let group = await db.group.Dao.findOne({ _id: GID })
    if (!group) {
      throw httpError(ErrorCode.ERROR_AUTH_OPERATE_GROUP_NULL)
    }
    return group.level
  }
  else {
    return 0
  }
}