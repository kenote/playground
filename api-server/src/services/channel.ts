import ruleJudgment from 'rule-judgment'
import { loadConfig } from '@kenote/config'
import type { ChannelDataNode } from '@kenote/common'
import type { Channel } from '~/types/channel'
import path from 'path'
import fs from 'fs'
import { map, orderBy } from 'lodash'

export function getNavigator () {
  let systemNavigator = loadConfig<Channel.DataNode[]>('config/channel', { type: 'array' })
  for (let node of systemNavigator) {
    node.type = 'system'
    node.label = node.label ?? node.key
    node.children = generateChannelNode(node.children ?? [], node.key)
  }
  let channelNavigator = readChannelSetting<Channel.DataNode>('navigator').filter(
    ruleJudgment<Channel.DataNode>({ label: { $nin: map(systemNavigator, 'label') }})
  )
  let navigator = systemNavigator.concat(channelNavigator)
  return orderBy(navigator, ['key'], ['asc'])
} 

export function readChannelSetting<T extends Channel.DataNode> (name: string) {
  let rootDir = path.resolve(process.cwd(), 'channels')
  let isDirectory = ruleJudgment<string>({ $where: v => fs.statSync(path.resolve(rootDir, v)).isDirectory() })
  let isConfFile = ruleJudgment({ $regex: new RegExp(`^(${name}\.(ya?ml|json5?|js))`) })
  let channels = fs.readdirSync(rootDir).filter(isDirectory)
  let info: T[] = []
  for (let channel of channels) {
    let isFile = ruleJudgment<string>({ $where: v => fs.statSync(path.resolve(rootDir, channel, v)).isFile() })
    let file = fs.readdirSync(path.resolve(rootDir, channel)).filter(isFile).find(isConfFile)
    if (!file) continue
    let conf = loadConfig<T>(path.resolve(rootDir, channel, file))
    conf.key = conf.key ?? `channel::${channel}`
    conf.label = conf.label ?? channel
    conf.route = conf.route ?? `/${channel}`
    conf.type = conf.type ?? 'other'
    conf.children = generateChannelNode(conf.children ?? [], conf.key)
    info.push(conf)
  }
  return info
}

function generateChannelNode<T extends ChannelDataNode<any>> (data: T[], name: string) {
  let __data: T[] = []
  let i: number = 0
  Number(i).toLocaleString()
  for (let node of data) {
    i++
    node.key = node.key ?? `${name}-${String(i).padStart(2, '0')}`
    if (node.children) {
      node.children = generateChannelNode(node.children, node.key)
    }
    __data.push(node)
  }
  return __data
}

export function readChannelFile (channel: string) {
  return (name: string) => {
    let filePath = path.resolve(process.cwd(), 'channels', channel, name)
    return fs.readFileSync(filePath, 'utf8')
  }
}