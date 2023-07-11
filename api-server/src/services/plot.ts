
import type { Plot } from '~/types/service/plot'
import { map } from 'lodash'
import ruleJudgment from 'rule-judgment'
import { Method, FilterQuery } from '@kenote/common'


const getChannels = (data: Plot<any>) => map(data.channels, 'name')

function getChannelOptions (data: Plot.ChannelOptions<any>[], channel: string) {
  return data.find( v => v.name == channel )
}

export function getAPIOptions (data: Plot.ChannelOptions<any>[], channel: string, path: string) {
  return getChannelOptions(data, channel)?.api?.find( v => v.path == path )
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