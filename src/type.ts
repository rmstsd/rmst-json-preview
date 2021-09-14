
export interface UInnerProps {
    value?: any,
    nameKey?: string,
}

export interface UEntryProps extends UInnerProps {
    showArrayIndex?: boolean,
    indent?: number,
    singleQuote?: boolean,
    keyQuote?: boolean
}


export interface UConfig {
    showArrayIndex: boolean,
    indent: number,
    singleQuote: boolean,
    keyQuote: boolean
}

export interface UState {
    expandStatus: { [key: string]: boolean },
    config: UConfig
}

export interface UPayload {
    oper: 'clear' | 'changeExpand' | 'changeConfig',
    value?: any
}
