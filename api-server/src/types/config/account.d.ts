import { DataItem } from '.'
import { RandomOptions } from '~/types/service/account'
import { CommonDataNode } from '@kenote/common'

export declare interface AccountConfigure {

  mailphoneStep        : string | number

  mailphoneTime        : string | number

  emailVerify          : AccountConfigure.emailVerify
  
  invitation          ?: boolean

  password            ?: RandomOptions | number


  encrypt             ?: string

  authpanel           ?: AccountConfigure.authPanel

  navigator           ?: AccountConfigure.Navigator
}

export declare namespace AccountConfigure {

  type emailVerify = {
    timeout      : string | number
    url          : string
  }

  type authPanel = {
    top         ?: DataItem[]
    main        ?: DataItem[]
    trigger     ?: string
  }

  type Navigator = {
    name         : string
    types        : Pick<CommonDataNode, 'key' | 'name'>[]
    group        : string[][]
    trigger     ?: string
  }
}