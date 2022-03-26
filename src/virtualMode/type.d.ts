type renderItem = {
  type: 'leftBracket' | 'key-leftBracket' | 'rightBracket' | 'key-value'
  key: string | null
  renderValue: any
  deep: number
  isComma?: boolean
  className?: string
  index?: number
  open?: boolean
  rightBracket?: ']' | '}'
  length?: number
  dataType?: 'Array' | 'Object'
}
type renderArray = renderItem[]

type UBracketItem = { startIdx: number; endIdx: number; open: boolean }
type UBracketArray = UBracketItem[]
