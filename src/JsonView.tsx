
import React, { FC, Fragment } from "react"
import PropTypes from 'prop-types'
import TObject from "./components/TObject"
import { isNumber, isString, isBoolean, isNull } from "./utils"
import { UJsonViewProps } from "./type";
import "./style.less";

const JsonView: FC<UJsonViewProps> = ({ value, nameKey, showArrayIndex, indent, singleQuote, keyQuote }) => {

    const jsx = []

    if (typeof value === 'object' && value !== null)
        jsx.push(<TObject value={value}
            nameKey={nameKey ? nameKey : ''}
            showArrayIndex={showArrayIndex}
            indent={indent}
            singleQuote={singleQuote}
            keyQuote={keyQuote}
        />)

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

JsonView.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool
    ]),

    showArrayIndex: PropTypes.bool,
    indent: PropTypes.number,
    singleQuote: PropTypes.bool,
    keyQuote: PropTypes.bool,
}

JsonView.defaultProps = {
    showArrayIndex: false,
    indent: 4,
    singleQuote: false,
    keyQuote: false
}

export default JsonView