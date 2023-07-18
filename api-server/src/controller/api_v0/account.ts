import { Context, Controller, NextHandler, Post } from '@kenote/core'
import { logger, nextError, db } from '~/services'
import * as filters from '~/filters'

@Controller()
export default class AccountController {

  @Post('/login', { filters: [ filters.loadFilter('account', 'login') ] })
  async login (ctx: Context, next: NextHandler) {
    try {
      let result = await db.user.login(ctx.payload)
      let user = await ctx.jwtlogin(result)
      return user
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}