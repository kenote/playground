import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { FilterQuery, Model, Document } from 'mongoose'
import { merge, omit } from 'lodash'
import type { Account } from '~/types/service/account'
import * as Bcrypt from '~/services/bcrypt'
import { ErrorCode, httpError } from '~/services/error'
import { serverConfigure } from '~/config'

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
  return <DB.user.SafeUser> omit(user, ['encrypt', 'salt', 'jwtoken'])
}

export async function login (doc: Account.login) {
  let conditions: FilterQuery<DB.user.User> = {
    $or: [
      { username: doc.username },
      { email: doc.username },
      { mobile: doc.username }
    ]
  }
  let user = await Dao.findOne(conditions)
  if (!user) {
    throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
  }
  let valide = Bcrypt.compare(serverConfigure.encrypt)(doc.password!, user.encrypt, user.salt)
  if (!valide) {
    throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
  }
  return user
}

export async function create (doc: DB.user.Register) {
  let { username, email, mobile } = doc
  let unique_username = await Dao.findOne({ username: { $eq: username }})
  if (unique_username) {
    throw httpError(ErrorCode.ERROR_VALID_USERNAME_UNIQUE)
  }
  let unique_email = await Dao.findOne({ email: { $eq: email }})
  if (unique_email) {
    throw httpError(ErrorCode.ERROR_VALID_EMAIL_UNIQUE)
  }
  let unique_mobile = await Dao.findOne({ mobile: { $eq: mobile }})
  if (unique_mobile) {
    throw httpError(ErrorCode.ERROR_VALID_MOBILE_UNIQUE)
  }
  let password = Bcrypt.encode(serverConfigure.encrypt)(doc.password!)
  let user: DB.user.NewUser = merge(omit(doc, ['password']), password)
  let result = await Dao.create(user)
  return result
}