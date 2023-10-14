import { ContainerProps } from './container'
import { FormWrapProps } from './form-wrap'
import { FormItemProps } from './form-item'

export declare type ViewComponent = 'Container'
  | 'FormItem'
  | 'FormWrap'
  | 'WrapperPanel'

export declare type ViewOptions = ContainerProps
  | FormWrapProps
  | FormItemProps

export declare type ViewProps = {
  component    : ViewComponent
  options     ?: ViewOptions
  children    ?: ViewProps[]
}