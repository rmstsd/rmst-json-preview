import React, { useEffect, useRef, useState } from 'react'
import JsonView from '../src/index'

import './app.less'

const data3 = {
  name: '大家闺秀',
  jsonStr: '[1,2,3,{"aaa":456}]',
  love: null
}

const handleData = (str: string) => {
  if (!str) return ''
  try {
    return JSON.parse(str)
  } catch (error) {
    return String(error)
  }
}

const App = () => {
  const [indent, setIndent] = useState(2)
  const [isStrToObject, setIsStrToObject] = useState(false)

  const [value, setValue] = useState<any>(JSON.stringify(data3))
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
        <span className="tool-item">
          json字符串转成对象 :
          <input
            type="checkbox"
            checked={isStrToObject}
            onChange={evt => setIsStrToObject(evt.target.checked)}
            style={{ zoom: 1.5 }}
          />
        </span>
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
            containerHeight={window.innerHeight - 65}
          />
        </section>
      </main>
    </div>
  )
}

export default App
