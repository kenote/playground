import { dataNodeProxy, initMaps, ChannelDataNode, removeMaps } from '@kenote/common'
import { cloneDeep, compact } from 'lodash'


export function toNavigatorRoute (node?: ChannelDataNode<any>) {
  return (navigator: ChannelDataNode<any>[]) => {
    let data = dataNodeProxy(initMaps(navigator))
    let root = data.find({ key: node?.maps?.[0].key })
    return urlResolve(root?.route, node?.route)
  }
}

function updateNavigatorNode (navs: ChannelDataNode<any>[], navigator: ChannelDataNode<any>[]) {
  let __navs = dataNodeProxy(navs)
  for (let nav of navs) {
    if (nav.children) {
      __navs.update(nav.key, { children: updateNavigatorNode(nav.children, navigator) })
    }
    if (nav.route) {
      __navs.update(nav.key, { route: toNavigatorRoute(__navs.find({ key: nav.key }))(navigator) })
    }
  }
  return __navs.data
}

export function updateNavigatorRoute (navigator: ChannelDataNode<any>[] = []) {
  let __navs = dataNodeProxy(initMaps(navigator))
  for (let channel of __navs.data) {
    if (channel.children) {
      __navs.update(channel.key, { children: updateNavigatorNode(channel.children, navigator) })
    }
  }
  return removeMaps(__navs.data)
}

export function urlResolve (from: string | undefined, to: string | undefined) {
  return compact([from, to]).map(toURLPath).join('')
}

function toURLPath (value?: string) {
  if (!value) return
  let val = value
  if (!/^(https?|\/)/.test(value)) {
    val = `/${value}`
  }
  return val.replace(/(\/)$/, '')
}