import { useState } from 'react'
import Tooltip from '../../../components/Tooltip'
import { IconCopy } from './Svg'

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
        <IconCopy />
      </span>
    </Tooltip>
  )
}

export default CopyIcon
