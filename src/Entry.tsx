import React, { FC, createContext, useReducer, Dispatch, useEffect } from "react"
import PropTypes from 'prop-types'
import JsonView from "./JsonView"

import { UConfig, UEntryProps, UPayload, UState } from "./type"

const initVal = {
    expandStatus: {},
    config: {
        showArrayIndex: false,
        indent: 4,
        singleQuote: false,
        keyQuote: false
    }
}

const mutations = {
    clear(state: UState) {
        return { ...state, expandStatus: {} }
    },
    changeExpand(state: UState, value: [string, boolean]) {
        const expandStatus = Object.assign({}, state.expandStatus)
        const [key, bool] = value
        expandStatus[key] = bool
        return { ...state, expandStatus }
    },
    changeConfig(state: UState, config: UConfig) {
        return { ...state, config }
    }
}

const reducer = (state: UState, { oper, value }: UPayload) => {
    return mutations[oper](state, value)
}

export const Context = createContext<{ store: UState, dispatch: Dispatch<UPayload> }>(undefined as any)

const Entry: FC<UEntryProps> = props => {
    const { value, ...config } = props
    const [store, dispatch] = useReducer(reducer, initVal)

    useEffect(() => dispatch({ oper: 'clear' }), [value])

    useEffect(() => {
        if (JSON.stringify(config) == JSON.stringify(store.config)) return
        dispatch({ oper: 'changeConfig', value: config })
    }, [config])

    return (
        <Context.Provider value={{ store, dispatch }}>
            <JsonView value={value} />
        </Context.Provider>
    )
}

Entry.propTypes = {
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

Entry.defaultProps = {
    showArrayIndex: false,
    indent: 4,
    singleQuote: false,
    keyQuote: false
}


export default Entry
