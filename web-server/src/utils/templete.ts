import nunjucks from 'nunjucks'
import { merge } from 'lodash'

/**
 * 解析模版
 * @param tpl 
 * @param context 
 */
export function parseTemplate (tpl: string, context: object, opts?: nunjucks.ConfigureOptions) {
  let env = new nunjucks.Environment(null, merge({ autoescape: false }, opts))
  env.addFilter(parseDate.name, value => String(parseDate(value))) // 解析时间字面量
  env.addFilter(parseContent.name, value => String.raw`${parseContent(value, context)}` ) // 解析某个对象属性的文本内容
  return env.renderString(tpl, context)
}
