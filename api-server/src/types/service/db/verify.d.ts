import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types'
import * as entities from '~/entities'
import { ObjectId } from 'mongoose'
import { User } from './user'

export declare type Verify = DocumentType<entities.Verify, BeAnObject> & {
  user      : User
}

export declare type NewVerify = Partial<Pick<Verify, 'type' | 'token' | 'application' | 'create_at' | 'update_at'> & {
  user: ObjectId | string
}>