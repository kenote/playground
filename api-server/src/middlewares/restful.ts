import { Action, Context, Middleware, Property } from '@kenote/core'
import type { Restful, HttpError } from '~/types/restful'
import type * as DB from '~/types/service/db'
import * as service from '~/services'
import { setJwToken, verifyJwToken } from './auth'
import { MASTER_GROUP_LEVEL } from '~/config'

@Middleware()
export default class restful {

  @Property()
  service (ctx: Context) {
    return service
  }

  @Action()
  api<T = any> (ctx: Context) {
    return (data: T, error?: HttpError) => {
      if (error != null) {
        ctx.json({ error: error?.message })
      }
      else {
        ctx.json({ data })
      }
    }
  }

  @Action()
  notfound (ctx: Context) {
    return async () => {
      await ctx.status(404).render('error', {
        code: 404,
        message: `This page could not be found.`
      })
    }
  }

  @Property()
  clientIP (ctx: Context) {
    return ctx.headers?.['x-forwarded-for']
    ?? ctx.headers?.['x-real-ip']
    ?? ctx.connection?.remoteAddress
    ?? ctx.req.socket?.remoteAddress
    ?? ctx.ip
  }

  @Property()
  jwToken (ctx: Context) {
    return ctx.headers.authorization?.replace(/^(Bearer)\s{1}/, '')
  }

  @Action()
  login (ctx: Context) {
    return async (user: DB.user.User) => {
      let jwtoken = setJwToken({ _id: user._id })
      ctx.cookie('jwtoken', jwtoken)
      await service.db.user.Dao.updateOne({ _id: user._id }, { jwtoken })
      return service.db.user.safeUser(user, { jwtoken })
    }
  }

  @Action()
  getUser (ctx: Context) {
    return async () => {
      let payload = verifyJwToken(ctx.jwToken)
      if (payload) {
        let user = await service.db.user.Dao.findOne({ _id: payload._id, jwtoken: ctx.jwToken })
        user.group
        return service.db.user.safeUser(user)
      }
      return null
    }
  }

  @Action()
  filterUserLevel (ctx: Context) {
    return (level: number, minlevel: number) => {
      let { ErrorCode, httpError } = service
      let authlevel = (<DB.user.User>ctx.user).group?.level ?? 0
      if (authlevel === MASTER_GROUP_LEVEL) return
      if (authlevel < minlevel) {
        throw httpError(ErrorCode.ERROR_ONLY_ADVANCED_ADMIN)
      }
      if (level >= authlevel) {
        throw httpError(ErrorCode.ERROR_BYLOND_LEVEL_OPERATE)
      }
    }
  }

}

declare module '@kenote/core' {
  interface Context extends Restful {
    user?: DB.user.SafeUser
    service: typeof service
  }
}