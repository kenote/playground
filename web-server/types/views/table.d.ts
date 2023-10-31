import { TableColumn, Selection } from '../base'

export declare type TableProps = {

  data         ?: Record<string, any>[]
  columns      ?: TableColumn[]
  selection    ?: Selection | boolean
}