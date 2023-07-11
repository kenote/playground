import { Module } from '@kenote/core'
import ProxyController from './proxy'

@Module({
  path: '/api',
  controller: [
    ProxyController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiModule {}