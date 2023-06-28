export const isNumber = (v: any) => typeof v === 'number'
export const isString = (v: any) => typeof v === 'string'
export const isBoolean = (v: any) => typeof v === 'boolean'
export const isNull = (v: any) => v === null

export const isArray = (v: any) => Object.prototype.toString.call(v) === '[object Array]'

export const isObject = (v: any) => Object.prototype.toString.call(v) === '[object Object]'

export const isComplex = (v: any) => typeof v === 'object' && !isNull(v)
export const isPrimary = (v: any) => !isComplex(v)

export const throttleRaf = func => {
  let rafId = null

  return () => {
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        func()
        rafId = null
      })
    }
  }
}
