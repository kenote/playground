import { getModelForClass } from '@typegoose/typegoose'
import { serverConfigure, MASTER_GROUP_LEVEL } from './config'
import * as mongoose from './plugins/mongoose'
import { db, logger } from './services'
import * as entities from '~/entities'
import { merge } from 'lodash'

export async function initData (runtime?: boolean) {
  let { mongoOpts } = serverConfigure
  try {
    if (!runtime) {
      await mongoose.connect(mongoOpts)
      for (let [, val] of Object.entries(entities)) {
        await getModelForClass(val)?.deleteMany()
        await getModelForClass(val)?.collection.dropIndexes()
      }
    }
    let counts = await db.group.Dao.counts()
    if (counts === 0) {
      let group = await db.group.Dao.create({ 
        name: '创建者', 
        level: MASTER_GROUP_LEVEL, 
        description: '创建者拥有系统最高权限，且只有一个帐号' 
      })
      let user = await db.user.create(merge(serverConfigure?.initial, { group: group._id }))
      logger.info(`初始化信息完成!

  -----------------------
  管理员名称：${user.username}
  管理员密码：${serverConfigure?.initial.password}
  -----------------------
        `)
    }
  } catch (error) {
    logger.error(error)
  }
}