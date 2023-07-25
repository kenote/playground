import { Context, Controller, NextHandler, Post } from '@kenote/core'
import { logger, nextError, db } from '~/services'
import * as filters from '~/filters'

@Controller('/account')
export default class AccountController {

  @Post('/login', { filters: [ filters.loadFilter('account', 'login') ] })
  async login (ctx: Context, next: NextHandler) {
    console.log(ctx.body)
    try {
      let result = await db.user.login(ctx.payload)
      console.log(result)
      let user = await ctx.jwtlogin(result)
      return ctx.api(user)
    } catch (error) {
      nextError(error, ctx, next)
    }
  }
}