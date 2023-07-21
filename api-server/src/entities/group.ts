import { Field, ObjectType } from 'type-graphql'
import { pre, prop, mongoose, modelOptions } from '@typegoose/typegoose'
import { updatecCounter, ModelOptions } from './counter'

@ObjectType()
@pre<Group>('save', async function (next) {
  try {
    if (this.isNew) {
      let counts = await updatecCounter('group')
      this.id = counts
    }
  } catch (error) {
    return next(error)
  }
})
@modelOptions(ModelOptions)
export default class Group {

  @Field({ nullable: true, description: 'ID' })
  @prop({ unique: true })
  public id!: number

  @Field({ nullable: true, description: '用户组' })
  @prop({ required: true })
  public name!: string

  @Field({ nullable: true, description: '权级' })
  @prop({ default: 1000 })
  public level!: number

  @Field({ nullable: true, description: '描述说明' })
  @prop()
  public description!: string

  @Field({ nullable: true, description: '安全策略' })
  @prop()
  public plot!: string
}