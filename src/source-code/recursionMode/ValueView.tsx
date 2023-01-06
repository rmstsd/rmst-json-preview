import React, { FC, Fragment, ReactNode, useContext } from 'react'
import TObject from './components/TObject'
import { isNumber, isString, isBoolean, isNull, isObject } from './utils'
import { Context } from './Entry'

import type { UInnerProps } from './type'

function isJSONStr(str: string) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

const ValueView: FC<UInnerProps> = ({ value, nameKey }) => {
  const { config } = useContext(Context)
  const { singleQuote } = config

  const jsx: ReactNode[] = []

  if (typeof value === 'object' && value !== null)
    jsx.push(<TObject value={value} nameKey={nameKey ? nameKey : ''} />)

  if (isNumber(value)) jsx.push(<span className="number">{value}</span>)

  if (isString(value)) {
    // 如果是 json 字符串, 尝试 转成对象
    if (isJSONStr(value)) {
      jsx.push(<TObject value={JSON.parse(value)} nameKey={nameKey ? nameKey : ''} />)
    } else jsx.push(<span className="string">{singleQuote ? `'${value}'` : `"${value}"`}</span>)
  }

  if (isBoolean(value)) jsx.push(<span className="boolean">{String(value)}</span>)

  if (isNull(value)) jsx.push(<span className="null">{String(value)}</span>)

  return (
    <>
      {jsx.map((x, idx) => (
        <Fragment key={idx}>{x}</Fragment>
      ))}
    </>
  )
}

export default ValueView
