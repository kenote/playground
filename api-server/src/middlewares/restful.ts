import { Action, Context, Middleware, Property } from '@kenote/core'
import type { Restful, HttpError, StreamOptions, AuthToken } from '~/types/restful'
import type * as DB from '~/types/service/db'
import * as service from '~/services'
import { setJwToken, verifyJwToken } from './auth'
import { MASTER_GROUP_LEVEL } from '~/config'
import fs from 'fs'
import { Readable } from 'stream'
import * as Store from '~/services/store'
import { serverConfigure } from '~/config'
import type { Account } from '~/types/service/account'

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
        apilog({ error }, ctx)
        ctx.json({ error: error?.message })
      }
      else {
        apilog({ data }, ctx)
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
  jwtlogin (ctx: Context) {
    return async (user: DB.user.User) => {
      let authToken = await updateToken(user._id)
      ctx.cookie('jwtoken', authToken.accessToken)
      authToken.user = service.db.user.safeUser(user)
      return authToken
    }
  }

  @Action()
  refreshToken (ctx: Context) {
    return async (body: Account.refresh) => {
      let { refreshToken, uid } = body
      let payload = verifyJwToken(refreshToken, serverConfigure.REFRESH_SECRET)
      if (payload && payload._id == uid) {
        let authToken = await updateToken(payload._id)
        ctx.cookie('jwtoken', authToken.accessToken)
        return authToken
      }
      return null
    }
  }

  @Action()
  getUser (ctx: Context) {
    return async () => {
      let payload = verifyJwToken(ctx.jwToken, serverConfigure.SECRET_KEY)
      if (payload) {
        let user = await service.db.user.Dao.findOne({ _id: payload._id, jwtoken: ctx.jwToken })
        return service.db.user.safeUser(user)
      }
      return null
    }
  }

  @Action()
  filterUserLevel (ctx: Context) {
    return async (level: number, minlevel: number) => {
      let { ErrorCode, httpError } = service
      let user = await ctx?.getUser()
      let authlevel = user?.group?.level ?? 0
      if (authlevel === MASTER_GROUP_LEVEL) return
      if (authlevel < minlevel) {
        throw httpError(ErrorCode.ERROR_ONLY_ADVANCED_ADMIN)
      }
      if (level >= authlevel) {
        throw httpError(ErrorCode.ERROR_BYLOND_LEVEL_OPERATE)
      }
    }
  }

  @Action()
  sendStream (ctx: Context) {
    return (content: string, options: StreamOptions = { mode: 'stream', contentType: 'application/octet-stream' }) => {
      let contentType = options.contentType
      let fileStream: Buffer | Readable | null = null
      if (options.mode === 'stream') {
        contentType = 'application/octet-stream'
        fileStream = new Readable()
        fileStream.push(content)
        fileStream.push(null)
      }
      else {
        contentType = Store.getContentType(content, options)
        fileStream = fs.readFileSync(content)
      }
      ctx.setHeader('Content-Type', contentType)
      apilog(fileStream, ctx)
      return ctx.send(fileStream)
    }
  }

}

/**
 * 更新 Token
 * @param uid 
 * @returns 
 */
async function updateToken (uid: string) {
  let accessToken = setJwToken({ _id: uid }, serverConfigure.SECRET_KEY, {
    expiresIn: serverConfigure.expiresIn
  })
  let refreshToken = setJwToken({ _id: uid }, serverConfigure.REFRESH_SECRET, {
    expiresIn: serverConfigure.refreshExpires
  })
  await service.db.user.Dao.updateOne({ _id: uid }, { jwtoken: accessToken })
  return <AuthToken> {
    accessToken,
    refreshToken
  }
}

/**
 * 写入请求日志
 * @param response 
 * @param ctx 
 */
export function apilog (response: any, ctx: Context) {
  let info = {
    // 客户端 IP
    address: ctx.clientIP,
    // 请求信息
    request: {
      originalUrl: ctx.originalUrl,
      method: ctx.method,
      headers: ctx.headers,
      body: ctx.body
    },
    // 返回信息
    response: JSON.stringify(response)
  }
  service.logger.info(info)
}

declare module '@kenote/core' {
  interface Context extends Restful {
    service: typeof service
  }
}