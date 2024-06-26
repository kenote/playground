import { get, set, pick, assign } from 'lodash'
import type { Action } from '@/types/account'
import type { PlotOptions } from '@/types/account'

/**
 * 获取 Action 选项
 * @param actions 
 * @returns 
 */
export function getActionOptions (actions?: Record<string, Action>) {
  return (key?: string, name?: keyof Action) => {
    if (!key) return
    let options = get(actions, key)
    if (!name) return options
    return options?.[name]
  }
}

export function getActionByAssokey (actions?: Record<string, Action>) {
  return (assokey: string) => {
    for (let [key, val] of Object.entries(actions??{})) {
      if (val.options?.assokey == assokey) {
        return <Action> getActionOptions(actions)(key)
      }
    }
  }
}

/**
 * 写入 Cache 数据
 * @param env 
 * @param action 
 * @returns 
 */
export function setCacheData (env: Record<string, any>, action: Action) {
  return (payload: Record<string, any>, result: any) => {
    let { assokey, assignment, pageInfo, refresh } = action.options ?? {}
    if (!assokey || !assignment) return
    let __cache: Record<string, any> = {}
    for (let [key, name] of Object.entries(assignment)) {
      __cache[key] = get(result, name)
    }
    __cache['payload'] = payload
    pageInfo = pick(pageInfo, ['page', 'size', 'sort'])
    __cache['selection'] = []
    __cache['refresh'] = refresh
    if (refresh) {
      __cache['pageInfo'] = assign(pageInfo, { page: 1, sort: [] })
    }
    else {
      __cache['pageInfo'] = pageInfo
    }
    set(env, ['cache', assokey], __cache)
  }
}

/**
 * 获取 Cache 数据
 * @param env 
 * @returns 
 */
export function getCacheData (env: Record<string, any>) {
  return (name: string) => {
    return get(env, name)
  }
}

/**
 * 获取路由策略
 * @param routePath 
 * @param plots 
 * @returns 
 */
export function getRoutePlot (routePath: string, plots?: PlotOptions[]) {
  let [, channel, path] = routePath.split(/\//)
  return plots?.find( v => v.name == channel )?.pages.find( v => v.path == path )?.permissions
}

/**
 * 判断权限
 * @param level 
 * @param permissions 
 * @returns 
 */
export function isPermission (level: number, permissions?: string[]) {
  return (name: string) => {
    if (level >= 9998) return true
    return permissions?.includes(name)
  }
}