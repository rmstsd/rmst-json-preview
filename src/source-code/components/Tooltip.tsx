import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const Tooltip: React.FC<{
  children: React.ReactElement
  visible: boolean
  content: React.ReactNode
}> = ({ children, visible, content }) => {
  const ref = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const cloneChildren = React.cloneElement(children, { ref })

  const [tipStyle, setTipStyle] = useState<React.CSSProperties>({})

  useLayoutEffect(() => {
    if (!visible) return

    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()

    setTipStyle({
      left: left + width / 2 - contentRect.width / 2,
      top: top - contentRect.height,
      zIndex: 10
    })
  }, [visible])

  return (
    <>
      {cloneChildren}

      {visible
        ? createPortal(
            <div className="su-cc" style={{ position: 'absolute', ...tipStyle }} ref={contentRef}>
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default Tooltip
