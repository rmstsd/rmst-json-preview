import { useState } from 'react'
import Tooltip from '../components/Tooltip'

const CopyIcon = props => {
  const { onClick, restProps } = props
  const [succ, setSucc] = useState(false)

  const innerOnClick = evt => {
    setSucc(true)
    setTimeout(() => setSucc(false), 700)

    onClick(evt)
  }

  return (
    <Tooltip visible={succ} content="复制成功">
      <span className="copy-icon" onClick={innerOnClick} {...restProps}>
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 48 48"
          width="1em"
          height="1em"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            stroke="none"
            d="M18 4.5a5.5 5.5 0 0 0-5.5 5.5v.5H11A5.5 5.5 0 0 0 5.5 16v22a5.5 5.5 0 0 0 5.5 5.5h20a5.5 5.5 0 0 0 5.5-5.5v-.5H38a5.5 5.5 0 0 0 5.5-5.5V10A5.5 5.5 0 0 0 38 4.5H18Zm15.5 33H18a5.5 5.5 0 0 1-5.5-5.5V13.5H11A2.5 2.5 0 0 0 8.5 16v22a2.5 2.5 0 0 0 2.5 2.5h20a2.5 2.5 0 0 0 2.5-2.5v-.5ZM15.5 10A2.5 2.5 0 0 1 18 7.5h20a2.5 2.5 0 0 1 2.5 2.5v22a2.5 2.5 0 0 1-2.5 2.5H18a2.5 2.5 0 0 1-2.5-2.5V10Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </Tooltip>
  )
}

export default CopyIcon
