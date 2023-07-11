import { Module, Context } from '@kenote/core'
import { staticDir, templateDir } from './config'
import restful from './middlewares/restful'
import session from '~/plugins/session'
import passport from '~/plugins/passport'
import ApiModule from './controller/api'

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
  imports: [ StaticFile, TemplateView, ApiModule ],
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