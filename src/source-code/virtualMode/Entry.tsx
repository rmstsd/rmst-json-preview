import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Highlighter from 'react-highlight-words'

import PreviewCore, { isLeftBracketItem, HighlightSearch, IRenderItem } from './previewCore'

import VirtualListComponent, { IVirtualListRef } from '../../components/VirtualList'
import { useUpdate } from '../hooks'
import CopyIcon from './components/CopyIcon'

import './style.less'

import VirtualListVue from '../../components/virtual-scroll-list'
import SearchTool from './components/SearchTool'

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

  const previewCoreRef = useRef(new PreviewCore({ value }))
  const vListRef = useRef<IVirtualListRef>()

  const up = useUpdate()

  const [wd, setWd] = useState('')
  const [hightIndex, setHightIndex] = useState(-1)
  const [highlightSearchList, setHighlightSearchList] = useState<HighlightSearch[]>([])
  const [searchVisible, setSearchVisible] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [keeps, setKeeps] = useState(0)
  const [lineNumberWidth, setLineNumberWidth] = useState(0)

  useEffect(() => {
    previewCoreRef.current.updateOption({ value })
    onSearchChange(wd)

    up()
  }, [value])

  useLayoutEffect(() => {
    const keeps = Math.ceil(document.querySelector('.VirtualListVueContainer')?.clientHeight / rowHeight) + 1
    setKeeps(keeps)

    const span = document.createElement('span')
    span.style.setProperty('display', 'inline-block')
    span.innerText = String(previewCoreRef.current.tabularTotalList.at(-1).index)
    document.body.appendChild(span)

    setLineNumberWidth(span.offsetWidth)
    span.remove()

    return
    document.addEventListener('keydown', evt => {
      if (evt.ctrlKey && evt.code === 'KeyF') {
        evt.preventDefault()
        setSearchVisible(true)

        const selectionText = window.getSelection().toString()
        if (selectionText) {
          onSearchChange(selectionText)
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

  useEffect(() => {
    if (hightIndex === -1 || !highlightSearchList[hightIndex]) {
      return
    }

    const arrIndex = previewCoreRef.current.renderedTotalList.findIndex(
      item => item.index === highlightSearchList[hightIndex].rowIndex
    )

    vListRef.current?.scrollToIndexIfNeed(arrIndex)
  }, [hightIndex])

  const handleExpand = (clickItem: IRenderItem, evt: React.MouseEvent) => {
    evt.stopPropagation()
    previewCoreRef.current.handleExpand(clickItem, evt.shiftKey)
    up()
  }

  const handleClickRow = (clickItem: IRenderItem) => {
    previewCoreRef.current.handleClickRow(clickItem)
    up()
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

  const onSearchChange = (value: string) => {
    const _wd = value
    setWd(_wd)

    if (!_wd) {
      setHighlightSearchList([])
      return
    }

    const _highlightSearchList = previewCoreRef.current.searchWd(_wd)

    setHightIndex(0)
    setHighlightSearchList(_highlightSearchList)
  }

  const updateHightIndex = (index: number) => {
    setHightIndex(index)

    const rowIndex = highlightSearchList[index].rowIndex
    previewCoreRef.current.openBracket(rowIndex)

    up()
  }

  const getActiveIndex = (renderedItem: IRenderItem, type: HighlightSearch['type']) => {
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

  const renderRow = (item: IRenderItem) => {
    const isShowArrayIndex = getIsShowArrayKey(item)
    const currentOpen = previewCoreRef.current.getCurrentOpen(item)

    const searchWords = searchVisible ? [wd] : []

    return (
      <div
        key={item.index}
        row-key={item.index}
        className="row-item"
        style={{ minHeight: rowHeight }}
        onClick={() => handleClickRow(item)}
      >
        <span className="line-numbers" style={{ width: lineNumberWidth }}>
          {item.index}
        </span>
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
          // style={
          //   isVirtualMode
          //     ? isFixedHeight
          //       ? { whiteSpace: 'noWrap' }
          //       : { wordBreak: 'break-all', lineHeight: 1.3 }
          //     : null
          // }
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

  const VirtualJsx = (
    // <VirtualListComponent
    //   ref={vListRef}
    //   style={{ height: '100%' }}
    //   rowHeight={rowHeight}
    //   dataSource={previewCoreRef.current.renderedTotalList}
    //   renderRow={renderRow}
    //   isFixedHeight={isFixedHeight}
    // />

    <VirtualListVue
      dataKey="index"
      dataSources={previewCoreRef.current.renderedTotalList}
      dataComponent={item => renderRow(item.source)}
      keeps={keeps}
      buffer={0}
      style={{ overflow: 'auto', height: '100%' }}
      className="VirtualListVueContainer"
    />
  )

  return (
    <div className="virtual-mode" style={{ ...style }}>
      <SearchTool
        searchInputRef={searchInputRef}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
        wd={wd}
        hightIndex={hightIndex}
        updateHightIndex={updateHightIndex}
        highlightSearchList={highlightSearchList}
        onSearchChange={onSearchChange}
      />

      {isVirtualMode ? VirtualJsx : previewCoreRef.current.renderedTotalList.map(renderRow)}
    </div>
  )
}

export default Entry
