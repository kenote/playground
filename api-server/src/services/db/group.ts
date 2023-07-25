import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import * as DB from '~/types/service/db'
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose'
import { ErrorCode, httpError } from '~/services/error'
import { toFilterQueryById, user } from './'
import { MASTER_GROUP_LEVEL, ADVANCED_GROUP_LEVEL } from '~/config'

export const model = getModelForClass(entities.Group)
export const Dao = modelDao<DB.group.Group>(model as unknown as Model<Document, {}>, {})

export async function remove (conditions: FilterQuery<DB.group.Group>, migrated?: string) {
  let group = await Dao.findOne(conditions)
  if (!group) {
    throw httpError(ErrorCode.ERROR_AUTH_OPERATE_GROUP_NULL)
  }
  if (group.level === MASTER_GROUP_LEVEL) {
    throw httpError(ErrorCode.ERROR_NOT_REMOVE_MASTER)
  }
  if (migrated) {
    let migratedGroup = await Dao.findOne(toFilterQueryById(migrated))
    if (!migratedGroup) {
      throw httpError(ErrorCode.ERROR_MIGRATED_GROUP_NOTEXIST)
    }
    if (migratedGroup.level >= ADVANCED_GROUP_LEVEL) {
      throw httpError(ErrorCode.ERROR_NOT_MIGRATED_ADVANCED)
    }
    await user.Dao.updateMany({ group: { $eq: group._id } }, <UpdateQuery<any>>{ group: migrated })
  }
  else {
    await user.Dao.remove({ group: { $eq: group._id } })
  }
  return Dao.remove(conditions)
}