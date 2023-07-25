import Redis from 'ioredis'
import { mongoose } from '@typegoose/typegoose'
import * as DB from '~/types/service/db'

export declare type ServerConfigure = {
  NAME           ?: string
  HOST           ?: string
  PORT           ?: number
  SECRET_KEY     ?: string
  redisOpts      ?: Redis.RedisOptions
  mongoOpts      ?: ServerConfigure.MongoDBOptions
  channelOpts    ?: ServerConfigure.ChannelOpts
  previewTypes   ?: ServerConfigure.FileType[]
  encrypt        ?: string
  initial        ?: DB.user.Register
}

export declare namespace ServerConfigure {

  interface MongoDBOptions {
    uris         : string
    options     ?: mongoose.ConnectionOptions
  }

  interface ChannelOpts {
    ignoreModules  ?: string[]
  }

  interface FileType {
    type         : string
    extname      : string[]
  }
}