import { Module } from '@kenote/core'
import AccountController from './account'

@Module({
  path: '/api/v0',
  controller: [
    AccountController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiMainModule {}