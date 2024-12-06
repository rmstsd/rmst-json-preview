import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, Radio, Slider, Space, Divider, Input } from '@arco-design/web-react'

import { useLocalStorageState } from './source-code/hooks'
import MonacoEditor from './MonacoEditor'
import JsonView from './source-code/index'
import { cacheAction, getCachedItemByCurrentHash } from './cached'
import { entiretyJsonStringToObject, internalJsonStringToObject } from './utils'

const isVirtualMode = true

const App = () => {
  const [indent, setIndent] = useLocalStorageState(2, 'ind')
  const [isStrToObject, setIsStrToObject] = useLocalStorageState(false, 'sto')
  const [isShowArrayIndex, setIsShowArrayIndex] = useLocalStorageState(true, 'sk')
  const [previewStyle, setPreviewStyle] = useLocalStorageState<'monaco' | 'me'>('me', 'previewStyle')

  const [value, setStateValue] = useState(() => getCachedItemByCurrentHash())
  const textareaRef = useRef(null)

  useEffect(() => {
    const cb = () => {
      const cachedItem = getCachedItemByCurrentHash()
      setStateValue(cachedItem)
    }

    window.addEventListener('hashchange', cb)
    return () => {
      window.removeEventListener('hashchange', cb)
    }
  }, [])

  useEffect(() => {
    document.title = value?.slice(0, 40)
  }, [value])

  const jsonObject = useMemo(() => {
    const ans = entiretyJsonStringToObject(value)
    if (isStrToObject) {
      return internalJsonStringToObject(ans)
    }
    return ans
  }, [value, isStrToObject])

  const pasteHandle = async () => {
    const str = await navigator.clipboard.readText()
    setValue(str)
  }

  const setValue = (value: string) => {
    cacheAction(value)
    setStateValue(value)
  }

  const headerTools = (
    <section className="tool-container">
      <Space split={<Divider type="vertical" style={{ margin: '0 5px', borderColor: '#c5c5c5' }} />}>
        {window.utools ? (
          '将JSON字符串粘贴到下方'
        ) : (
          <Button onClick={pasteHandle} type="primary" size="mini" style={{ marginRight: 10 }}>
            粘 贴
          </Button>
        )}

        <Radio.Group value={previewStyle} onChange={setPreviewStyle}>
          <Radio value="monaco" style={{ marginRight: 10 }}>
            monaco
          </Radio>
          <Radio value="me" style={{ marginRight: 10 }}>
            me
          </Radio>
        </Radio.Group>

        <span style={{ marginLeft: 5 }}>
          缩进
          <Slider value={indent} onChange={setIndent} max={4} min={1} showTicks style={{ width: 60, marginLeft: 10 }} />
        </span>

        <Checkbox checked={isStrToObject} onChange={setIsStrToObject}>
          json字符串转对象
        </Checkbox>

        {previewStyle === 'me' && (
          <>
            <Checkbox checked={isShowArrayIndex} onChange={setIsShowArrayIndex}>
              数组索引
            </Checkbox>
          </>
        )}
      </Space>

      <div style={{ marginLeft: 'auto' }}>按住shift 将对直接子级open/close</div>
    </section>
  )

  return (
    <div className="app-container">
      {headerTools}

      <main className="main-container">
        <Input.TextArea
          ref={textareaRef}
          value={value}
          onChange={setValue}
          className="textarea"
          placeholder="输入json字符串"
          spellCheck={false}
        />

        {previewStyle === 'monaco' ? (
          <MonacoEditor
            value={JSON.stringify(jsonObject, null, indent)}
            style={{
              height: '100%',
              width: 'calc(100% - 210px)',
              marginLeft: 10,
              boxSizing: 'border-box',
              border: '1px solid #b5b3b3'
            }}
          />
        ) : (
          <JsonView
            value={jsonObject}
            indent={indent}
            isVirtualMode={isVirtualMode}
            isShowArrayIndex={isShowArrayIndex}
            style={{
              height: '100%',
              width: 'calc(100% - 210px)',
              marginLeft: 10,
              boxSizing: 'border-box',
              border: '1px solid #b5b3b3',
              padding: '5px 0 5px 5px',
              ...(isVirtualMode ? {} : { overflow: 'auto' })
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
