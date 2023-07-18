import { Module, Context } from '@kenote/core'
import { staticDir, templateDir } from './config'
import restful from './middlewares/restful'
import session from '~/plugins/session'
import passport from '~/plugins/passport'
import RootAPIControl from './controller'
import ApiMainModule from './controller/api_v0'
import ApiProxyModule from './controller/api_v1'

@Module({
  statics: {
    '/': staticDir
  },
  options: {
    dynamic: true
  }
})
class StaticFile {}

@Module({ 
  viewDir: templateDir, 
  engine: 'nunjucks', 
  extension: 'njk' 
})
class TemplateView {}

@Module({
  imports: [ StaticFile, TemplateView, RootAPIControl, ApiMainModule, ApiProxyModule ],
  plugins: [ session, passport ],
  middlewares: [ restful ],
  httpException: {
    notFound: async (ctx: Context) => {
      return await ctx.status(404).render('error', {
        code: 404,
        message: `This page could not be found.`
      })
    },
    exception: (err, ctx: Context) => {
      ctx.renderException('error', {
        code: 500,
        message: `This page could internal server error`
      })
    }
  }
})
export default class AppModule {}