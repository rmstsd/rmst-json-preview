import { isArray, isPrimary } from './utils'

export type Option = {
  value: any
}

export type HighlightSearch = { rowIndex: number; type: 'key' | 'renderValue'; match: RegExpMatchArray }

export type IRenderItem = {
  type: 'leftBracket' | 'key-leftBracket' | 'rightBracket' | 'key-value' // 括号类型
  key: string | null
  renderValue: any // 渲染到页面的值
  deep: number // 缩进深度
  isComma?: boolean // 是否显逗号
  isLastOne?: boolean // 是否是最后一个
  className?: string // 原始数据类型用的类名 控制颜色
  index?: number // 此条数据在整个数组中的索引
  open?: boolean // 打开与关闭
  rightBracket?: ']' | '}' // 右括号
  length?: number // 数组或者对象的长度
  dataType?: 'Array' | 'Object'
  parentDataType?: 'Array' | 'Object'
  mainValue?: unknown
  highlight?: boolean
  highlightDeep?: number
}

export type IBracketItem = { startIdx: number; endIdx: number; open: boolean }

class PreviewCore {
  constructor(option: Option) {
    this.updateOption(option)
  }

  tabularTotalList: IRenderItem[]
  renderedTotalList: IRenderItem[]
  matchBracket: IBracketItem[]

  updateOption(option: Option) {
    const { value } = option

    const tabularTotalList = clapTabularFromJson(value)
    const matchBracket = getAllBracket(tabularTotalList)

    this.tabularTotalList = tabularTotalList
    this.matchBracket = matchBracket

    this.calcRenderedTotalList()
  }

  calcRenderedTotalList() {
    const closedArray = this.matchBracket.filter(o => !o.open)
    const renderedTotalList = this.tabularTotalList.filter(item =>
      closedArray.length ? !closedArray.some(p => item.index > p.startIdx && item.index <= p.endIdx) : true
    )

    this.renderedTotalList = renderedTotalList
  }

  handleExpand(clickItem: IRenderItem, shiftKey: boolean) {
    const closeCurrent = () => {
      const target = this.matchBracket.find(o => o.startIdx === clickItem.index)
      target.open = !target.open
    }

    // todo: 处理自身的 open/close
    if (shiftKey) {
      const bracketItem = this.matchBracket.find(o => o.startIdx === clickItem.index)
      const matchRangeBracket = this.matchBracket
        .filter(o => o.startIdx > bracketItem.startIdx && o.endIdx < bracketItem.endIdx)
        .sort((a, b) => a.startIdx - b.startIdx)

      let last = bracketItem.startIdx
      const directChildrenBracket: IBracketItem[] = [] // 直接子级们
      for (const item of matchRangeBracket) {
        if (item.startIdx > last) {
          directChildrenBracket.push(item)
          last = item.endIdx
        }
      }

      if (!directChildrenBracket.length) {
        closeCurrent()

        return
      }

      const bool = directChildrenBracket.some(item => item.open) ? false : true
      directChildrenBracket.forEach(item => {
        item.open = bool
      })

      return
    }

    closeCurrent()

    this.calcRenderedTotalList()
  }

  getCurrentOpen(renderedItem: IRenderItem) {
    return this.matchBracket.find(o => o.startIdx === renderedItem.index)?.open
  }

  handleClickRow(clickItem: IRenderItem) {
    let leftRenderItem: IRenderItem = clickItem

    if (!isLeftBracketItem(clickItem)) {
      const stack: IRenderItem[] = []
      const stf = this.renderedTotalList.filter(o => isLeftBracketItem(o) || isRightBracketItem(o))
      for (const renderedItem of stf) {
        const currentIsOpen = this.getCurrentOpen(renderedItem)

        // 左括号入栈, 只将展开的入栈, 否则括号数量不匹配
        if (isLeftBracketItem(renderedItem) && currentIsOpen) {
          stack.push(renderedItem)
        }

        if (isRightBracketItem(renderedItem)) {
          if (clickItem.index >= stack.at(-1).index && clickItem.index <= renderedItem.index) {
            leftRenderItem = stack.at(-1)
            break
          }
          stack.pop()
        }
      }
    }
    const bracketItem = this.matchBracket.find(item => item.startIdx === leftRenderItem.index)

    this.tabularTotalList.forEach(item => {
      item.highlight = false
      item.highlightDeep = 0
    })

    for (let i = leftRenderItem.index + 1; i < bracketItem.endIdx; i++) {
      this.tabularTotalList[i].highlight = true

      let highlightDeep = clickItem.deep
      if (isRightBracketItem(clickItem) || isLeftBracketItem(clickItem)) highlightDeep += 1
      this.tabularTotalList[i].highlightDeep = highlightDeep
    }
  }

  searchWd(wd: string): HighlightSearch[] {
    const highlightSearchList = this.tabularTotalList.reduce<HighlightSearch[]>((acc, item) => {
      if (typeof item.key === 'string') {
        const singleMatch = Array.from(item.key.matchAll(new RegExp(wd, 'g')))

        if (singleMatch.length) {
          acc.push(...singleMatch.map(o => ({ rowIndex: item.index, type: 'key' as const, match: o })))
        }
      }
      if (typeof item.renderValue === 'string') {
        const singleMatch = Array.from(item.renderValue.matchAll(new RegExp(wd, 'g')))

        if (singleMatch.length) {
          acc.push(
            ...singleMatch.map(o => ({ rowIndex: item.index, type: 'renderValue' as const, match: o }))
          )
        }
      }

      return acc
    }, [])

    return highlightSearchList
  }

  openBracket(rowIndex: number) {
    const shouldOpenBrackets = this.matchBracket.filter(
      item => item.startIdx < rowIndex && rowIndex < item.endIdx
    )
    shouldOpenBrackets.forEach(item => {
      item.open = true
    })

    this.calcRenderedTotalList()
  }
}

export default PreviewCore

export const isLeftBracketItem = (item: IRenderItem) => {
  return item.type === 'leftBracket' || item.type === 'key-leftBracket'
}

export const isRightBracketItem = (item: IRenderItem) => {
  return item.type === 'rightBracket'
}

function clapTabularFromJson(value: object, deep: number = 1) {
  const ans: IRenderItem[] = []
  ans.push({
    type: 'leftBracket',
    key: null,
    renderValue: isArray(value) ? '[' : '{',
    length: Object.keys(value).length,
    dataType: isArray(value) ? 'Array' : 'Object',
    deep: 0,
    open: true,
    rightBracket: isArray(value) ? ']' : '}',
    mainValue: value
  })

  getAllRow(value, deep)

  ans.push({
    type: 'rightBracket',
    key: null,
    renderValue: isArray(value) ? ']' : '}',
    rightBracket: isArray(value) ? ']' : '}',
    deep: 0
  })

  return ans.map((x, index) => ({ index, ...x }))

  function getAllRow(value: any, deep: number): void {
    const keys = Object.keys(value)
    keys.forEach((key, idx) => {
      let mainValue = value[key]

      // 如果是原始类型
      if (isPrimary(mainValue)) {
        ans.push({
          type: 'key-value',
          key,
          renderValue: typeof mainValue === 'string' ? `'${mainValue}'` : String(mainValue),
          deep,
          isComma: idx !== keys.length - 1,
          className: mainValue === null ? 'null' : typeof mainValue,
          parentDataType: isArray(value) ? 'Array' : 'Object',
          mainValue
        })
      } else {
        handleObject()
      }

      function handleObject() {
        ans.push({
          type: 'key-leftBracket',
          key,
          renderValue: isArray(mainValue) ? '[' : '{',
          rightBracket: isArray(mainValue) ? ']' : '}',
          deep,
          open: true,
          isLastOne: idx == keys.length - 1,
          length: Object.keys(mainValue).length,
          dataType: isArray(mainValue) ? 'Array' : 'Object',
          parentDataType: isArray(value) ? 'Array' : 'Object',
          mainValue
        })

        getAllRow(mainValue, deep + 1)

        ans.push({
          type: 'rightBracket',
          key: null,
          renderValue: isArray(mainValue) ? ']' : '}',
          deep,
          isComma: idx !== keys.length - 1
        })
      }
    })
  }
}

function getAllBracket(array: IRenderItem[]) {
  const ak = array.filter(item => ['leftBracket', 'key-leftBracket', 'rightBracket'].includes(item.type))

  const bracketArray: IBracketItem[] = []
  const stack: number[] = []

  ak.forEach(item => {
    if (['[', '{'].includes(item.renderValue)) stack.push(item.index)
    else bracketArray.push({ startIdx: stack.pop(), endIdx: item.index, open: true })
  })

  return bracketArray
}
