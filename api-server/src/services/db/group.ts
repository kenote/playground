import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { Model, Document } from 'mongoose'

export const model = getModelForClass(entities.Group)
export const Dao = modelDao<DB.group.Group>(model as unknown as Model<Document, {}>, {})