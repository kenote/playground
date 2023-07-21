import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types'
import * as entities from '~/entities'

export declare type Ticket = DocumentType<entities.Ticket, BeAnObject>

export declare type NewTicket = Pick<Ticket, 'name' | 'type' | 'content' | 'stint' | 'last_at'>