import React, { useMemo, useState } from 'react'
import type { FC } from 'react'
import { clapTabularFromJson, getAllBracket } from './utils'

import VirtualList from '../components/VirtualList'

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

const useUpdate = () => {
  const [b, sB] = useState(true)
  const update = () => {
    sB(!b)
  }

  return update
}

const Entry: FC<IEntryProps> = props => {
  const {
    value,
    isJsonStrToObject,
    indent,
    style,
    isVirtualMode,
    isFixedHeight = true,
    isShowArrayIndex
  } = props

  const update = useUpdate()

  const tabularTotalList = useMemo(() => clapTabularFromJson(value, isJsonStrToObject), [value])
  const matchBracket = useMemo(() => getAllBracket(tabularTotalList), [tabularTotalList])
  const closedArray = matchBracket.filter(o => !o.open)

  const actualTotalList = tabularTotalList.filter(item =>
    closedArray.length ? !closedArray.some(p => item.index > p.startIdx && item.index <= p.endIdx) : true
  )

  const handleExpand = clickItem => {
    tabularTotalList[clickItem.index].open = !tabularTotalList[clickItem.index].open
    const target = matchBracket.find(o => o.startIdx === clickItem.index)
    target.open = !target.open

    update()
  }

  const getIsShowArrayKey = (item: IRenderItem) => {
    if (!item.key) return false
    if (item.parentDataType === 'Object') return true
    if (item.parentDataType === 'Array') return isShowArrayIndex
  }

  const renderRow = (item: IRenderItem) => (
    <div
      key={item.index}
      row-key={item.index}
      className="row-item"
      style={{ ...(isVirtualMode && !isFixedHeight && { minHeight: rowHeight }) }}
    >
      <span>{item.index}</span>
      {Array.from({ length: item.deep }).map((_, idx) => (
        <span key={idx} className="indent" style={{ width: indent * 20 }} />
      ))}

      {getIsShowArrayKey(item) && <span className="key">{item.key}</span>}
      {getIsShowArrayKey(item) && (item.type === 'key-leftBracket' || item.type === 'key-value') && (
        <span className="colon">:</span>
      )}

      {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && (
        <span className="expand-btn" onClick={() => handleExpand(item)}>
          {item.open ? '-' : '+'}
        </span>
      )}

      {(item.type === 'leftBracket' || (item.type === 'key-leftBracket' && !item.open)) && !item.open && (
        <span>{item.dataType}</span>
      )}
      <span
        className={`render-value ${item.className}`}
        style={isVirtualMode && !isFixedHeight ? { wordBreak: 'break-all', lineHeight: 1.3 } : null}
      >
        {item.renderValue}
      </span>

      {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && !item.open && (
        <>
          <span className="object-count">{item.length}</span>
          <span>{item.rightBracket}</span>
        </>
      )}

      {item.isComma && <span>,</span>}
    </div>
  )

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

Entry.defaultProps = {
  isJsonStrToObject: false,
  indent: 2,
  isVirtualMode: true,
  isShowArrayIndex: false
}

export default Entry
