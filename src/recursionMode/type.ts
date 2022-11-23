import { Dispatch } from 'react'

export type UInnerProps = {
  value?: any
  nameKey?: string
}

export type UConfig = {
  showArrayIndex?: boolean
  indent?: number
  singleQuote?: boolean
  keyQuote?: boolean
}

export type UEntryProps = UInnerProps & UConfig

export type UState = {
  expandStatus: { [key: string]: boolean }
}

export type UPayload = {
  oper: 'clear' | 'changeExpand'
  value?: any
}

export type UContextValue = {
  store: UState
  config: UConfig
  dispatch: Dispatch<UPayload>
}
