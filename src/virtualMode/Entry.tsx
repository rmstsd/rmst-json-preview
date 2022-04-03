// @ts-check
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { FC, UIEventHandler } from 'react'
import { calcTotal, getAllBracket } from './utils'

import './style.less'

const rowHeight = 24

type EntryProps = {
  value: object
  indent: number
  isJsonStrToObject?: boolean
  containerHeight: number
}

const Entry: FC<EntryProps> = props => {
  const { value, isJsonStrToObject, indent, containerHeight } = props
  const count = Math.ceil(containerHeight / rowHeight)

  const totalListRef = useRef<renderArray>([])
  const treatedListRef = useRef<renderArray>([])
  const matchBracketRef = useRef<UBracketArray>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(0)
  const [totalHeight, setTotalHeight] = useState(0)
  const [visibleData, setVisibleData] = useState<renderArray>([])

  useEffect(() => {
    const totalList = calcTotal(value, isJsonStrToObject)
    totalListRef.current = totalList
    treatedListRef.current = totalList

    matchBracketRef.current = getAllBracket(totalList)

    handleVisibleData(start)
    setTotalHeight(rowHeight * totalList.length)
  }, [value])

  const onScroll: UIEventHandler = evt => {
    const { scrollTop } = evt.target as HTMLDivElement
    const start = Math.floor(scrollTop / rowHeight)

    handleVisibleData(start)
    setStart(start)
  }

  const handleExpand = (clickItem: renderItem) => {
    const currBracket = matchBracketRef.current.find(item => item.startIdx === clickItem.index)
    currBracket.open = !currBracket.open
    clickItem.open = !clickItem.open
    const closeArray = matchBracketRef.current.filter(item => !item.open)

    const treatedList = totalListRef.current.filter(
      tItem => !closeArray.some(cItem => tItem.index > cItem.startIdx && tItem.index <= cItem.endIdx)
    )
    treatedListRef.current = treatedList

    handleVisibleData(start)
    setTotalHeight(treatedList.length * rowHeight)
  }

  const handleVisibleData = (start: number) => {
    setVisibleData(treatedListRef.current.slice(start, start + count))
  }

  return (
    <div className="virtual-mode" ref={containerRef} style={{ height: containerHeight }} onScroll={onScroll}>
      <section style={{ height: totalHeight, position: 'relative' }}>
        <main style={{ position: 'absolute', top: 0, transform: `translateY(${start * rowHeight}px)` }}>
          {visibleData.map(item => (
            <div key={item.index} row-key={item.index} className="row-item" style={{ height: rowHeight }}>
              {Array.from({ length: item.deep }).map((_, idx) => (
                <span key={idx} className="indent" style={{ width: indent * 20 }} />
              ))}

              {item.key && <span className="key">{item.key}</span>}

              {(item.type === 'key-leftBracket' || item.type === 'key-value') && <span className="colon">:</span>}

              {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && (
                <span className="expand-btn" onClick={() => handleExpand(item)}>
                  {item.open ? '-' : '+'}
                </span>
              )}

              {(item.type === 'leftBracket' || (item.type === 'key-leftBracket' && !item.open)) && !item.open && (
                <span>{item.dataType}</span>
              )}
              <span className={item.className}>{item.renderValue}</span>

              {(item.type === 'leftBracket' || item.type === 'key-leftBracket') && !item.open && (
                <>
                  <span className="object-count">{item.length}</span>
                  <span>{item.rightBracket}</span>
                </>
              )}

              {item.isComma && <span>,</span>}
            </div>
          ))}
        </main>
      </section>
    </div>
  )
}

Entry.defaultProps = {
  isJsonStrToObject: false,
  indent: 2
}

export default Entry
