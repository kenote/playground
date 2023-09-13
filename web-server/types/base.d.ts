import { FilterData } from 'parse-string'
import { ChannelDataNode } from '@kenote/common'

export declare interface BaseEntitie {
  _id     : string
  id      : number
}

export declare namespace Verify {

  type Rule = Partial<Omit<FilterData.rule, 'validator'>> & Verify.PlusFields

  type Validator = (rule: any, value: any, done: (message?: string) => any) => (message?: string) => any
  type PromiseValidtor = (rule: any, value: any, done: (message?: string) => any) => Promise<(message?: string) => any>

  interface PlusFields {
    type          ?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'data' | 'url' | 'hex' | 'email'
    trigger       ?: 'blur' | 'change' | Array<'blur' | 'change'>
    validator     ?: Validator | PromiseValidtor | Array<string | number | boolean | null>
  }
}

export declare namespace Command {

  type type = 'dialog' | 'action' | 'command' | 'router' | 'http'

  interface value<T> {
    type     : type | T
    path     : string
  }
}

export declare namespace NavMenu {

  interface DataItem extends BaseInfo {
    key          ?: string
    link         ?: string
    icon         ?: string
    divided      ?: booleanboolean
    buttons      ?: DataItem[]
  }

}

export declare namespace Channel {

  type DataNode = ChannelDataNode<PlusNode>

  interface PlusNode {
    type          ?: string
  }
}

export declare interface BaseInfo {
  name          : string
  description  ?: string
}