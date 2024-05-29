import { basename, resolve } from 'path'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '~/types/config'
import { merge, compact } from 'lodash'
import address from 'address'

export const env = process.env.NODE_ENV ?? 'development'
const SERVER_NAME = process.env.SERVER_NAME || basename(process.cwd())
const { MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_PORT, REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env
const MONGODB_AUTH = compact([MONGODB_USER, MONGODB_PASS]).join(':')
const MONGODB_HOSTNAME = compact([MONGODB_HOST, MONGODB_PORT]).join(':')
const MONGODB_BASEURL = compact([MONGODB_AUTH, MONGODB_HOSTNAME]).join('@') || '127.0.0.1:27017'

export const serverConfigure = <Required<ServerConfigure>> merge(<ServerConfigure>
  {
    NAME: SERVER_NAME,
    PORT: process.env.SERVER_PORT || 4000,
    HOST: address.ip(),
    redisOpts: {
      host: REDIS_HOST || '127.0.0.1',
      port: REDIS_PORT || 6379,
      db: 0,
      password: REDIS_PASS
    },
    mongoOpts: {
      uris: `mongodb://${MONGODB_BASEURL}/${SERVER_NAME}`,
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    },
    initial: {
      username: process.env.ADMIN_NAME || 'admin',
      password: process.env.ADMIN_PASS || 'admin888'
    }
  }, 
  loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
)

export const loggerDir = resolve(process.cwd(), 'logs')
export const staticDir =resolve(process.cwd(), 'static')
export const templateDir = resolve(process.cwd(), 'views')

export const SYSTEM_MINSAFE_ERROR_CODE = Number(process.env.SYSTEM_MINSAFE_ERROR_CODE ?? 1000)

export const MASTER_GROUP_LEVEL = 9999
export const ADVANCED_GROUP_LEVEL = 9000