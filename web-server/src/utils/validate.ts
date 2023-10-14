import validator from 'validator'
import { get } from 'lodash'

/**
 * 验证账户名
 * @param unique 
 * @param path 
 * @param uniqueFunc 
 * @returns 
 */
export function validateUsername (unique: string | null, path: string | null, self?: any) {
  return async (rule: any, value: any, callback: (message?: string) => any) => {
    if (!value) return callback()
    let valid = /^[a-zA-Z]{1}[a-zA-Z0-9\_\-]?/.test(value)
    if (!valid) {
      return callback('必须英文字符开头，可包含英文字符、数字、下划线及中划线')
    }
    if (value.length > 20 || value.length < 5) {
      return callback('至少5个字符，最大不能超过20个字符')
    }
    if (unique && self) {
      valid = await get(self, 'uniqueFunc')?.(value, path, unique)
      if (!valid) {
        return callback('该账户已被占用')
      }
    }
    return callback()
  }
}

/**
 * 验证密码合法性
 * @returns 
 */
export function validatePassword () {
  return (rule: any, value: any, callback: (message?: string) => any) => {
    if (!value) return callback()
    let valid = /^(?=.*[A-Za-z])[A-Za-z0-9$@$!%*#?&]/.test(value)
    if (!valid) {
      return callback('必须包含英文字符，可包含英文字符、数字和符号')
    }
    if (value.length > 20 || value.length < 8) {
      return callback('至少8个字符，最大不能超过20个字符')
    }
    return callback()
  }
}

/**
 * 验证确认密码
 * @param password 
 * @param form 
 * @returns 
 */
export function validateRepassed (password: string, self?: any) {
  return (rule: any, value: any, callback: (message?: string) => any) => {
    if (!value) return callback()
    let pass = self ? get(self, password) : password
    let valid = pass === value
    if (!valid) {
      return callback('两次输入的密码不一致')
    }
    return callback()
  }
}

/**
 * 验证电子邮箱
 * @param unique 
 * @param path 
 * @param uniqueFunc 
 * @returns 
 */
export function validateEmail (unique: string | null, path: string | null, self?: any) {
  return async (rule: any, value: any, callback: (message?: string) => any) => {
    if (!value) return callback()
    let valid = validator.isEmail(value)
    if (!valid) {
      return callback('请填写正确的邮箱地址，如 example@163.com')
    }
    if (unique && self) {
      valid = await get(self, 'uniqueFunc')?.(value, path, unique)
      if (!valid) {
        return callback('该邮箱地址已绑定其他帐号')
      }
    }
    return callback()
  }
}