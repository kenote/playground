import { BaseEntitie } from './base'

export declare interface TicketEntitie extends BaseEntitie {
  name         : string
  type         : string
  ticket       : string
  content      : string
  stint        : number
  usage        : number
  create_at    : Date
  last_at      : Date
}