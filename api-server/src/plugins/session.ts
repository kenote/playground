import session from '@kenote/koa-session'
import redisStore from 'koa-redis'
import { serverConfigure } from '~/config'

export default session({
  key: serverConfigure?.SECRET_KEY,
  store: redisStore(serverConfigure.redisOpts)
})