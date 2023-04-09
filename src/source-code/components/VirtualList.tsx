import React, { useEffect, useMemo, useRef } from 'react'
import { useEvent, useStateRef } from '../hooks'

export type extraDataItem = { rowIndex: number }
type IVirtualListProps<T> = {
  containerHeight?: number
  rowHeight?: number
  dataSource: T[]

  renderRow: (item: T & extraDataItem) => React.ReactElement<any, 'div'>

  isFixedHeight?: boolean

  className?: string
  style?: React.CSSProperties
}

const estimatedRowHeight = 100

const bufferCount = 20

const VirtualList = <T extends object>(props: IVirtualListProps<T>) => {
  const { containerHeight, rowHeight, dataSource, renderRow, isFixedHeight = true, className, style } = props

  const isFixedHeightRef = useRef(isFixedHeight)
  isFixedHeightRef.current = isFixedHeight

  const innerDataSource = useMemo(
    () => dataSource.map((item, index) => ({ ...item, rowIndex: index })),
    [dataSource]
  )

  const [state, render] = useStateRef({ startIndex: 0, count: 20 })

  const containerRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLElement>(null)

  const cacheHeightsRef = useRef<number[]>(
    Array.from({ length: innerDataSource.length }, () => estimatedRowHeight)
  )

  const viewStartIndexRef = useRef(0)
  const viewCountRef = useRef(0)

  const handleOb = useEvent(() => {
    state.count = getCount()
    render()
  })

  useEffect(() => {
    const ob = new ResizeObserver(handleOb)
    ob.observe(containerRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  // useEffect(() => {
  //   state.count = getCount()
  //   render()
  // }, [rowHeight])

  useEffect(() => {
    state.startIndex = getStartIndex()
    state.count = getCount()
    render()
  }, [isFixedHeight])

  const getStartIndex = () => {
    const { scrollTop } = containerRef.current
    if (isFixedHeight) {
      viewStartIndexRef.current = Math.floor(scrollTop / rowHeight) // 可见区域内的第一个

      const ans = viewStartIndexRef.current - bufferCount
      return ans < 0 ? 0 : ans
    }

    let tempHeight = 0
    for (let i = 0; i < cacheHeightsRef.current.length; i++) {
      const curHeight = cacheHeightsRef.current[i]
      tempHeight += curHeight

      if (tempHeight > scrollTop) {
        return i
      }
    }
  }

  const getCount = () => {
    if (isFixedHeight) {
      viewCountRef.current = Math.ceil(containerRef.current.clientHeight / rowHeight) + 1

      return viewCountRef.current + bufferCount * 2
    }

    const startIndex = getStartIndex()

    // let tempHeight = 0
    // for (let i = startIndex + 1; i < cacheHeightsRef.current.length; i++) {
    //   const curHeight = cacheHeightsRef.current[i]
    //   tempHeight += curHeight

    //   if (tempHeight > containerRef.current.clientHeight) {
    //     return i - startIndex + 1
    //   }
    // }

    return Math.ceil(containerRef.current.clientHeight / rowHeight) + 1
  }

  useEffect(() => {
    const ob = new ResizeObserver(() => {
      if (isFixedHeightRef.current) return

      innerContainerRef.current.childNodes.forEach((rowItemDom: HTMLElement) => {
        const matchDataIndex = Number(rowItemDom.getAttribute('row-key'))
        cacheHeightsRef.current[matchDataIndex] = rowItemDom.getBoundingClientRect().height

        state.startIndex = getStartIndex()
        state.count = getCount()
        render()
      })
    })

    ob.observe(innerContainerRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  const totalHeight = (() => {
    if (isFixedHeight) return innerDataSource.length * rowHeight

    return (
      cacheHeightsRef.current.reduce((acc, item) => acc + item, 0) +
      (innerDataSource.length - cacheHeightsRef.current.length) * estimatedRowHeight
    )
  })()

  const top = (() => {
    if (isFixedHeight) return state.startIndex * rowHeight

    return cacheHeightsRef.current.slice(0, state.startIndex).reduce((acc, item) => acc + item, 0)
  })()

  const visibleData = innerDataSource.slice(state.startIndex, state.startIndex + state.count)

  return (
    <div
      ref={containerRef}
      className={`人美声甜-virtual-list-container ${className || ''}`}
      style={{
        overflow: 'auto',
        position: 'relative',
        ...style,
        ...(containerHeight && { height: containerHeight })
      }}
      onScroll={() => {
        const startIndex = getStartIndex()

        if (
          viewStartIndexRef.current + viewCountRef.current >= state.startIndex + state.count ||
          viewStartIndexRef.current <= state.startIndex
        ) {
          state.startIndex = startIndex

          render()
        }
      }}
    >
      <div style={{ height: totalHeight }} />

      <main ref={innerContainerRef} style={{ width: '100%', position: 'absolute', top }}>
        {visibleData.map(item => {
          const ele = renderRow(item)

          return React.cloneElement(ele, {
            style: { ...ele.props.style, ...(isFixedHeight && { height: rowHeight }) }
          })
        })}
      </main>
    </div>
  )
}

export default VirtualList
