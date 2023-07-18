

export declare namespace Account {

  interface login {
    username     ?: string
    password     ?: string
  }

  type password = {
    encrypt    : string
    salt       : string
  }

  interface register {

  }
}