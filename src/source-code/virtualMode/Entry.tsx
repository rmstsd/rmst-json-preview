import React, { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import Highlighter from 'react-highlight-words'

import { clapTabularFromJson, getAllBracket, isLeftBracketItem, isRightBracketItem } from './utils'
import VirtualList, { IVirtualListRef } from '../uiComponents/VirtualList'
import { useUpdate } from '../hooks'
import CopyIcon from './CopyIcon'

import './style.less'
import { IconArrowDown, IconArrowUp, IconClose } from './Svg'

const rowHeight = 24

type IEntryProps = {
  value: object
  indent: number
  containerHeight?: number
  style?: React.CSSProperties
  isVirtualMode?: boolean
  isFixedHeight?: boolean
  isShowArrayIndex?: boolean
}

type IHighlightSearch = { rowIndex: number; type: 'key' | 'renderValue'; match: RegExpMatchArray }

const defaultProps = {
  indent: 2,
  isVirtualMode: true,
  isShowArrayIndex: false,
  isFixedHeight: true
}

const Entry: React.FC<IEntryProps> = props => {
  const { value, indent, style, isVirtualMode, isFixedHeight, isShowArrayIndex } = {
    ...defaultProps,
    ...props
  }

  const update = useUpdate()

  const { tabularTotalList, matchBracket } = useMemo(() => {
    const tabularTotalList = clapTabularFromJson(value)
    const matchBracket = getAllBracket(tabularTotalList)

    return { tabularTotalList, matchBracket }
  }, [value])

  const [wd, setWd] = useState('')
  const [hightIndex, setHightIndex] = useState(-1)
  const [highlightSearchList, setHighlightSearchList] = useState<IHighlightSearch[]>([])
  const [searchVisible, setSearchVisible] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.addEventListener('keydown', evt => {
      return
      if (evt.ctrlKey && evt.code === 'KeyF') {
        evt.preventDefault()
        setSearchVisible(true)

        const selectionText = window.getSelection().toString()
        if (selectionText) {
          searchOnchange(selectionText)
        }

        setTimeout(() => {
          searchInputRef.current?.focus()
          searchInputRef.current.select()
        }, 0)
      }
      if (evt.code === 'Escape') {
        setSearchVisible(false)
      }
    })
  }, [])

  const closedArray = matchBracket.filter(o => !o.open)
  const renderedTotalList = tabularTotalList.filter(item =>
    closedArray.length ? !closedArray.some(p => item.index > p.startIdx && item.index <= p.endIdx) : true
  )

  const vListRef = useRef<IVirtualListRef>()

  useEffect(() => {
    if (hightIndex === -1 || !highlightSearchList[hightIndex]) {
      return
    }

    const arrIndex = renderedTotalList.findIndex(
      item => item.index === highlightSearchList[hightIndex].rowIndex
    )

    vListRef.current?.scrollToIndexIfNeed(arrIndex)
  }, [hightIndex])

  const handleExpand = (clickItem: IRenderItem, evt: React.MouseEvent) => {
    evt.stopPropagation()

    // todo: 处理自身的 open/close
    if (evt.shiftKey) {
      const bracketItem = matchBracket.find(o => o.startIdx === clickItem.index)
      const matchRangeBracket = matchBracket
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
        update()
        return
      }

      const bool = directChildrenBracket.some(item => item.open) ? false : true
      directChildrenBracket.forEach(item => {
        item.open = bool
      })

      update()
      return
    }

    closeCurrent()
    update()

    function closeCurrent() {
      const target = matchBracket.find(o => o.startIdx === clickItem.index)
      target.open = !target.open
    }
  }

  const handleClickRow = (clickItem: IRenderItem) => {
    let leftRenderItem: IRenderItem = clickItem

    if (!isLeftBracketItem(clickItem)) {
      const stack: IRenderItem[] = []
      const stf = renderedTotalList.filter(o => isLeftBracketItem(o) || isRightBracketItem(o))
      for (const renderedItem of stf) {
        const currentIsOpen = getCurrentOpen(renderedItem)

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
    const bracketItem = matchBracket.find(item => item.startIdx === leftRenderItem.index)

    tabularTotalList.forEach(item => {
      item.highlight = false
      item.highlightDeep = 0
    })

    for (let i = leftRenderItem.index + 1; i < bracketItem.endIdx; i++) {
      tabularTotalList[i].highlight = true

      let highlightDeep = clickItem.deep
      if (isRightBracketItem(clickItem) || isLeftBracketItem(clickItem)) highlightDeep += 1
      tabularTotalList[i].highlightDeep = highlightDeep
    }

    update()
  }

  const handleCopy = (clickItem: IRenderItem, evt: React.MouseEvent) => {
    evt.stopPropagation()
    navigator.clipboard.writeText(JSON.stringify(clickItem.mainValue, null, 2))
  }

  const getIsShowArrayKey = (item: IRenderItem) => {
    if (!item.key) return false
    if (item.parentDataType === 'Object') return true
    if (item.parentDataType === 'Array') return isShowArrayIndex
  }

  const getCurrentOpen = (renderedItem: IRenderItem) => {
    return matchBracket.find(o => o.startIdx === renderedItem.index)?.open
  }

  const searchOnchange = (value: string) => {
    const _wd = value
    setWd(_wd)

    if (!_wd) {
      setHighlightSearchList([])
      return
    }

    const _highlightSearchList = tabularTotalList.reduce<IHighlightSearch[]>((acc, item) => {
      if (typeof item.key === 'string') {
        const singleMatch = Array.from(item.key.matchAll(new RegExp(_wd, 'g')))

        if (singleMatch.length) {
          acc.push(...singleMatch.map(o => ({ rowIndex: item.index, type: 'key' as const, match: o })))
        }
      }
      if (typeof item.renderValue === 'string') {
        const singleMatch = Array.from(item.renderValue.matchAll(new RegExp(_wd, 'g')))

        if (singleMatch.length) {
          acc.push(
            ...singleMatch.map(o => ({ rowIndex: item.index, type: 'renderValue' as const, match: o }))
          )
        }
      }

      return acc
    }, [])

    setHightIndex(0)
    setHighlightSearchList(_highlightSearchList)
  }

  const getActiveIndex = (renderedItem: IRenderItem, type: IHighlightSearch['type']) => {
    const flatMatchItem = highlightSearchList[hightIndex]
    if (!searchVisible || !flatMatchItem) return -1

    if (renderedItem.index === flatMatchItem.rowIndex) {
      if (type === 'key') {
        const beforeIndex = highlightSearchList.findIndex(item => item.rowIndex === renderedItem.index)

        return hightIndex - beforeIndex
      }

      if (type === 'renderValue') {
        const beforeIndex = highlightSearchList.findIndex(
          item => item.rowIndex === renderedItem.index && item.type === 'renderValue'
        )

        return hightIndex - beforeIndex
      }
    }

    return -1
  }

  const updateHightIndex = (index: number) => {
    setHightIndex(index)

    const rowIndex = highlightSearchList[index].rowIndex
    const shouldOpenBrackets = matchBracket.filter(item => item.startIdx < rowIndex && rowIndex < item.endIdx)
    shouldOpenBrackets.forEach(item => {
      item.open = true
    })

    update()
  }

  const searchWords = searchVisible ? [wd] : []

  const renderRow = (item: IRenderItem) => {
    const isShowArrayIndex = getIsShowArrayKey(item)
    const currentOpen = getCurrentOpen(item)

    return (
      <div
        key={item.index}
        row-key={item.index}
        className="row-item"
        style={!isVirtualMode || (isVirtualMode && !isFixedHeight) ? { minHeight: rowHeight } : null}
        onClick={() => handleClickRow(item)}
      >
        <span className="line-numbers">{item.index}</span>
        {Array.from({ length: item.deep }).map((_, idx) => (
          <span
            key={idx}
            className={classNames('indent', {
              highlight: item.highlight && idx + 1 === item.highlightDeep
            })}
            style={{ width: indent * 20 }}
          />
        ))}

        {isShowArrayIndex && (
          <Highlighter
            className="key"
            activeClassName="highlightActive"
            highlightClassName="highlightClassName"
            activeIndex={getActiveIndex(item, 'key')}
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={item.key}
          />
        )}
        {isShowArrayIndex && (item.type === 'key-leftBracket' || item.type === 'key-value') && (
          <span className="colon">:</span>
        )}

        {isLeftBracketItem(item) && (
          <>
            <span className="expand-btn" onClick={evt => handleExpand(item, evt)}>
              {currentOpen ? '-' : '+'}
            </span>
            <CopyIcon onClick={evt => handleCopy(item, evt)} />
          </>
        )}

        {(item.type === 'leftBracket' || (item.type === 'key-leftBracket' && !currentOpen)) &&
          !currentOpen && <span>{item.dataType}</span>}

        <Highlighter
          className={`render-value ${item.className || ''}`}
          activeClassName="highlightActive"
          activeIndex={getActiveIndex(item, 'renderValue')}
          style={
            isVirtualMode
              ? isFixedHeight
                ? { whiteSpace: 'nowrap' }
                : { wordBreak: 'break-all', lineHeight: 1.3 }
              : null
          }
          highlightClassName="highlightClassName"
          searchWords={searchWords}
          autoEscape={true}
          textToHighlight={item.renderValue}
        />

        {isLeftBracketItem(item) && !currentOpen && (
          <>
            <span className="object-count">{item.length}</span>
            <span>{item.rightBracket}</span>
          </>
        )}

        {(item.isComma || (currentOpen === false && !item.isLastOne)) && <span>,</span>}
      </div>
    )
  }

  return (
    <div className="virtual-mode" style={{ ...style }}>
      <div
        className={classNames('custom-search-container', searchVisible && 'custom-search-container-visible')}
      >
        <input
          ref={searchInputRef}
          type="text"
          value={wd}
          onChange={evt => searchOnchange(evt.target.value)}
        />
        <span className="count-container">
          {highlightSearchList.length ? (
            <>
              <span>第 {hightIndex + 1} 项</span>, <span>共 {highlightSearchList.length} 项</span>
            </>
          ) : (
            '无结果'
          )}
        </span>
        <button
          className="find-match-btn"
          onClick={() => {
            const _v = hightIndex - 1
            updateHightIndex(_v === -1 ? highlightSearchList.length - 1 : _v)
          }}
        >
          <IconArrowUp />
        </button>

        <button
          className="find-match-btn"
          onClick={() => {
            const _v = hightIndex + 1
            updateHightIndex(_v === highlightSearchList.length ? 0 : _v)
          }}
        >
          <IconArrowDown />
        </button>

        <button className="find-match-btn" onClick={() => setSearchVisible(false)}>
          <IconClose />
        </button>
      </div>

      {/* <button
        style={{ position: 'absolute', top: 0, left: 200, zIndex: 10 }}
        onClick={() => {
          vListRef.current?.scrollToIndexIfNeed(60)
        }}
      >
        滚动到
      </button> */}

      {isVirtualMode ? (
        <VirtualList
          ref={vListRef}
          style={{ height: '100%' }}
          rowHeight={rowHeight}
          dataSource={renderedTotalList}
          renderRow={renderRow}
          isFixedHeight={isFixedHeight}
        />
      ) : (
        renderedTotalList.map(renderRow)
      )}
    </div>
  )
}

export default Entry
