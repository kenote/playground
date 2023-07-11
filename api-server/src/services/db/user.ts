import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { Model, Document } from 'mongoose'
import { merge, omit } from 'lodash'

export const model = getModelForClass(entities.User)
export const Dao = modelDao<DB.user.User>(model as unknown as Model<Document, {}>, {
  populate: [
    {
      path: 'group',
      select: [ 'id', 'name', 'level', 'description', 'plot' ]
    }
  ]
})

export function safeUser (data: DB.user.User, payload?: Partial<DB.user.SafeUser>) {
  if (!data) return
  let user = merge(data?.toObject({ virtuals: true }), payload)
  return <DB.user.SafeUser> omit(user, ['encrypt', 'salt'])
}