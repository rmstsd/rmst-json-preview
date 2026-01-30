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

export const internalJsonStringToObjectEntry = (value: any, jsonParseDeep = 0) => {
  return deepParseJson(value, jsonParseDeep)

  // 内部的
  function internalJsonStringToObject(value: any, jsonParseDeep = 0) {
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
}

/**
 * 深度解析 JSON 字符串
 * @param {any} data - 数据
 * @param {number} depth - 解析深度（指的是能剥开多少层 JSON 字符串）
 * @returns {any}
 */
function deepParseJson(data, depth = 1) {
  // 1. 基础类型直接返回
  if (data === null || data === undefined) return data

  // 2. 如果是字符串，且深度 > 0，尝试解析
  if (typeof data === 'string') {
    if (depth > 0) {
      // 简单的预检查，提高性能
      const trimmed = data.trim()
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const parsed = JSON.parse(data)
          // 只有解析出对象或数组时，才算作一次“有效解析”
          if (typeof parsed === 'object' && parsed !== null) {
            // 【关键修改】：解析成功了，消耗 1 点深度 (depth - 1)
            // 继续递归处理解析出来的结果
            return deepParseJson(parsed, depth - 1)
          }
        } catch (e) {
          // 解析失败，保持原样
        }
      }
    }
    // 深度耗尽或不是 JSON，返回原字符串
    return data
  }

  // 3. 如果是数组，遍历处理
  if (Array.isArray(data)) {
    // 【关键修改】：遍历数组本身不消耗深度，保持 depth 传递下去
    return data.map(item => deepParseJson(item, depth))
  }

  // 4. 如果是对象，遍历处理
  if (typeof data === 'object') {
    const result = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // 【关键修改】：遍历对象属性不消耗深度，保持 depth 传递下去
        result[key] = deepParseJson(data[key], depth)
      }
    }
    return result
  }

  // 其他类型（数字、布尔等）
  return data
}
