import http from 'http'
import { ServerFactory } from '@kenote/core'
import { ServiceEngine } from '@kenote/koa'
import appModule from './app.module'
import { serverConfigure } from './config'
import { logger } from '~/services'
import * as mongoose from './plugins/mongoose'
import { initData } from './initdata'

async function bootstarp () {
  let { HOST, PORT, SECRET_KEY, mongoOpts } = serverConfigure
  await mongoose.connect(mongoOpts)
  
  let factory = await ServerFactory(new ServiceEngine({ keys: [ SECRET_KEY ] })).create(appModule)
  let server = http.createServer(factory.server)

  server.listen(PORT, async () => {
    // 
    logger.info('Http Server Running to http://%s:%d', HOST, PORT)
    await initData(true)
  })
}

bootstarp()