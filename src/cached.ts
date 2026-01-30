function getCachedJson(): Record<string, string> {
  return localStorage.cachedJson ? JSON.parse(localStorage.cachedJson) : {}
}

export function getHash() {
  return location.hash.slice(1)
}

export function getCachedItemByCurrentHash() {
  const key = getHash()
  const cachedJson = getCachedJson()

  return cachedJson[key]
}

export function cacheAction(value: string) {
  const hash = Date.now().toString()

  const cachedJson = getCachedJson()
  cachedJson[hash] = value
  const keys = Object.keys(cachedJson) as string[]
  if (keys.length > 5) {
    const deletions = keys.toSorted((a, b) => Number(a) - Number(b)).slice(0, keys.length - 5)
    deletions.forEach(k => {
      Reflect.deleteProperty(cachedJson, k)
    })
  }

  try {
    localStorage.cachedJson = JSON.stringify(cachedJson)
    history.pushState({}, '', `#${hash}`)
  } catch (error) {
    console.log('cacheAction error', error)
  }
}
