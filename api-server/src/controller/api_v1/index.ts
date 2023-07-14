import { Module } from '@kenote/core'
import ProxyController from './proxy'

@Module({
  path: '/api/v1',
  controller: [
    ProxyController
  ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class ApiProxyModule {}