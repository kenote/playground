import { modelDao } from '@kenote/mongoose'
import { getModelForClass } from '@typegoose/typegoose'
import * as entities from '~/entities'
import type * as DB from '~/types/service/db'
import { FilterQuery, Model, Document, UpdateQuery } from 'mongoose'
import { merge, omit, keys } from 'lodash'
import type { Account } from '~/types/service/account'
import * as Bcrypt from '~/services/bcrypt'
import { ErrorCode, httpError } from '~/services/error'
import * as db from '.'
import mailer, { mailSender, parseMailUser, SITE_NAME, SITE_URL, sendMailNext } from '~/services/mailer'
import Mail from 'nodemailer/lib/mailer'
import nunjucks from 'nunjucks'
import { AccountConfigure } from '~/types/config'
import { toTime } from '~/utils'
import { loadConfig } from '@kenote/config'
import ruleJudgment from 'rule-judgment'

export const model = getModelForClass(entities.User)
export const Dao = modelDao<DB.user.User>(model as unknown as Model<Document, {}>, {
  populate: [
    {
      path: 'group',
      select: [ 'id', 'name', 'level', 'description', 'plot' ]
    }
  ]
})

export function safeUser (data: DB.user.User, payload?: Partial<DB.user.SafeUser>) {
  if (!data) return
  let user = merge(data?.toObject({ virtuals: true }), payload)
  return <DB.user.SafeUser> omit(user, ['encrypt', 'salt', 'jwtoken'])
}

export async function login (doc: Account.login) {
  let conditions: FilterQuery<DB.user.User> = {
    $or: [
      { username: doc.username },
      { email: doc.username },
      { mobile: doc.username }
    ]
  }
  let user = await Dao.findOne(conditions)
  if (!user) {
    throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
  }
  let { encrypt } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let valide = Bcrypt.compare(encrypt)(doc.password!, user.encrypt, user.salt)
  if (!valide) {
    throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
  }
  return user
}

export async function create (doc: DB.user.Register) {
  let { username, email, mobile } = doc
  let unique_username = await Dao.findOne({ username: { $eq: username }})
  if (unique_username) {
    throw httpError(ErrorCode.ERROR_VALID_USERNAME_UNIQUE)
  }
  let unique_email = await Dao.findOne({ email: { $eq: email }})
  if (unique_email) {
    throw httpError(ErrorCode.ERROR_VALID_EMAIL_UNIQUE)
  }
  let unique_mobile = await Dao.findOne({ mobile: { $eq: mobile }})
  if (unique_mobile) {
    throw httpError(ErrorCode.ERROR_VALID_MOBILE_UNIQUE)
  }
  let { password: options, encrypt } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let pass = doc.password ?? Bcrypt.randomPassword(options)
  let password = Bcrypt.encode(encrypt)(pass)
  let user: DB.user.NewUser = merge(omit(doc, ['password']), password)
  let result = await Dao.create(user)
  return { user: safeUser(result), pass }
}

export async function register (doc: DB.user.Register, options: Account.registerOptions, invitation: string = '') {
  let ticket: DB.ticket.Ticket | null = null
  if (options.invitation) {
    ticket = await db.ticket.valid(invitation, '邀请码', 'resgister')
    let group = await db.group.Dao.findOne({ _id: ticket.content })
    doc.group = group._id
  }
  let store = await create(doc)
  if (ticket && store.user) {
    await db.ticket.Dao.updateOne({ _id: ticket._id }, { $inc: { usage: 1 } })
  }
  if (options.emailVerify && store.user) {
    await sendMailByVerify(store.user, options.emailVerify)
  }
  return store
}

export async function sendMailByVerify (user: DB.user.SafeUser, options: AccountConfigure.emailVerify) {
  let { timeout, url } = options
  await db.verify.Dao.remove({ type: 'email', user: user._id })
  let verify = await db.verify.create({ type: 'email', user: user._id })
  let mailOptions: Mail.Options = {
    from: mailSender,
    to: parseMailUser(user),
    subject: `${SITE_NAME}邮箱验证`
  }
  let content = {
    site_name: SITE_NAME,
    username: user.username,
    email_verify_url: nunjucks.renderString(url, { siteUrl: SITE_URL, verify }),
    timeout: toTime(timeout) / 3600
  }
  mailer.sendMail('email_verify.mjml', content)(mailOptions, sendMailNext)
}

export async function verifyEmailMobile (doc: Account.verifyEmailMobile<{ type: Account.verifyUserType}>, options: AccountConfigure.emailVerify) {
  let warnings: DB.user.VerifyWarning = {
    email: {
      timeout: ErrorCode.ERROR_VERIFY_EMAIL_TIMEOUT,
      falied: ErrorCode.ERROR_VERIFY_EMAIL_FAILED
    },
    mobile: {
      timeout: ErrorCode.ERROR_VERIFY_MOBILE_TIMEOUT,
      falied: ErrorCode.ERROR_VERIFY_MOBILE_FAILED
    }
  }
  let verify = await db.verify.Dao.findOne(doc)
  if (!verify) {
    throw httpError(warnings?.[doc.type].falied)
  }
  let difftime = Date.now() - verify.create_at.getTime()
  let timeout = toTime(options.timeout, true)
  if (difftime > timeout) {
    throw httpError(warnings?.[doc.type].timeout)
  }
  if (verify.approved) {
    throw httpError(ErrorCode.ERROR_VERIFY_TOKEN_VERIFIED)
  }
  await db.verify.Dao.updateOne({ _id: verify._id }, { approved: true })
  await Dao.updateOne({ _id: verify.user._id }, { $addToSet: { binds: doc.type } })
  return verify
}


export async function updateInfo (conditions: FilterQuery<DB.user.User>, doc: Partial<DB.user.Register>) {
  let data = <Partial<DB.user.User>> omit(doc, ['password'])
  if (doc.password) {
    let { encrypt } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
    let pass = doc.password
    let password = Bcrypt.encode(encrypt)(pass)
    data.encrypt = password.encrypt
    data.salt = password.salt
  }
  data.update_at = new Date()
  return await Dao.updateOne(conditions, data)
}