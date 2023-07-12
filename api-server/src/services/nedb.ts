import Datastore from '@seald-io/nedb'
import path from 'path'
import fs from 'fs'

export function DB (channel: string) {
  return (name: string) => {
    let dbpath = path.resolve(process.cwd(), 'channels', channel, 'db/nedb')
    if (!fs.existsSync(dbpath)) {
      fs.mkdirSync(dbpath, { recursive: true })
    }
    return new Datastore({ filename: path.resolve(dbpath, name), autoload: true })
  }
}