
import { compact, get, isFunction } from 'lodash'
import type { Command } from '@/types/base'



export function parseCommand<T> (value: string, tag?: string): Command.value<T> | null {
  if (!value) return null
  let tags = compact([ 'dialog', 'action', 'submit', 'command', 'router', 'https?', tag ]).join('|')
  let regex = new RegExp(`^(${tags})\\:(\\S+)$`)
  let command = value.match(regex)
  if (!command) return null
  let [ , type, path ] = command
  if (/^(https?)/.test(type)) {
    return { type: 'http', path: value }
  }
  return <Command.value<any>> { type, path }
}

export function runCommand (self: any, commands?: any) {
  return (value: string, row?: any, component?: any) => {
    let command = parseCommand(value)
    if (!command) return
    if (command.type === 'command') {
      let [ name, ...props ] = command.path.split('|')
      let runScript = get(commands ?? self, name)
      if (isFunction(runScript)) {
        runScript(...props)
      }
    }
    else if (command.type === 'action') {
      commands?.action(command.path, row, component, self)
    }
    else if (command.type === 'dialog') {
      commands?.dialog(command.path, row, component, self)
    }
    else if (command.type === 'submit') {
      commands?.submit(command.path, row, component, self)
    }
    else if (command.type === 'router') {
      self?.router.push(command.path)
    }
    else if (command.type === 'http') {
      if (!document) return
      let link = document.createElement('a')
      let [ href, target ] = command.path.split('|')
      link.href = href
      if (target) {
        link.target = target
      }
      link.click()
    }
  }
}