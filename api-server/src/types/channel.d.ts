
import { ChannelDataNode, HeaderOptions, FilterQuery } from '@kenote/common'

export declare namespace Channel {

  type DataNode = ChannelDataNode<PlusNode>

  interface PlusNode {
    type          ?: string
  }
}