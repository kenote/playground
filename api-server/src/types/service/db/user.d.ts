import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types'
import * as entities from '~/entities'
import { Group } from './group'

export declare type User = DocumentType<entities.User, BeAnObject> & {
  group: Group
}

export declare type SafeUser = Omit<User, 'encrypt' | 'salt'>