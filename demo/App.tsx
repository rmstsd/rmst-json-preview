import React, { useEffect, useRef, useState } from 'react'
import JsonView from '../src/index'

import './app.less'

const data = [
  {
    name: '人美声甜',
    age: 24,
    love: ['eat'],
    ui: '{"a":1,"b":2,"c":[4,5,6]}'
  }
]

const handleData = (str: string) => {
  if (!str) return ''
  try {
    return JSON.parse(str)
  } catch (error) {
    return ['JSON.parse 解析出错']
  }
}

const App = () => {
  const [indent, setIndent] = useState(2)
  const [isStrToObject, setIsStrToObject] = useState(false)
  const [isVirtualMode, setIsVirtualMode] = useState(true)

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

  const jsonData = handleData(value)

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
          json字符串转成对象 :
          <input
            type="checkbox"
            checked={isStrToObject}
            onChange={evt => setIsStrToObject(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </label>

        <label className="tool-item">
          虚拟滚动 :
          <input
            type="checkbox"
            checked={isVirtualMode}
            onChange={evt => setIsVirtualMode(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </label>
      </section>

      <main className="main-container">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={evt => setValue(evt.target.value)}
          onFocus={() => textareaRef.current.select()}
          className="textarea"
          placeholder="输入json字符串"
          spellCheck={false}
        />
        <section className="json-preview-box">
          <JsonView
            value={jsonData}
            indent={indent}
            isJsonStrToObject={isStrToObject}
            isVirtualMode={isVirtualMode}
            style={{ height: '100%' }}
          />
        </section>
      </main>
    </div>
  )
}

export default App
