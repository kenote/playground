import { DataItem } from '.'
import { RandomOptions } from '~/types/service/account'

export declare interface AccountConfigure {

  mailphoneStep        : string | number

  mailphoneTime        : string | number

  emailVerify          : AccountConfigure.emailVerify
  
  invitation          ?: boolean

  password            ?: RandomOptions | number


  encrypt             ?: string

  authpanel           ?: AccountConfigure.authPanel
}

export declare namespace AccountConfigure {

  type emailVerify = {
    timeout              : string | number
    url                  : string
  }

  type authPanel = {
    top                 ?: DataItem[]
    main                ?: DataItem[]
  }
}