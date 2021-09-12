
import { UJsonViewProps } from '../type';
import React, { FC, useContext } from 'react';
import JsonView from '../JsonView';
import { isArray, isObject } from '../utils';
import { Context } from '../Entry';

const singleWidth = 6

const TObject: FC<UJsonViewProps> = ({ value, nameKey, showArrayIndex, indent, singleQuote, keyQuote }) => {
    const isArrayTrue = isArray(value)
    const isObjectTrue = isObject(value)

    const list = isArrayTrue ? value : Object.entries(value)

    const { storeBool, dispatch } = useContext(Context)
    const key = nameKey?.slice(1) as string
    const bool = storeBool[key] === undefined ? true : storeBool[key]

    const ListJsx = () => {
        if (isArrayTrue) return (
            (list as []).map((x, idx) =>
                <div key={idx} className="object-item" style={{ paddingLeft: indent as number * singleWidth }}>
                    {showArrayIndex && <span className="arr-index">{idx}</span>}
                    {showArrayIndex && <span className="colon">:</span>}
                    <JsonView value={x}
                        nameKey={`${nameKey}.${idx}`}
                        showArrayIndex={showArrayIndex}
                        indent={indent}
                        singleQuote={singleQuote}
                        keyQuote={keyQuote}
                    />
                </div>
            )
        )
        else if (isObjectTrue) {

            const getObjectKey = (keyName: string) => {
                if (keyQuote) return `"${keyName}"`
                else return keyName
            }

            return (
                (list as any[][]).map(([k, v], idx) =>
                    <div key={idx} className="object-item" style={{ paddingLeft: indent as number * singleWidth }}>
                        <span className="key">{getObjectKey(k)}</span>
                        <span className="colon">:</span>
                        <JsonView value={v}
                            nameKey={`${nameKey}.${k}`}
                            showArrayIndex={showArrayIndex}
                            indent={indent}
                            singleQuote={singleQuote}
                            keyQuote={keyQuote}
                        />
                    </div>
                )
            )
        }
    }

    const handleBool = () => {
        const k = nameKey?.slice(1) as string
        dispatch([k, !bool])
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

            <span className="bracket">
                {isArrayTrue && ']'}
                {isObjectTrue && '}'}
            </span>
        </>
    )
}

export default TObject