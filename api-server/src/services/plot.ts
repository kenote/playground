import type { Plot } from '~/types/service/plot'
import ruleJudgment from 'rule-judgment'
import { loadConfig } from '@kenote/config'
import fs from 'fs'
import path from 'path'
import { set } from 'lodash'

const plotDir = path.resolve(process.cwd(), 'config/plots')

/**
 * 获取频道策略
 */
function getChannelOptions (data: Plot.ChannelOptions<any>[], channel: string) {
  return data.find( v => v.name == channel )
}

export function getPlotList () {
  let list = fs.readdirSync(plotDir).filter(isPlotFile)
    .map( v => v.replace(/\.(ya?ml|json)$/, '') )
    .sort( 
      (a,b) => a.replace(/^(default)$/, '0$1') > b.replace(/^(default)$/, '0$1') ? 1 : -1
    )
  let __list: Plot<any>[] = []
  for (let name of list) {
    let plot = getPlot(name)
    plot && __list.push(plot)
  }
  return __list
}

function isPlotFile (name: string) {
  let stat = fs.statSync(path.resolve(plotDir, name))
  if (!stat.isFile()) return false
  if (!/\.(ya?ml|json)$/.test(name)) return false
  return true
}

/**
 * 获取策略
 */
export function getPlot (name: string = 'default') {
  let regxp = new RegExp(`^(${name})\.(ya?ml|json)$`)
  let filename = fs.readdirSync(plotDir).find( v => regxp.test(v) )
  let plot = loadConfig<Plot<any>>(`config/plots/${filename}`)
  if (plot) {
    set(plot, 'key', name)
    !plot.name && set(plot, 'name', name)
  }
  return plot
}

/**
 * 判断 API 策略
 */
export function isPlotAPI (channel: string, pathname: string, method: string) {
  return (plot: Plot.ChannelOptions<any>[]) => {
    let filter = ruleJudgment<Plot.APIOptions>({
      path: pathname,
      ...(method == 'GET' ?  {
        $or: [
          { method: { $_in: [ method ] }},
          { method: { $exists: false }}
        ]
      }
      : {
          method: { $_in: [ method ] }
        }
      )
    })
    return !!getChannelOptions(plot, channel)?.api.find(filter)
  }
}