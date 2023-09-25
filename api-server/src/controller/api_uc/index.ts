import { Module } from '@kenote/core'
import AccountController from './account'
import GroupController from './group'
import TicketController from './ticket'
import ChannelController from './channel'

@Module({
  path: '/api/uc',
  controller: [
    AccountController,
    GroupController,
    TicketController,
    ChannelController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiMainModule {}