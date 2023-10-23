
export declare type DialogProps = {
  title              ?: string
  visible            ?: boolean
  width              ?: number | string
  height             ?: number | string
  center             ?: boolean
  fullscreen         ?: boolean
  closeOnClickModal  ?: boolean
  closeOnPressEscape ?: boolean
  showClose          ?: boolean
  draggable          ?: boolean
  lockScroll         ?: boolean
  modal              ?: boolean
  showFullscreen     ?: boolean
  cancelButtonText   ?: string
  confirmButtonText  ?: string
  showFooter         ?: boolean | 'confirm'
  content            ?: string
}