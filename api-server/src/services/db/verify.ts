import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { Model, Document } from 'mongoose'
import * as uuid from 'uuid'

export const model = getModelForClass(entities.Verify)
export const Dao = modelDao<DB.verify.Verify>(model as unknown as Model<Document, {}>, {
  populate: {
    path: 'user',
    select: [ 'id', 'username', 'email', 'mobile', 'nickname', 'avatar', 'sex', 'binds', 'group', 'create_at', 'update_at', 'jw_token' ]
  }
})


export async function create (doc: DB.verify.NewVerify) {
  if (doc.type === 'email') {
    doc.token = uuid.v4().replace(/\-/g, '')
  }
  else {
    doc.token = Math.random().toFixed(6).replace(/^(0\.)/i, '')
  }
  doc.create_at = new Date()
  doc.update_at = new Date()
  let result = await Dao.create(doc)
  return result
}