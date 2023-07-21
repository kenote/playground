import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { Model, Document } from 'mongoose'
import uuid from 'uuid'
import { merge } from 'lodash'
import { ErrorCode, httpError } from '~/services/error'
import { filterData, FilterData } from 'parse-string'

export const model = getModelForClass(entities.Ticket)
export const Dao = modelDao<DB.ticket.Ticket>(model as unknown as Model<Document, {}>, {})

export async function create (doc: DB.ticket.NewTicket) {
  let ticket = uuid.v4()
  let data = await Dao.create(merge({ ticket }, doc))
  return data
}

export async function valid (ticket: string, name: string, type: string) {
  let error = httpError(ErrorCode.ERROR_VALID_TICKET_REQUIRED, [ name ])
  let filter = <FilterData.options[]> [
    {
      key: 'ticket',
      rules: [
        { required: true, message: error.message, code: error.code }
      ]
    }
  ]
  let body = filterData(filter)({ ticket })
  let data = await Dao.findOne(merge(body, { type }))
  if (!data) {
    throw httpError(ErrorCode.ERROR_VALID_TICKET_NULL, [ name ])
  }
  if (data.last_at.getTime() <= Date.now()) {
    throw httpError(ErrorCode.ERROR_VALID_TICKET_EXPIRED, [ name ])
  }
  if (data.usage) {
    throw httpError(ErrorCode.ERROR_VALID_TICKET_USED, [ name ])
  }
  return data
}