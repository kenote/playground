import { mongoose } from '@typegoose/typegoose'
import type { ServerConfigure } from '~/types/config'
import { logger } from '~/services'

export async function connect (mongoOpts?: ServerConfigure.MongoDBOptions) {
  if (!mongoOpts) {
    logger.error(`No configuration found of MongoDB.`)
    process.exit(1)
  }
  let { uris, options } = mongoOpts
  try {
    await mongoose.connect(uris, options)
    logger.info(`Connect to ${uris}`)
  } catch (error) {
    if (error instanceof Error) {
      logger.info(`Connect to ${uris} error: ${error.message}`)
    }
    process.exit(1)
  }
}