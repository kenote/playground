import { Field, ObjectType } from 'type-graphql'
import { pre, prop, mongoose, modelOptions } from '@typegoose/typegoose'
import { updatecCounter, ModelOptions } from './counter'

@ObjectType()
@pre<Ticket>('save', async function (next) {
  try {
    if (this.isNew) {
      let counts = await updatecCounter('ticket')
      this.id = counts
    }
  } catch (error) {
    return next(error)
  }
})
@modelOptions(ModelOptions)
export default class Ticket {

  @Field({ nullable: true, description: 'ID' })
  @prop({ unique: true })
  public id!: number

  @Field({ nullable: true, description: '名称' })
  @prop({ required: true })
  public name!: string

  @Field({ nullable: true, description: '类型' })
  @prop()
  public type!: string

  @Field({ nullable: true, description: '票据UUID' })
  @prop()
  public ticket!: string

  @Field({ nullable: true, description: '票据内容' })
  @prop()
  public content!: string

  @Field({ nullable: true, description: '限制最大使用次数' })
  @prop({ default: 0 })
  public stint!: number

  @Field({ nullable: true, description: '已使用次数' })
  @prop({ default: 0 })
  public usage!: number

  @Field({ nullable: true, description: '创建时间' })
  @prop({ type: Date, default: new Date() })
  public create_at!: Date

  @Field({ nullable: true, description: '过期时间' })
  @prop({ type: Date, default: new Date() })
  public last_at!: Date
}