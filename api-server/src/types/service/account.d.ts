

export declare namespace Account {

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

  interface register {

  }
}

export declare interface RandomOptions {
  length       : number
  symbol      ?: true
  capitalize  ?: true
}