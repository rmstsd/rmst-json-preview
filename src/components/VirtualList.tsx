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

  const innerDataSource = useMemo(
    () => dataSource.map((item, index) => ({ ...item, rowIndex: index })),
    [dataSource]
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [count, setCount] = useState(0)

  const renderComponent = useUpdate()

  const handleOb = useEvent(() => {
    const { clientHeight } = containerRef.current
    setCount(Math.ceil(clientHeight / rowHeight) + 1)
  })

  useEffect(() => {
    const ob = new ResizeObserver(handleOb)
    ob.observe(containerRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  useEffect(() => {
    setCount(Math.ceil(containerRef.current.clientHeight / rowHeight) + 1)
  }, [rowHeight])

  const scrollTopRef = useRef(0)
  const onScroll = () => {
    const { scrollTop } = containerRef.current
    scrollTopRef.current = scrollTop

    const startIndex = getStartIndex(scrollTop)
    setStartIndex(startIndex)

    console.log('scroll')
  }

  const visibleData = innerDataSource.slice(startIndex, startIndex + count)

  const innerContainerRef = useRef<HTMLElement>(null)
  const cacheHeightsRef = useRef<number[]>(
    Array.from({ length: innerDataSource.length }, () => estimatedRowHeight)
  )

  const getStartIndex = scrollTop => {
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

  useLayoutEffect(() => {
    const ob = new ResizeObserver(() => {
      innerContainerRef.current.childNodes.forEach((rowItemDom: HTMLElement) => {
        const matchDataIndex = Number(rowItemDom.getAttribute('row-key'))
        cacheHeightsRef.current[matchDataIndex] = rowItemDom.getBoundingClientRect().height

        const startIndex = getStartIndex(scrollTopRef.current)
        setStartIndex(startIndex)
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
      onScroll={onScroll}
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
