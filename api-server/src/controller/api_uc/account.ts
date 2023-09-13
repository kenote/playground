import { Context, Controller, NextHandler, Post, Get, Put } from '@kenote/core'
import { logger, nextError, db, name, ErrorCode, httpError } from '~/services'
import * as filters from '~/filters'
import { authenticate } from '~/plugins/passport'
import { FilterQuery } from 'mongoose'
import * as DB from '~/types/service/db'
import { loadConfig } from '@kenote/config'
import type { AccountConfigure } from '~/types/config/account'
import { Account } from '~/types/service/account'
import createError from 'http-errors'
import { getNavigator } from '~/services/channel'

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
      if (error instanceof Error && /Token/.test(error.name)) {
        return ctx.api(null, createError(500, error.message))
      }
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

  /**
   * 发送验证邮件
   */
  @Get('/email_verify', { filters: authenticate })
  async sendVerifyMail (ctx: Context, next: NextHandler) {
    let { emailVerify } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
    try {
      await db.user.sendMailByVerify(ctx.user, emailVerify)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  /**
   * 验证邮箱/手机号
   */
  @Put('/verify/:type(email|mobile)', { filters: [ filters.loadFilter('account', 'verify') ] })
  async verifyEmailMobile (ctx: Context, next: NextHandler) {
    let { emailVerify } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
    let payload: Account.verifyEmailMobile<{ type: Account.verifyUserType}> = ctx.payload
    payload.type = ctx.params.type
    try {
      let result = await db.user.verifyEmailMobile(payload, emailVerify)
      return ctx.api({ result: !!result })
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  /**
   * 注册账户
   */
  @Post('/register/:invitation?', { filters: [ filters.loadFilter('account', 'register') ] })
  async register (ctx: Context, next: NextHandler) {
    let { emailVerify, invitation } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
    try {
      let reslut = await db.user.register(ctx.payload, { emailVerify, invitation }, ctx.params?.invitation)
      return ctx.api(reslut)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }

  /**
   * 获取服务器配置
   */
  @Get('/')
  async getSetting (ctx: Context, next: NextHandler) {
    let { invitation, authpanel } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
    try {
      let navigator = getNavigator()
      return ctx.api({ invitation, navigator, authpanel })
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}