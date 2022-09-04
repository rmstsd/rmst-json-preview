import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

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

const useUpdate = () => {
  const [state, setState] = useState(true)

  return () => setState(!state)
}

const useEvent = <T extends (...args: any[]) => any>(func: T) => {
  const ref = useRef(func)
  ref.current = func

  return useCallback(
    (() => {
      ref.current()
    }) as T,
    []
  )
}

const estimatedRowHeight = 100

const VirtualList = <T extends object>(props: IVirtualListProps<T>) => {
  const { containerHeight, rowHeight, dataSource, renderRow, isFixedHeight = true, className, style } = props

  const isFixedHeightRef = useRef(isFixedHeight)
  isFixedHeightRef.current = isFixedHeight

  const innerDataSource = useMemo(
    () => dataSource.map((item, index) => ({ ...item, rowIndex: index })),
    [dataSource]
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [count, setCount] = useState(20)

  const innerContainerRef = useRef<HTMLElement>(null)
  const cacheHeightsRef = useRef<number[]>(
    Array.from({ length: innerDataSource.length }, () => estimatedRowHeight)
  )

  const handleOb = useEvent(() => {
    setCount(getCount())
  })

  useEffect(() => {
    const ob = new ResizeObserver(handleOb)
    ob.observe(containerRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  useEffect(() => {
    setCount(getCount())
  }, [rowHeight])

  useEffect(() => {
    setStartIndex(getStartIndex())
    setCount(getCount())
  }, [isFixedHeight])

  const visibleData = innerDataSource.slice(startIndex, startIndex + count)

  const getStartIndex = () => {
    const { scrollTop } = containerRef.current
    if (isFixedHeight) return Math.floor(scrollTop / rowHeight)

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
    if (isFixedHeight) return Math.ceil(containerRef.current.clientHeight / rowHeight) + 1

    const startIndex = getStartIndex()

    let tempHeight = 0
    for (let i = startIndex + 1; i < cacheHeightsRef.current.length; i++) {
      const curHeight = cacheHeightsRef.current[i]
      tempHeight += curHeight

      if (tempHeight > containerRef.current.clientHeight) {
        return i - startIndex + 1
      }
    }

    return Math.ceil(containerRef.current.clientHeight / rowHeight) + 1
  }

  useEffect(() => {
    const ob = new ResizeObserver(() => {
      if (isFixedHeightRef.current) return

      innerContainerRef.current.childNodes.forEach((rowItemDom: HTMLElement) => {
        const matchDataIndex = Number(rowItemDom.getAttribute('row-key'))
        cacheHeightsRef.current[matchDataIndex] = rowItemDom.getBoundingClientRect().height

        setStartIndex(getStartIndex())
        setCount(getCount())
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
    if (isFixedHeight) return startIndex * rowHeight

    return cacheHeightsRef.current.slice(0, startIndex).reduce((acc, item) => acc + item, 0)
  })()

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
      onScroll={() => setStartIndex(getStartIndex())}
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
