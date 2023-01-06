import { useEffect, useMemo, useRef, useState } from 'react'
import JsonView from './source-code/index'
import { faker } from '@faker-js/faker'

import './app.less'
import { useLocalStorageState } from './source-code/hooks'

faker.setLocale('zh_CN')

const data = Array.from({ length: 100 }, () => ({
  title: Math.random()
    .toString(36)
    .repeat(Math.floor(Math.random() * 20)),
  arr: [1, faker.internet.userName().repeat(Math.floor(Math.random() * 20 + 10)), , 3],
  obj: {
    aaa: faker.internet.userName().repeat(Math.floor(Math.random() * 20 + 10)),
    bbb: faker.internet.userName().repeat(Math.floor(Math.random() * 20 + 10))
  }
}))

const handleData = (str: string) => {
  if (!str) return ''
  try {
    return JSON.parse(str)
  } catch (error) {
    return ['JSON.parse 解析出错']
  }
}

const App = () => {
  const [indent, setIndent] = useLocalStorageState(2, 'ind')

  const [isStrToObject, setIsStrToObject] = useLocalStorageState(false, 'sto')
  const [isVirtualMode, setIsVirtualMode] = useLocalStorageState(true, 'vir')
  const [isFixedHeight, setIsFixedHeight] = useLocalStorageState(true, 'immutable-height')
  const [isShowArrayIndex, setIsShowArrayIndex] = useLocalStorageState(true, 'sk')

  const [value, setValue] = useState<any>(JSON.stringify(data))
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    window.addEventListener('message', evt => {
      const { type, value } = evt.data
      if (type === 'json-preview') setValue(JSON.stringify(value))
    })
  }, [])

  const pasteHandle = async () => {
    const str = await navigator.clipboard.readText()
    setValue(str)
  }

  const jsonData = useMemo(() => handleData(value), [value])

  return (
    <div className="app-container">
      <section className="tool-container">
        <button onClick={pasteHandle}>粘 贴</button>
        <span className="tool-item">
          缩进 :
          <input
            type="range"
            min={1}
            max={3}
            value={String(indent)}
            onChange={evt => setIndent(Number(evt.target.value))}
            style={{ width: 50 }}
          />
          {indent}
        </span>

        <label className="tool-item">
          json字符串转对象:
          <input
            type="checkbox"
            checked={isStrToObject}
            onChange={evt => setIsStrToObject(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </label>

        <label className="tool-item">
          数组索引:
          <input
            type="checkbox"
            checked={isShowArrayIndex}
            onChange={evt => setIsShowArrayIndex(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </label>

        <label className="tool-item">
          虚拟滚动:
          <input
            type="checkbox"
            checked={isVirtualMode}
            onChange={evt => setIsVirtualMode(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </label>

        {isVirtualMode && (
          <>
            <label className="tool-item">
              定高:
              <input
                type="radio"
                checked={isFixedHeight}
                onChange={evt => setIsFixedHeight(evt.target.checked)}
                style={{ zoom: 1.5 }}
              />
            </label>

            <label className="tool-item">
              不定高:
              <input
                type="radio"
                checked={!isFixedHeight}
                onChange={evt => setIsFixedHeight(!evt.target.checked)}
                style={{ zoom: 1.5 }}
              />
            </label>
          </>
        )}
      </section>

      <main className="main-container">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={evt => setValue(evt.target.value)}
          onFocus={() => (textareaRef.current as any).select()}
          className="textarea"
          placeholder="输入json字符串"
          spellCheck={false}
        />

        <JsonView
          value={jsonData}
          indent={indent}
          isJsonStrToObject={isStrToObject}
          isVirtualMode={isVirtualMode}
          isFixedHeight={isFixedHeight}
          isShowArrayIndex={isShowArrayIndex}
          style={{
            height: '100%',
            flexGrow: 1,
            boxSizing: 'border-box',
            border: '1px solid #b5b3b3',
            padding: '5px 0 5px 5px',
            ...(!isVirtualMode && { overflow: 'auto' })
          }}
        />
      </main>
    </div>
  )
}

export default App
