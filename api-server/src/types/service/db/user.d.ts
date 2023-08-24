import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types'
import * as entities from '~/entities'
import { Group } from './group'
import { ObjectId } from 'mongoose'
import { Account } from '../account'

export declare type User = DocumentType<entities.User, BeAnObject> & {
  group      : Group
}

export declare type SafeUser = Omit<User, 'encrypt' | 'salt' | 'jwtoken'>

export declare type Register = Partial<Omit<SafeUser, 'group'>> & {
  password  ?: string
  group      : ObjectId | string
}

export declare type NewUser = Partial<Omit<Register, 'password'>> & Account.password