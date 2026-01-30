import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, Radio, Slider, Space, Divider, Input, Tooltip } from '@arco-design/web-react'

import { useLocalStorageState } from './source-code/hooks'
import MonacoEditor from './MonacoEditor'
import JsonView from './source-code/index'
import { cacheAction, getCachedItemByCurrentHash } from './cached'
import { entiretyJsonStringToObject, internalJsonStringToObjectEntry } from './utils'
import { fakeData } from './fakeData'

const App = () => {
  const [indent, setIndent] = useLocalStorageState(2, 'ind')
  const [jsonParseDeep, setJsonParseDeep] = useLocalStorageState(1, 'json-parse-deep')
  const [parseJSONTooltipOpen, setParseJSONTooltipOpen] = useState(false)
  const [isStrToObject, setIsStrToObject] = useLocalStorageState(false, 'sto')
  const [isShowArrayIndex, setIsShowArrayIndex] = useLocalStorageState(true, 'sk')
  const [previewStyle, setPreviewStyle] = useLocalStorageState<'monaco' | 'me'>('me', 'previewStyle')

  const [value, setStateValue] = useState(() => JSON.stringify(fakeData))
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
      return internalJsonStringToObjectEntry(ans, jsonParseDeep)
    }
    return ans
  }, [value, isStrToObject, jsonParseDeep])

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
      <Space split={<Divider type="vertical" style={{ margin: '0 4px', borderColor: '#c5c5c5' }} />}>
        <Button onClick={pasteHandle} type="primary" size="mini" style={{ marginRight: 4 }}>
          粘 贴
        </Button>

        <Radio.Group value={previewStyle} onChange={setPreviewStyle}>
          <Radio value="monaco" style={{ marginRight: 10 }}>
            Monaco
          </Radio>
          <Radio value="me" style={{ marginRight: 4 }}>
            Rmst
          </Radio>
        </Radio.Group>

        <span style={{ marginLeft: 5 }}>
          缩进
          <Slider value={indent} onChange={setIndent} max={4} min={1} showTicks style={{ width: 60, marginLeft: 10 }} />
        </span>

        {previewStyle === 'me' && (
          <Checkbox checked={isShowArrayIndex} onChange={setIsShowArrayIndex}>
            数组索引
          </Checkbox>
        )}

        <div>
          <Tooltip content="JSON 字符串转成对象" popupVisible={parseJSONTooltipOpen} onVisibleChange={setParseJSONTooltipOpen}>
            <Checkbox checked={isStrToObject} onChange={setIsStrToObject} onClick={() => setParseJSONTooltipOpen(false)}>
              Parse
            </Checkbox>
          </Tooltip>
          <span></span>
          {isStrToObject && (
            <span style={{ marginLeft: 5 }}>
              深度
              <Slider
                value={jsonParseDeep}
                onChange={setJsonParseDeep}
                max={6}
                min={1}
                showTicks
                style={{ width: 80, marginLeft: 10 }}
              />
            </span>
          )}
        </div>
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
            isShowArrayIndex={isShowArrayIndex}
            style={{
              height: '100%',
              width: 'calc(100% - 210px)',
              marginLeft: 10,
              boxSizing: 'border-box',
              border: '1px solid #b5b3b3'
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
