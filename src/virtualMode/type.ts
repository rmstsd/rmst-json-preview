export type EntryProps = {
    indent: 4,
    keyQuote: boolean,
    showArrayIndex: boolean,
    singleQuote: boolean,
    value: object
}

export type renderItem = {
    type: 'leftBracket' | 'key-leftBracket' | 'rightBracket' | 'key-value',
    key: string | null,
    renderValue: any,
    deep: number,
    isComma?: boolean,
    className?: string,
    index: number,
    open?: boolean,
    rightBracket: ']' | '}',
    length: number,
    dataType: 'Array' | 'Object'
}
export type renderArray = renderItem[]

export type UBracketItem = { startIdx: number, endIdx: number, open: boolean }
export type UBracketArray = UBracketItem[]