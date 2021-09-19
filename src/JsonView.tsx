
import React, { FC, Fragment, useContext } from "react"
import TObject from "./components/TObject"
import { isNumber, isString, isBoolean, isNull } from "./utils"

import { UInnerProps } from "./type"
import { Context } from "./Entry"

import "./style.less";

const JsonView: FC<UInnerProps> = ({ value, nameKey }) => {

    const { refConfig } = useContext(Context)
    const { singleQuote } = refConfig.current

    const jsx = []

    if (typeof value === 'object' && value !== null)
        jsx.push(<TObject value={value} nameKey={nameKey ? nameKey : ''} />)

    if (isNumber(value)) jsx.push(<span className="number">{value}</span>)

    if (isString(value)) jsx.push(<span className="string">{singleQuote ? `'${value}'` : `"${value}"`}</span>)

    if (isBoolean(value)) jsx.push(<span className="boolean">{String(value)}</span>)

    if (isNull(value)) jsx.push(<span className="null">{String(value)}</span>)

    return (
        <span className="view-code">
            {jsx.map((x, idx) => <Fragment key={idx}>{x}</Fragment>)}
        </span>
    )
}

export default JsonView