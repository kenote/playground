import { FilterQuery, Document } from 'mongoose'
import { isArray } from 'lodash'

export * as group from './group'
export * as user from './user'
export * as ticket from './ticket'

export function toFilterQueryById<T extends Document<string, any, any>> (id: string | string[]) {
  let conditions = <FilterQuery<T>> {
    _id: isArray(id) ? {
      $in: id
    } : {
      $eq: id
    }
  }
  return conditions
}