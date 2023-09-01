import { Context, Controller, NextHandler, Post, Get, Put } from '@kenote/core'
import { logger, nextError, db, name, ErrorCode, httpError } from '~/services'
import * as filters from '~/filters'
import { authenticate } from '~/plugins/passport'
import { FilterQuery } from 'mongoose'
import * as DB from '~/types/service/db'

const checkWarning: DB.user.CheckWarning = {
  username: ErrorCode.ERROR_VALID_USERNAME_UNIQUE,
  email: ErrorCode.ERROR_VALID_EMAIL_UNIQUE,
  mobile: ErrorCode.ERROR_VALID_MOBILE_UNIQUE
}

@Controller('/account')
export default class AccountController {

  /**
   * 用户登录
   */
  @Post('/login', { filters: [ filters.loadFilter('account', 'login') ] })
  async login (ctx: Context, next: NextHandler) {
    try {
      let result = await db.user.login(ctx.payload)
      let authToken = await ctx.jwtlogin(result)
      return ctx.api(authToken)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  /**
   * 验证访问令牌 
   */
  @Get('/accesstoken', { filters: authenticate })
  async accessToken (ctx: Context) {
    return ctx.api(ctx.user)
  }

  /**
   * 刷新访问令牌 
   */
  @Put('/refresh_token', { filters: [ filters.loadFilter('account', 'refresh_token') ] })
  async refreshToken (ctx: Context, next: NextHandler) {
    try {
      let result = await ctx.refreshToken(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  /**
   * 查询名称是否占用
   */
  @Put('/check/:type(username|email|mobile)')
  async check (ctx: Context, next: NextHandler) {
    let { type } = ctx.params as { type: keyof DB.user.CheckWarning }
    let { name, uid } = ctx.body
    let conditions: FilterQuery<DB.user.User> = {
      [type]: { $eq: name }
    }
    if (uid) {
      conditions._id = { $ne: uid }
    }
    try {
      let result = await db.user.Dao.findOne(conditions)
      if (result) {
        throw httpError(checkWarning?.[type])
      }
      return ctx.api(!result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}