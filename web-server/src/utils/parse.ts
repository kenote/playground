import { merge, get, isDate, isString } from 'lodash'
import jsYaml from 'js-yaml'

/**
 * 解析成日期时间
 * @param value 
 * @param nowValue 
 * @returns 
 */
export function parseDate (value: string | Date, nowValue?: Date | null): Date | null {
  if (isDate(value)) return value
  // 组合起来使用
  if (/(\_)/.test(value)) {
    let dates = value.split(/\_/)
    let now: Date | null = null
    for (let item of dates) {
      if (now && !/(day?(s|e)|week?(s|e))$/.test(item)) break
      now = parseDate(item, now)
    }
    return now
  }
  // 提取日期字面量的值
  let dateValue = parseDateString(value)
  let today = nowValue ?? new Date()
  let nowDayOfWeek = today.getDay() - 1
  // 当前时间
  if (value === 'now') {
    return new Date()
  }
  // 昨天 | 今天 | 明天
  else if ([ 'yesterday', 'today', 'tomorrow' ].includes(value)) {
    let index = [ 'yesterday', 'today', 'tomorrow' ].indexOf(value) - 1
    return parseDate([index, 'days'].join(' '))
  }
  // 某天的当前时间
  else if (/(day)$/.test(value)) {
    return new Date(today.setDate(today.getDate() + dateValue))
  }
  // 某天的开始时间
  else if (/(days)$/.test(value)) {
    return new Date(new Date(today.setDate(today.getDate() + dateValue)).setHours(0, 0, 0, 0))
  }
  // 某天的结束时间
  else if (/(daye)$/.test(value)) {
    return new Date(new Date(today.setDate(today.getDate() + dateValue)).setHours(23, 59, 59, 999))
  }
  // 某周的当前时间
  else if (/(week)$/.test(value)) {
    let date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - nowDayOfWeek + (dateValue * 7) + nowDayOfWeek)
      .setHours(today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds())
    return new Date(date)
  }
  // 某周的开始时间
  else if (/(weeks)$/.test(value)) {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - nowDayOfWeek + (dateValue * 7) + 0)
  }
  // 某周的结束时间
  else if (/(weeke)$/.test(value)) {
    let date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - nowDayOfWeek + (dateValue * 7) + 6)
      .setHours(23, 59, 59, 999)
    return new Date(date)
  }
  // 某月的当前时间
  else if (/(month)$/.test(value)) {
    return new Date(new Date(new Date().setMonth(dateValue)))
  }
  // 某月的开始时间
  else if (/(months)$/.test(value)) {
    return new Date(new Date(new Date().setMonth(dateValue, 1)).setHours(0, 0, 0, 0))
  }
  // 某月的结束时间
  else if (/(monthe)$/.test(value)) {
    let offset = dateValue - new Date().getMonth() + 1
    return new Date(parseDate(`${offset} months`)!.getTime() - 1)
  }
  // 某年的当前时间
  else if (/(year)$/.test(value)) {
    return new Date(new Date().setFullYear(dateValue))
  }
  // 某年的开始时间
  else if (/(years)$/.test(value)) {
    return new Date(new Date(new Date().setFullYear(dateValue, 0, 1)).setHours(0, 0, 0, 0))
  }
  // 某年的结束时间
  else if (/(yeare)$/.test(value)) {
    return new Date(new Date(new Date().setFullYear(dateValue, 11, 31)).setHours(23, 59, 59, 999))
  }
  return null
}

/**
 * 提取日期字面量的值
 * @param value 
 * @returns 
 */
function parseDateString (value: string) {
  let [ label ] = value.split(/\s+/)
  let [ type ] = value.match(/(year|month|day|week)/) ?? []
  let date: any = {
    day: 0,
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }
  let val: number = date?.[type!] ?? 0
  if (/(\d+){4}/.test(label)) {
    val = Number(label)
  }
  else if (!isNaN(Number(label))) {
    val += Number(label)
  }
  return val
}

/**
 * 解析某个对象属性的文本内容
 * @param path 
 * @param env 
 * @returns 
 */
export function parseContent (path: string, env: any) {
  let val = get(env, path, '')
  return val.split('\n').join('\n\n').replace(/\"/g, '\\"')
}

/**
 * 解析参数
 * @param params 
 * @returns 
 */
export function parseParams (params: any) {
  return (data?: Record<string, any>) => {
    let parseData = merge(data, {})
    let str = isString(params) ? params : jsYaml.dump(params??'')
    let val = parseTemplate(str, parseData)
    return (jsYaml.load(val) || parseData) as Record<string, any>
  } 
}


export function parseTag (value?: string): { type?: string, val: string } {
  let [ type, val ] = String(value).split('::')
  if (!val) {
    return { val: type }
  }
  return { type, val }
}
