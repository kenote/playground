import { basename, resolve } from 'path'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '~/types/config'
import { merge } from 'lodash'
import address from 'address'

export const env = process.env.NODE_ENV ?? 'development'
const SERVER_NAME = process.env.SERVER_NAME ?? basename(process.cwd())

export const serverConfigure = <Required<ServerConfigure>> merge(<ServerConfigure>
  {
    NAME: SERVER_NAME,
    HOST: address.ip(),
    redisOpts: {
      host: '127.0.0.1',
      port: 6379,
      db: 0
    },
    mongoOpts: {
      uris: `mongodb://localhost:27017/${SERVER_NAME}`,
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    },
    initial: {
      username: process.env.ADMIN_NAME ?? 'admin',
      password: process.env.ADMIN_PASS ?? 'admin888'
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