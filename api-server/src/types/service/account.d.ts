import { AccountConfigure } from '../config'

export declare namespace Account {

  type verifyUserType = 'email' | 'mobile'

  interface login {
    username     ?: string
    password     ?: string
  }

  interface refresh {
    refreshToken  : string
    uid           : string
  }

  type password = {
    encrypt    : string
    salt       : string
  }

  interface registerOptions {
    invitation   ?: boolean
    emailVerify   : AccountConfigure.emailVerify
  }

  type verifyEmailMobile<T = {}> = {
    token         : string
    _id           : string
  } & T
}

export declare interface RandomOptions {
  length       : number
  symbol      ?: true
  capitalize  ?: true
}