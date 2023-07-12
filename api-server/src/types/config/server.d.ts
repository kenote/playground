import Redis from 'ioredis'
import { mongoose } from '@typegoose/typegoose'

export declare type ServerConfigure = {
  NAME           ?: string
  HOST           ?: string
  PORT           ?: number
  SECRET_KEY     ?: string
  redisOpts      ?: Redis.RedisOptions
  mongoOpts      ?: ServerConfigure.MongoDBOptions
  channelOpts    ?: ServerConfigure.ChannelOpts
}

export declare namespace ServerConfigure {

  interface MongoDBOptions {
    uris         : string
    options     ?: mongoose.ConnectionOptions
  }

  interface ChannelOpts {
    ignoreModules  ?: string[]
  }
}