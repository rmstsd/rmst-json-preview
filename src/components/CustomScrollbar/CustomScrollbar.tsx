import classNames from 'classnames'
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import throttle from 'raf-throttle'

import { Ani } from './ani'

type CustomScrollbarProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  onSyncScroll?: (scrollTop: number) => void
}

export type CustomScrollbarRef = React.RefObject<{
  scrollTo: (scrollTop: number) => void
}>

const CustomScrollbar = forwardRef((props: CustomScrollbarProps, ref: CustomScrollbarRef) => {
  const { children, onSyncScroll, ...htmlAttr } = props

  const [thumbHeight, setThumbHeight] = useState(0)

  const rootDomRef = useRef<HTMLDivElement>(null)
  const contentDomRef = useRef<HTMLDivElement>(null)
  const thumbDomRef = useRef<HTMLDivElement>(null)

  const aniInsRef = useRef<Ani>(null)

  useImperativeHandle(ref, () => ({ scrollTo }))

  useLayoutEffect(() => {
    const rootDom = rootDomRef.current
    const aniIns = new Ani({ initialValue: 0 })
    aniInsRef.current = aniIns

    const contentHeight = getContentHeight()
    setThumbHeight(contentHeight === 0 ? 0 : rootDom.clientHeight ** 2 / contentHeight)

    let timer

    const onWheel = throttle((evt: WheelEvent) => {
      evt.preventDefault()

      let nvContentY = aniIns.getCurr() + evt.deltaY
      nvContentY = getRangeContentY(nvContentY)

      aniIns.start(nvContentY, curr => {
        unknownScrollTo(curr)
      })

      clearTimeout(timer)
      timer = setTimeout(() => {
        aniIns.stop()
      }, 200)
    })

    rootDomRef.current.addEventListener('wheel', onWheel)

    const ob = new ResizeObserver(() => {
      const contentHeight = getContentHeight()
      if (contentHeight === 0) {
        return
      }

      setThumbHeight(rootDom.clientHeight ** 2 / contentHeight)
    })
    ob.observe(contentDomRef.current)
  }, [])

  const scrollTo = (scrollTop: number) => {
    setDomScrollTop(scrollTop)
    setDomThumbY(scrollTop2ThumbY(scrollTop))
  }

  function scrollTop2ThumbY(scrollTop: number) {
    return (scrollTop / getContentHeight()) * rootDomRef.current.clientHeight
  }

  function thumbY2scrollTop(thumbY: number) {
    return (thumbY / rootDomRef.current.clientHeight) * getContentHeight()
  }

  const setDomScrollTop = (scrollTop: number) => {
    contentDomRef.current.style.setProperty('transform', `translate3d(0px, ${-scrollTop}px, 0px)`)
  }

  const setDomThumbY = (thumbY: number) => {
    thumbDomRef.current.style.setProperty('transform', `translateY(${thumbY}px)`)
  }

  const getContentHeight = () => contentDomRef.current?.offsetHeight || 0

  const unknownScrollTo = (scrollTop: number) => {
    if (onSyncScroll) {
      onSyncScroll(scrollTop)
    } else {
      scrollTo(scrollTop)
    }
  }

  const getRangeContentY = (nvContentY: number) => {
    const contentHeight = getContentHeight()
    const max = contentHeight - rootDomRef.current.clientHeight
    if (nvContentY <= 0) nvContentY = 0
    if (nvContentY >= max) nvContentY = max

    return nvContentY
  }

  const onThumbMouseDown = (evt: React.MouseEvent) => {
    const thumbDomDownOffsetY = evt.clientY - thumbDomRef.current.getBoundingClientRect().top
    const rootDomRect = rootDomRef.current.getBoundingClientRect()

    const onDocumentMousemove = (evt: MouseEvent) => {
      evt.preventDefault()
      let thumbY = evt.clientY - rootDomRect.top - thumbDomDownOffsetY

      let scrollTop = thumbY2scrollTop(thumbY)
      scrollTop = getRangeContentY(scrollTop)

      // setDomThumbY(thumbY)
      // setDomScrollTop(scrollTop)

      unknownScrollTo(scrollTop)

      aniInsRef.current.currValue = scrollTop
    }

    const onDocumentMouseup = () => {
      document.removeEventListener('mousemove', onDocumentMousemove)
      document.removeEventListener('mouseup', onDocumentMouseup)
    }

    document.addEventListener('mousemove', onDocumentMousemove)
    document.addEventListener('mouseup', onDocumentMouseup)
  }

  return (
    <main
      {...htmlAttr}
      className={classNames('scroll-container grow shrink-0', htmlAttr.className)}
      style={{ position: 'relative', ...htmlAttr.style }}
    >
      <section className="scrollbar-view h-full w-full overflow-hidden" ref={rootDomRef}>
        <div
          ref={contentDomRef}
          className="content"
          style={
            {
              // overflow: 'hidden',
              // pointerEvents: 'none'
              // contain: 'strict'
            }
          }
        >
          {children}
        </div>
      </section>

      <div className="absolute right-0 top-0 bottom-0 bg-gray-100 w-[10px] ">
        <div
          ref={thumbDomRef}
          className="w-full bg-gray-300 h-[20px]"
          style={{ height: thumbHeight }}
          onMouseDown={onThumbMouseDown}
        />
      </div>
    </main>
  )
})

export default CustomScrollbar
