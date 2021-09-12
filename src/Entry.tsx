import React, { FC, createContext, useReducer, useEffect } from "react";
import JsonView from "./JsonView"
import { UJsonViewProps, UState } from "./type";

const reducer = (state: UState, [key, nvBool]: [string, boolean]) => {
    return { ...state, [key]: nvBool }
}

export const Context = createContext<{ storeBool: UState, dispatch: Function }>(undefined as any)

const Root: FC<UJsonViewProps> = ({ value, showArrayIndex, indent, singleQuote, keyQuote }) => {

    const [storeBool, dispatch] = useReducer(reducer, {})

    return (
        <Context.Provider value={{ storeBool, dispatch }}>
            <JsonView
                value={value}
                showArrayIndex={showArrayIndex}
                indent={indent}
                singleQuote={singleQuote}
                keyQuote={keyQuote}
            />
        </Context.Provider>
    )
}


export default Root
