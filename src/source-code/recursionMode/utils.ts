export const isNumber = (v: any) => typeof v === 'number'
export const isString = (v: any) => typeof v === 'string'
export const isBoolean = (v: any) => typeof v === 'boolean'
export const isNull = (v: any) => v === null

export const isArray = (v: any) => Object.prototype.toString.call(v) === '[object Array]'

export const isObject = (v: any) => Object.prototype.toString.call(v) === '[object Object]'

//js对象深度比较 全相等
export function isEqual(obj1: any, obj2: any) {
  //如果传入的不是对象，那就直接比较并且返回
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }
  //如果传入的两个对象为同一个，那直接返回true
  if (obj1 === obj2) {
    return true
  }
  //如果两个对象的key的长度不一致，返回false
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  //递归比较
  for (let key in obj1) {
    const res = isEqual(obj1[key], obj2[key])
    if (!res) {
      return false
    }
  }
  return true
}
