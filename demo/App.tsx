import React, { useRef, useState } from 'react'
import JsonView from '../src/index'

import Switch from './Switch'
import './app.less'

const data3 = {
  name: '大家闺秀',
  jsonStr: '[1,2,3,{"aaa":456}]',
  love: null,
  use: false,
  gender: -1,
  vip_info: { rename_days: '60' },
  editor_info: [
    'bio',
    'topic',
    { name: '大家闺秀', jsonStr: '[1,2,3,{"aaa":456}]' },
    [4, { name: '哈哈哈哈' }, 6],
    { name: '方法人' },
    { rename_days: '60' },
    [4, { name: '大幅度发的' }, 6]
  ]
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

  const jsonData = handleData(value)

  return (
    <div className="app-container">
      <section className="tool-container">
        <span className="tool-item">
          当前缩进 :
          <input
            type="range"
            min={0}
            max={20}
            value={String(indent)}
            onChange={evt => setIndent(Number(evt.target.value))}
          />
          {indent}
        </span>
        <span className="tool-item">
          json字符串是否转成对象 : <Switch checked={isStrToObject} onChange={bool => setIsStrToObject(bool)} />
        </span>
      </section>

      <main className="main-container">
        <section className="textarea-box">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={evt => setValue(evt.target.value)}
            onFocus={() => textareaRef.current.select()}
            className="textarea"
            placeholder="输入json字符串"
          />
        </section>
        <section className="json-preview-box">
          <JsonView
            value={jsonData}
            indent={indent}
            isJsonStrToObject={isStrToObject}
            containerHeight={window.innerHeight - 80}
          />
        </section>
      </main>
    </div>
  )
}

export default App
