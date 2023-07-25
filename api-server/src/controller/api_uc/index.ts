import { Module } from '@kenote/core'
import AccountController from './account'
import GroupController from './group'
import TicketController from './ticket'

@Module({
  path: '/api/uc',
  controller: [
    AccountController,
    GroupController,
    TicketController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiMainModule {}