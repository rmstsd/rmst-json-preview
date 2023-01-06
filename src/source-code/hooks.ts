import { useCallback, useRef, useState } from 'react'

export const useLocalStorageState = <S>(initialValue: S, key: string) => {
  const [state, setState] = useState(
    localStorage[key] ? (JSON.parse(localStorage[key]).value as S) : initialValue
  )

  const updateCache = (value: S) => {
    localStorage[key] = JSON.stringify({ value })

    setState(value)
  }

  return [state, updateCache] as const
}

export const useStateRef = <S extends object>(initialValue: S) => {
  const [b, sb] = useState(false)
  const sr = useRef<S>(initialValue)
  const u = () => sb(!b)

  return [sr.current, u] as const
}

export const useUpdate = () => {
  const [b, sB] = useState(true)
  const update = () => {
    sB(!b)
  }

  return update
}

export const useEvent = <T extends (...args: any[]) => any>(func: T) => {
  const ref = useRef(func)
  ref.current = func

  return useCallback(
    (() => {
      ref.current()
    }) as T,
    []
  )
}
