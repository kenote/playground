import { QueryOptions } from 'mongoose'
import { prop, getModelForClass, Severity } from '@typegoose/typegoose'
import { IModelOptions } from '@typegoose/typegoose/lib/types'

export default class Counter {

  @prop({ required: true })
  public name!: string

  @prop({ default: 0 })
  public seq!: number

}

export const ModelOptions: IModelOptions = {
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
}

export async function updatecCounter (name: string) {
  let model = getModelForClass(Counter)
  let options: QueryOptions = {
    new: true,
    upsert: true
  }
  let counter = await model.findOneAndUpdate({ name: { $eq: name }}, { $inc: { seq: 1 }}, options)
  return counter?.seq??1
}