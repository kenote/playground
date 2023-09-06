import path from 'path'
import { Mailer, MailerSetting } from '@kenote/mailer'
import { renderString } from 'nunjucks'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '~/types/config'
import type * as DB from '~/types/service/db'
import logger from './logger'

const { smtpOptions, mailDir, asyncRetryOptions } = loadConfig<MailerSetting>('config/mailer', { mode: 'merge' })

export default new Mailer({
  mailDir: path.resolve(process.cwd(), mailDir??'mails'),
  smtpOptions,
  asyncRetryOptions,
  renderString
})

export const { SITE_NAME, SITE_URL } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
export const mailSender = `${SITE_NAME} <${smtpOptions.auth?.user}>`
export const parseMailUser = (user: Partial<DB.user.SafeUser>): string => `${user.username ?? user.email} <${user.email}>`

export function sendMailNext (err: any, info: any) {
  if (err) {
    logger.error(err?.message)
  }
  logger.info(info)
}