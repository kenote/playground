import { Context, NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { loadConfig } from '@kenote/config'
import { nextError, customize } from '~/services'
// import type { FilterOptions } from '~/types/config'

interface FilterItem {
  name        : string
  payload     : FilterData.options[]
  level      ?: number
}

export function loadFilter (path: string, name: string) {
  return async (ctx: Context, next: NextHandler) => {
    let filter = loadConfig<FilterItem[]>(`config/filters/${path}`, { type: 'array' })?.find( v => v.name === name )
    try {
      if (filter?.level) {
        ctx.filterUserLevel(0, filter.level)
      }
      let result = filterData(filter?.payload??[], customize)(ctx.body)
      ctx.payload = result
      return next()
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}