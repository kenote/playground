import { Context, Controller, NextHandler, Post, Get, Put } from '@kenote/core'
import { logger, nextError, db } from '~/services'
import * as filters from '~/filters'
import { authenticate } from '~/plugins/passport'

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
  @Put('refresh_token', { filters: [ filters.loadFilter('account', 'refresh_token') ] })
  async refreshToken (ctx: Context, next: NextHandler) {
    try {
      let result = await ctx.refreshToken(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}