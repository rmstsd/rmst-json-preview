
import React, { FC, Fragment, useContext } from "react"
import TObject from "./components/TObject"
import { isNumber, isString, isBoolean, isNull } from "./utils"
import { Context } from "./Entry"

import type { UInnerProps } from "./type"

const ValueView: FC<UInnerProps> = ({ value, nameKey }) => {

    const { config } = useContext(Context)
    const { singleQuote } = config

    const jsx = []

    if (typeof value === 'object' && value !== null) jsx.push(<TObject value={value} nameKey={nameKey ? nameKey : ''} />)

    if (isNumber(value)) jsx.push(<span className="number">{value}</span>)

    if (isString(value)) jsx.push(<span className="string">{singleQuote ? `'${value}'` : `"${value}"`}</span>)

    if (isBoolean(value)) jsx.push(<span className="boolean">{String(value)}</span>)

    if (isNull(value)) jsx.push(<span className="null">{String(value)}</span>)

    return (
        <>
            {jsx.map((x, idx) => <Fragment key={idx}>{x}</Fragment>)}
        </>
    )
}

export default ValueView