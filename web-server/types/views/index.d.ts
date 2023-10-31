import { ContainerProps } from './container'
import { FormWrapProps } from './form-wrap'
import { FormItemProps } from './form-item'

export declare type ViewComponent = 'Container'
  | 'Dialog' | 'DiglogForm'
  | 'FormItem'
  | 'FormWrap'
  | 'Table'
  | 'WrapperPanel'

export declare type ViewOptions = ContainerProps
  | FormWrapProps
  | FormItemProps

export declare type ViewProps = {
  component    : ViewComponent
  options     ?: ViewOptions
  children    ?: ViewProps[]
}