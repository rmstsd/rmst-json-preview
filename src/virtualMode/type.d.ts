type renderItem = {
  type: 'leftBracket' | 'key-leftBracket' | 'rightBracket' | 'key-value' // 括号类型
  key: string | null
  renderValue: any // 渲染到页面的值
  deep: number // 缩进深度
  isComma?: boolean // 是否显逗号
  className?: string // 原始数据类型用的类名 控制颜色
  index?: number // 此条数据在整个数组中的索引
  open?: boolean // 打开与关闭
  rightBracket?: ']' | '}' // 右括号
  length?: number // 数组或者对象的长度
  dataType?: 'Array' | 'Object'
}
type renderArray = renderItem[]

type UBracketItem = { startIdx: number; endIdx: number; open: boolean }
type UBracketArray = UBracketItem[]
