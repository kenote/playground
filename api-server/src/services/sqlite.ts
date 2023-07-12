import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

export function DB (channel: string) {
  return (name: string) => {
    let dbpath = path.resolve(process.cwd(), 'channels', channel, 'db/sqlite')
    if (!fs.existsSync(dbpath)) {
      fs.mkdirSync(dbpath, { recursive: true })
    }
    return new Database(path.resolve(dbpath, name))
  }
}