export { ServerConfigure } from './server'
export { AccountConfigure } from './account'

export declare interface BaseInfo {
  name          : string
  description  ?: string
}

export declare interface DataItem extends BaseInfo {
  key          ?: string
  link         ?: string
  icon         ?: string
  divided      ?: boolean
  buttons      ?: DataItem[]
}