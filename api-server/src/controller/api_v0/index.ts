import { Module } from '@kenote/core'
import AccountController from './account'
import TicketController from './ticket'

@Module({
  path: '/api/v0',
  controller: [
    AccountController,
    TicketController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiMainModule {}