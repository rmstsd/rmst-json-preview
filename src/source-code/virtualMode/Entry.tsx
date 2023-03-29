import React, { useMemo } from 'react'
import { clapTabularFromJson, getAllBracket } from './utils'
import VirtualList from '../components/VirtualList'
import { useUpdate } from '../hooks'
import CopyIcon from './CopyIcon'

import './style.less'

const rowHeight = 24

type IEntryProps = {
  value: object
  indent: number
  isJsonStrToObject?: boolean
  containerHeight?: number
  style?: React.CSSProperties
  isVirtualMode?: boolean
  isFixedHeight?: boolean
  isShowArrayIndex?: boolean
}

const Entry: React.FC<IEntryProps> = props => {
  const {
    value,
    isJsonStrToObject,
    indent,
    style,
    isVirtualMode,
    isFixedHeight = true,
    isShowArrayIndex
  } = {
    ...{ isJsonStrToObject: false, indent: 2, isVirtualMode: true, isShowArrayIndex: false },
    ...props
  }

  const update = useUpdate()

  const { tabularTotalList, matchBracket } = useMemo(() => {
    const tabularTotalList = clapTabularFromJson(value, isJsonStrToObject)
    const matchBracket = getAllBracket(tabularTotalList)

    return { tabularTotalList, matchBracket }
  }, [value, isJsonStrToObject])

  const closedArray = matchBracket.filter(o => !o.open)

  const actualTotalList = tabularTotalList.filter(item =>
    closedArray.length ? !closedArray.some(p => item.index > p.startIdx && item.index <= p.endIdx) : true
  )

  const handleExpand = (clickItem: IRenderItem, evt: React.MouseEvent) => {
    if (evt.shiftKey) {
      const bracketItem = matchBracket.find(o => o.startIdx === clickItem.index)
      const tarLi = matchBracket
        .filter(o => o.startIdx > bracketItem.startIdx && o.endIdx < bracketItem.endIdx)
        .sort((a, b) => a.startIdx - b.startIdx)

      let last = bracketItem.startIdx
      const directChildren: IBracketItem[] = []
      for (const item of tarLi) {
        if (item.startIdx > last) {
          directChildren.push(item)
          last = item.endIdx
        }
      }

      if (!directChildren.length) {
        closeCurrent()
        update()
        return
      }

      const bool = directChildren.some(item => item.open) ? false : true
      directChildren.forEach(item => {
        tabularTotalList[item.startIdx].open = bool
        item.open = bool
      })

      update()
      return
    }

    closeCurrent()
    update()

    function closeCurrent() {
      tabularTotalList[clickItem.index].open = !tabularTotalList[clickItem.index].open
      const target = matchBracket.find(o => o.startIdx === clickItem.index)
      target.open = !target.open
    }
  }

  const handleCopy = (clickItem: IRenderItem) => {
    navigator.clipboard.writeText(JSON.stringify(clickItem.mainValue, null, 2))
  }

  const getIsShowArrayKey = (item: IRenderItem) => {
    if (!item.key) return false
    if (item.parentDataType === 'Object') return true
    if (item.parentDataType === 'Array') return isShowArrayIndex
  }

  const renderRow = (item: IRenderItem) => {
    const isShowArrayIndex = getIsShowArrayKey(item)

    return (
      <div
        key={item.index}
        row-key={item.index}
        className="row-item"
        style={!isVirtualMode || (isVirtualMode && !isFixedHeight) ? { minHeight: rowHeight } : null}
      >
        <span className="line-numbers">{item.index + 1}</span>
        {Array.from({ length: item.deep }).map((_, idx) => (
          <span key={idx} className="indent" style={{ width: indent * 20 }} />
        ))}

        {isShowArrayIndex && <span className="key">{item.key}</span>}
        {isShowArrayIndex && (item.type === 'key-leftBracket' || item.type === 'key-value') && (
          <span className="colon">:</span>
        )}

        {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && (
          <>
            <span className="expand-btn" onClick={evt => handleExpand(item, evt)}>
              {item.open ? '-' : '+'}
            </span>
            <CopyIcon onClick={() => handleCopy(item)} />
          </>
        )}

        {(item.type === 'leftBracket' || (item.type === 'key-leftBracket' && !item.open)) && !item.open && (
          <span>{item.dataType}</span>
        )}
        <span
          className={`render-value ${item.className || ''}`}
          style={
            isVirtualMode
              ? isFixedHeight
                ? { whiteSpace: 'nowrap' }
                : { wordBreak: 'break-all', lineHeight: 1.3 }
              : null
          }
        >
          {item.renderValue}
        </span>

        {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && !item.open && (
          <>
            <span className="object-count">{item.length}</span>
            <span>{item.rightBracket}</span>
          </>
        )}

        {(item.isComma || (item.open === false && !item.isLastOne)) && <span>,</span>}
      </div>
    )
  }

  return (
    <div className="virtual-mode" style={{ ...style }}>
      {isVirtualMode ? (
        <VirtualList
          style={{ height: '100%' }}
          rowHeight={rowHeight}
          dataSource={actualTotalList}
          renderRow={renderRow}
          isFixedHeight={isFixedHeight}
        />
      ) : (
        actualTotalList.map(renderRow)
      )}
    </div>
  )
}

export default Entry
