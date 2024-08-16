import { isComplex } from './source-code/virtualMode/utils'

// 整体的
export const entiretyJsonStringToObject = (str: string) => {
  if (!str) return ''
  try {
    return JSON.parse(str)
  } catch (error) {
    return ['JSON格式错误']
  }
}

// 内部的
export const internalJsonStringToObject = (value: any) => {
  for (const key in value) {
    if (typeof value[key] === 'string') {
      try {
        value[key] = JSON.parse(value[key])
      } catch (error) {
        // 失败就保持原值
      }
    }

    if (isComplex(value[key])) {
      internalJsonStringToObject(value[key])
    }
  }

  return value
}
