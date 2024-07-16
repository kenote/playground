
export declare interface SMSConfigure {
  usage       : string
  sdks        : SMSConfigure.SDK[]
}

export declare namespace SMSConfigure {

  type Templete = Partial<Record<'register' | 'verifyid' | 'password' | 'setinfos', string>>

  interface SDK {
    key     : string
    name    : string
    type    : string
    sign    : string
    tpls    : Templete
  }
}
