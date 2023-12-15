import { assign, merge, get, isDate, isString, compact, cloneDeep, isArray, isPlainObject, omit, template, isFunction, isBoolean } from 'lodash'
import jsYaml from 'js-yaml'
import { PropDataItem } from '@/types/base'
import { toValue, ParseData, formatData } from 'parse-string'
import { evaluate } from 'eval5'
import { FilterQuery } from '@kenote/common'
import ruleJudgment from 'rule-judgment'
import dayjs from 'dayjs'

export const customize: Record<string, Function> = {
  // 格式化日期时间
  dateFormat: (date: any, format: string = 'YYYY-MM-DD') => dayjs(date).format(format),
  
}

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

/**
 * 解析 Tag
 * @param value 
 * @returns 
 */
export function parseTag (value?: string): { type?: string, val: string } {
  let [ type, val ] = String(value).split('::')
  if (!val) {
    return { val: type }
  }
  return { type, val }
}

/**
 * 转像素大小
 * @param value 
 * @returns 
 */
export function toPixelSize (value?: number | string) {
  if (!value) return
  return compact(String(value).split(/\s+/)).map( v => {
    if (/^(\d\.?)+$/.test(v)) {
      return v + 'px'
    }
    if (v == 'auto') {
      return '100%'
    }
    return v
  }).join(' ')
}

/**
 * 映射对象
 * @param props 
 */
export function parseProps<T extends {}> (props?: Record<string, string>) {
  return (data: Record<string, any>) => {
    if (!props) return data as T
    let result = cloneDeep(data)
    let keys: string[] = []
    for (let [key, val] of Object.entries(props)) {
      let ret = get(data, val)
      if (isArray(ret)) {
        result[key] = ret?.map( v => isPlainObject(v) ? parseProps(props)(v) : v )
      }
      else {
        result[key] = /(\{)/.test(val) ? parseTemplate(val, data) : ret
      }
      if (key !== val) {
        keys.push(val)
      }
    }
    return omit(result, keys) as T
  }
}

/**
 * 转换格式化字符串
 * @param props 
 * @returns 
 */
export function toFormatString (props?: Partial<Record<keyof PropDataItem, string>>) {
  return (data: Record<string, any>, format: string = '{label}') => {
    if (props) {
      for (let item in Object.keys(props)) {
        if (props?.[<keyof PropDataItem>item]) {
          format = format.replace(new RegExp(`{${item}}`, 'g'), `{${props?.[<keyof PropDataItem>item]}}`)
        }
      }
    }
    try {
      return template(format, { interpolate: /{([\s\S]+?)}/g })(data)
    } catch (error) {
      return format
    }
    
  }
}

/**
 * 解析成 Function 函数
 * @param value 
 * @returns 
 */
export function parseFunction (value: string | Function) {
  if (isString(value)) {
    try {
      return <Function> evaluate(`(${value})`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  else if (isFunction(value)) {
    return value
  }
  return 
}

/**
 * 将时间转成 Date
 * @param value 
 * @returns 
 */
export function parseTime (value: string, __date?: Date | null) {
  if (!value) return null
  let [ hours, minutes, seconds ] = value.split(':').map( v => toValue('number')(v) == 'NaN' ? 0 : toValue('number')(v) )
  let date = __date??new Date()
  date.setHours(hours??0)
  date.setMinutes(minutes??0)
  date.setSeconds(seconds??0)
  return date
}

/**
 * 判断是否禁用
 * @param env 
 * @returns 
 */
export function isDisabled (env?: Record<string, any>) {
  return (disabled?: boolean | FilterQuery<any> | string, props?: Record<string, any>) => {
    if (!disabled) return false
    let query = disabled
    let data = assign({}, env, props)
    if (isString(disabled)) {
      query = <FilterQuery<any>> jsYaml.load(parseTemplate(disabled, data))
      if (!isPlainObject(query)) return false
    }
    if (isBoolean(query)) return query
    let filter = ruleJudgment(<FilterQuery<any>>query)
    return filter(data)
  }
}

/**
 * 附加 Disable 属性
 * @param env 
 * @param disabled 
 * @returns 
 */
export function appendDisabled (env: Record<string, any>, disabled?: boolean | FilterQuery<any> | string) {
  return (row: Record<string, any>) => {
    row.disabled = isDisabled(env)(disabled, { row })
    return row
  }
}

/**
 * 判断是否过滤
 * @param conditions 
 * @param env 
 */
export function isFilter (env?: Record<string, any>) {
  return (conditions?: FilterQuery<any> | string, props?: Record<string, any>) => {
    if (!conditions) return true
    let query = conditions
    let data = assign({}, env, props)
    if (isString(conditions)) {
      query = <FilterQuery<any>> jsYaml.load(parseTemplate(conditions, data))
      if (!isPlainObject(query)) return true
    }
    let filter = ruleJudgment(<FilterQuery<any>>query)
    return filter(data)
  }
}

/**
 * 获取过滤器
 * @param conditions 
 * @param props 
 */
export function getFilter (conditions?: FilterQuery<any> | string, props: Record<string, any> = {}) {
  if (!conditions) return (data: any) => true
  let query = <FilterQuery<any>> conditions
  if (isString(conditions)) {
    query = <FilterQuery<any>> jsYaml.load(parseTemplate(conditions, { ...props }))
  }
  if (!isPlainObject(query)) return (data: any) => true
  return ruleJudgment(query)
}

/**
 * 获取过滤条件
 * @param conditions 
 * @param props 
 */
export function getConditions (conditions?: FilterQuery<any> | string, props: Record<string, any> = {}) {
  if (!conditions) return null
  let query = conditions
  if (isString(conditions)) {
    query = <FilterQuery<any>> jsYaml.load(parseTemplate(conditions, { ...props }))
  }
  if (!isPlainObject(query)) return null
  return <FilterQuery<any>> query
}

/**
 * 格式化字符串
 * @param customize 
 * @returns 
 */
export function formatString (customize: Record<string, Function>, env?: Record<string, any>) {
  return (value: any, format?: ParseData.format | ParseData.format[], replace?: string | number) => {
    if (!value && value !== 0) return replace ?? value
    if (!format) return value
    if (!isArray(format) && isString(format.maps) && /^(cache)/.test(format.maps)) {
      let list: any[] = get(env, format.maps)
      let [key, name] = format.options ?? ['key', 'label']
      let item = list?.find( v => v?.[key] == value )
      if (item) {
        return format.substr ? toFormatString()(item, format.substr) : item?.[name]
      }
    }
    return formatData(format, customize)(value)
  }
}