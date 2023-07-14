import { Module } from '@kenote/core'
import StoreController from './store'

@Module({
  path: '/',
  controller: [
    StoreController
  ]
})
export default class RootAPIControl {}