
export interface UInnerProps {
    value?: any,
    nameKey?: string,
}

export interface UConfig {
    showArrayIndex?: boolean,
    indent?: number,
    singleQuote?: boolean,
    keyQuote?: boolean
}

export interface UEntryProps extends UInnerProps, UConfig { }

export interface UState {
    expandStatus: { [key: string]: boolean }
}

export interface UPayload {
    oper: 'clear' | 'changeExpand',
    value?: any
}

