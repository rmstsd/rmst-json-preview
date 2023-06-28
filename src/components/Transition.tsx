import React, { CSSProperties, useEffect, useLayoutEffect, useState } from 'react'
import classnames from 'classnames'

import './transition.less'

type ITransitionProps = {
  children: React.ReactElement
  visible: boolean
  setIsEnd: (isEnd: boolean) => void
}

const Transition: React.FC<ITransitionProps> = ({ children, visible, setIsEnd }) => {
  const [isOpacity_0, setIsOpacity_0] = useState(false)
  const [isTransitionCss, setIsTransitionCss] = useState(false)

  const transitionStyle: CSSProperties = isOpacity_0
    ? { opacity: 0, transform: 'scale(0.5) rotate(360deg)' }
    : null

  const clonedChildren = React.cloneElement(children, {
    ...children.props,
    className: classnames(children.props.className, {
      't-transition': isTransitionCss
    }),
    style: { ...children.props.style, ...transitionStyle },
    onTransitionEnd: () => {
      if (visible) {
      } else {
        setIsEnd(false)
      }
    }
  })

  useLayoutEffect(() => {
    if (visible) {
      setIsOpacity_0(true)
    } else {
      setIsOpacity_0(false)
    }
  }, [visible])

  useEffect(() => {
    setIsTransitionCss(true)

    if (visible) {
      setIsEnd(true)
      setIsOpacity_0(false)
    } else {
      setIsOpacity_0(true)
    }
  }, [visible])

  return clonedChildren
}

export default Transition
