
export declare type ContainerProps = {
  name           ?: string
  layout         ?: string
  width          ?: number | string
  minWidth       ?: number | string
  maxWidth       ?: number | string
  height         ?: number | string
  minHeight      ?: number | string
  maxHeight      ?: number | string
  margin         ?: string
  padding        ?: string
  background     ?: string | Partial<Record<'color' | 'image' | 'repeat' | 'attachment' | 'position' | 'size' | 'clip' | 'origin', string>>
  border         ?: string | Record<string, string>
  justifyContent ?: string
  alignItems     ?: string
  flex           ?: string | Record<string, string>
  content        ?: string
}