import jwt from 'jsonwebtoken'
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallbackWithRequest } from 'passport-jwt'
import { serverConfigure } from '~/config'
import * as service from '~/services'
import type { Jwtpayload } from '~/types'

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
  secretOrKey: serverConfigure.SECRET_KEY
}

const strategyVerify: VerifyCallbackWithRequest = async (req, payload: Jwtpayload, done) => {
  let jwtoken = req.headers.authorization?.replace(/^(Bearer)\s{1}/, '')
  try {
    let user = await service.db.user.Dao.findOne({ _id: payload?._id, jwtoken })
    if (user == null) {
      return done(null, false)
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

export const strategyJwt = new Strategy(jwtOptions, strategyVerify)

export const setJwToken = (payload: Jwtpayload, options?: jwt.SignOptions) =>
  jwt.sign(payload, serverConfigure.SECRET_KEY, options)

export const verifyJwToken = (token: string, options?: jwt.VerifyOptions) =>
  token ? <Jwtpayload>jwt.verify(token, serverConfigure.SECRET_KEY, options) : null