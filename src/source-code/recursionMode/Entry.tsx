// 递归的方式

import React, { FC, createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import ValueView from './ValueView'

import './style.less'

import type { UContextValue, UEntryProps, UPayload, UState } from './type'

const initVal = {
  expandStatus: {}
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
  }
}

const reducer = (state: UState, { oper, value }: UPayload) => {
  return mutations[oper](state, value)
}

export const Context = createContext<UContextValue>(undefined as any)

const Entry: FC<UEntryProps> = props => {
  const { value, ...config } = {
    ...{ showArrayIndex: false, indent: 4, singleQuote: false, keyQuote: false },
    ...props
  }
  const [store, dispatch] = useReducer(reducer, initVal)

  return (
    <Context.Provider value={{ store, config, dispatch }}>
      <span className="view-code">
        <ValueView value={value} />
      </span>
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
  keyQuote: PropTypes.bool
}

export default Entry
