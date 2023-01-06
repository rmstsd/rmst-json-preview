import { UInnerProps } from '../type'
import React, { FC, useContext } from 'react'
import ValueView from '../ValueView'
import { isArray, isObject } from '../utils'
import { Context } from '../Entry'

const singleWidth = 6

const TObject: FC<UInnerProps> = ({ value, nameKey }) => {
  const isArrayTrue = isArray(value)
  const isObjectTrue = isObject(value)

  const list = isArrayTrue ? value : Object.entries(value)

  const { store, config, dispatch } = useContext(Context)
  const { expandStatus } = store

  const { showArrayIndex, indent, keyQuote } = config

  const key = nameKey?.slice(1) as string
  const bool = expandStatus[key] === undefined ? true : expandStatus[key]

  const ListJsx = () => {
    if (isArrayTrue)
      return (list as []).map((x, idx) => (
        <div key={idx} className="object-item" style={{ paddingLeft: (indent as number) * singleWidth }}>
          {showArrayIndex && <span className="arr-index">{idx}</span>}
          {showArrayIndex && <span className="colon">:</span>}
          <ValueView value={x} nameKey={`${nameKey}.${idx}`} />
        </div>
      ))
    else if (isObjectTrue) {
      const getObjectKey = (keyName: string) => {
        if (keyQuote) return `"${keyName}"`
        else return keyName
      }

      return (list as any[][]).map(([k, v], idx) => (
        <div key={idx} className="object-item" style={{ paddingLeft: (indent as number) * singleWidth }}>
          <span className="key">{getObjectKey(k)}</span>
          <span className="colon">:</span>
          <ValueView value={v} nameKey={`${nameKey}.${k}`} />
        </div>
      ))
    }
  }

  const handleBool = () => {
    const k = nameKey?.slice(1) as string
    dispatch({ oper: 'changeExpand', value: [k, !bool] })
  }

  return (
    <>
      <span className="expand-wrapper">
        <button className="expand-btn" onClick={handleBool}>
          {bool ? '-' : '+'}
        </button>

        <span className="bracket">
          {isArrayTrue && `${bool ? '[' : 'Array['}`}
          {isObjectTrue && `${bool ? '{' : 'Object{'}`}
        </span>
      </span>

      {bool ? ListJsx() : <span className="object-count">{(list as []).length}</span>}

      {/* <div style={{ display: bool ? 'block' : 'none' }}>{ListJsx()}</div>
            {!bool && <span className="object-count">{(list as []).length}</span>} */}

      <span className="bracket">
        {isArrayTrue && ']'}
        {isObjectTrue && '}'}
      </span>
    </>
  )
}

export default TObject
