import { Module } from '@kenote/core'
import AccountController from './account'
import GroupController from './group'
import TicketController from './ticket'
import ChannelController from './channel'
import UserController from './user'
import PlotController from './plot'

@Module({
  path: '/api/uc',
  controller: [
    AccountController,
    GroupController,
    TicketController,
    ChannelController,
    UserController,
    PlotController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiMainModule {}