import type { Verify } from '@/types/base'
import { isArray, merge } from 'lodash'

const validate: any = {
  validateUsername,
  validateEmail,
  validatePassword,
  validateRepassed
}

/**
 * 验证表单规则
 * @param options 
 * @param self 
 * @returns 
 */
export function useVerifyRule<T extends string> (options: Partial<Record<T, Verify.Rule[]>>, self?: any) {
  for (let [key, rule] of Object.entries<Verify.Rule[]>(<any>options)) {
    options[<T>key] = rule.map( item => {
      if (item.validator && isArray(item.validator)) {
        let [ name, ...props ] = item.validator
        let validator = validate?.[<string>name]
        if (validator) {
          return merge(item, { validator: validator(...props, self) })
        }
      }
      return item
    })
  }
  return options
}