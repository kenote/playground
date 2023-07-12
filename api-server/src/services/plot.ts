import type { Plot } from '~/types/service/plot'
import ruleJudgment from 'rule-judgment'
import { loadConfig } from '@kenote/config'
import fs from 'fs'
import path from 'path'

/**
 * 获取频道策略
 */
function getChannelOptions (data: Plot.ChannelOptions<any>[], channel: string) {
  return data.find( v => v.name == channel )
}

/**
 * 获取策略
 */
export function getPlot (name: string = 'default') {
  let regxp = new RegExp(`^(${name})\.(ya?ml|json)$`)
  let filename = fs.readdirSync(path.resolve(process.cwd(), 'config/plots')).find( v => regxp.test(v) )
  let plot = loadConfig<Plot<any>>(`config/plots/${filename}`)
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