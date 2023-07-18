import ruleJudgment, { isDateString } from 'rule-judgment'
import { toSafeInteger, isPlainObject, isBoolean, isArray, flattenDeep, cloneDeep, get, omit } from 'lodash'
import validator from 'validator'
import vm from 'vm'

export { default as logger } from './logger'
export { httpError, nextError, ErrorCode, ErrorMessage } from './error'
export * as db from './db'
export * as bcrypt from './bcrypt'

export const name = 'service'

export const customize = {
  isDateString: value => {
    let val = /^(\d)+$/.test(value) ? Number(value) : value
    return isDateString(val)
  },
  isPlainObject,
  isBoolean,
  toBoolean: value => validator.toBoolean(value),
  isEmail: value => value ? validator.isEmail(value) : true,
  isMobile: value => value ? validator.isMobilePhone(value, 'zh-CN') : true,
  isMongoId: value => value ? validator.isMongoId(value) : true,
  setTime (value: Date, hours: number = 0, min: number = 0, sec: number = 0, ms: number = 0) {
    return new Date(new Date(value).setHours(hours, min, sec, ms))
  },
  formatDate: value => {
    return value
  }
}