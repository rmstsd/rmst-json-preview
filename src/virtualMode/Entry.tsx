// @ts-check
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { FC, UIEventHandler } from 'react'
import { calcTotal, getAllBracket, throttleRaf } from './utils'

import './style.less'

const rowHeight = 24

type IEntryProps = {
  value: object
  indent: number
  isJsonStrToObject?: boolean
  containerHeight?: number
  style?: React.CSSProperties
  isVirtualMode?: boolean
  isShowArrayIndex?: boolean
}

const useLatestState = <S,>(value: S) => {
  const [v, setV] = useState(value)
  const ref = useRef(v)
  ref.current = v

  return [ref, setV] as const
}

const useUpdate = () => {
  const [b, sB] = useState(true)
  const update = () => {
    sB(!b)
  }

  return update
}

const Entry: FC<IEntryProps> = props => {
  const { value, isJsonStrToObject, indent, style, isVirtualMode, isShowArrayIndex } = props

  const [start, setStart] = useState(0)
  const [count, setCount] = useState(25)

  useEffect(() => {
    console.log('eff')
    // containerRef.current.scrollTop = 0
  }, [value])

  useEffect(() => {
    let prevOffsetHeight = containerRef.current.offsetHeight
    let firstRender = true

    const ob = new ResizeObserver(
      throttleRaf(() => {
        if (containerRef.current.offsetHeight === prevOffsetHeight && !firstRender) return

        prevOffsetHeight = containerRef.current.offsetHeight
        firstRender = false

        const nvCount = Math.ceil(containerRef.current.clientHeight / rowHeight) + 1

        setCount(nvCount)
      })
    )
    ob.observe(containerRef.current)
    return () => ob.disconnect()
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const update = useUpdate()

  const tabularTotalList = useMemo(() => calcTotal(value, isJsonStrToObject), [value])
  const matchBracket = useMemo(() => getAllBracket(tabularTotalList), [tabularTotalList])
  const closedArray = matchBracket.filter(o => !o.open)
  const actualTotalList = tabularTotalList.filter(item =>
    closedArray.length ? !closedArray.some(p => item.index > p.startIdx && item.index <= p.endIdx) : true
  )

  const visibleData = actualTotalList.slice(start, start + count)

  const onScroll: UIEventHandler = evt => {
    const { scrollTop } = evt.target as HTMLDivElement
    const nvStart = Math.floor(scrollTop / rowHeight)

    setStart(nvStart)
  }

  const handleExpand = (clickItem: IRenderItem) => {
    clickItem.open = !clickItem.open
    const target = matchBracket.find(o => o.startIdx === clickItem.index)
    target.open = !target.open

    update()
  }

  const getIsShowArrayKey = (item: IRenderItem) => {
    if (!item.key) return false

    if (item.parentDataType === 'Object') return true

    if (item.parentDataType === 'Array') return isShowArrayIndex
  }

  return (
    <div className="virtual-mode" ref={containerRef} style={style} onScroll={onScroll}>
      <section
        style={{
          height: isVirtualMode ? actualTotalList.length * rowHeight : 'initial',
          position: 'relative'
        }}
      >
        <main
          style={
            isVirtualMode
              ? { position: 'absolute', top: 0, transform: `translateY(${start * rowHeight}px)` }
              : null
          }
        >
          {(isVirtualMode ? visibleData : actualTotalList).map(item => (
            <div key={item.index} row-key={item.index} className="row-item" style={{ height: rowHeight }}>
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

              {(item.type === 'leftBracket' || (item.type === 'key-leftBracket' && !item.open)) &&
                !item.open && <span>{item.dataType}</span>}
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
  indent: 2,
  isVirtualMode: true,
  isShowArrayIndex: false
}

export default Entry
