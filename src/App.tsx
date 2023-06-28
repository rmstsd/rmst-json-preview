import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, Radio, Slider, Space, Divider, Input } from '@arco-design/web-react'
import { faker } from '@faker-js/faker'

import { useLocalStorageState, useUpdate } from './source-code/hooks'
import MonacoEditor from './components/MonacoEditor'
import JsonView from './source-code/index'
import { isComplex } from './source-code/virtualMode/utils'
import VirtualList from './components/virtual-scroll-list'

faker.setLocale('zh_CN')

const data = Array.from({ length: 100 }, () => ({
  title: Math.random().toString(36),
  // .repeat(Math.floor(Math.random() * 20))
  jsonString: `{
      "ghj": 2,
      "qwer": "qwer qwer",
      "level": 1,
      "notification": {
        "qwer": 1,
        "invitation_bubble": 0,
        "promotion_will_expire": 0,
        "level_upgrade": 0,
        "read_count_increased": 0,
        "apply_pass": 0,
        "accessed": 0,
        "experience_can_apply": 0,
        "custom_msg": 0
      },
      "creator_status": 1,
      "content_cooperation": false,
      "creator_c_level": 0
    }`,
  arr: [1, faker.internet.userName(), 3],
  obj: {
    aaa: faker.internet.userName(),
    bbb: faker.internet.userName()
  }
}))

// 整体的
const entiretyJsonStringToObject = (str: string) => {
  if (!str) return ''
  try {
    return JSON.parse(str)
  } catch (error) {
    return ['JSON格式错误']
  }
}

// 内部的
const internalJsonStringToObject = (value: any) => {
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

const App = () => {
  const [indent, setIndent] = useLocalStorageState(2, 'ind')

  const [isStrToObject, setIsStrToObject] = useLocalStorageState(false, 'sto')
  const [isVirtualMode, setIsVirtualMode] = useLocalStorageState(true, 'vir')
  const [isFixedHeight, setIsFixedHeight] = useLocalStorageState(true, 'immutable-height')
  const [isShowArrayIndex, setIsShowArrayIndex] = useLocalStorageState(true, 'sk')
  const [previewStyle, setPreviewStyle] = useLocalStorageState<'monaco' | 'me'>('me', 'previewStyle')

  const [value, setValue] = useState(JSON.stringify(data, null, 2))
  const textareaRef = useRef(null)

  useEffect(() => {
    document.title = value?.slice(0, 50)
  }, [value])

  const pasteHandle = async () => {
    const str = await navigator.clipboard.readText()
    setValue(str)
  }

  const jsonObject = useMemo(() => {
    const ans = entiretyJsonStringToObject(value)

    if (isStrToObject) {
      return internalJsonStringToObject(ans)
    }

    return ans
  }, [value, isStrToObject])

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
          <Slider
            value={indent}
            onChange={setIndent}
            max={4}
            min={1}
            showTicks
            style={{ width: 60, marginLeft: 10 }}
          />
        </span>

        <Checkbox checked={isStrToObject} onChange={setIsStrToObject}>
          json字符串转对象
        </Checkbox>

        {previewStyle === 'me' && (
          <>
            <Checkbox checked={isShowArrayIndex} onChange={setIsShowArrayIndex}>
              数组索引
            </Checkbox>

            <Checkbox checked={isVirtualMode} onChange={setIsVirtualMode}>
              虚拟滚动
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
          onFocus={() => {
            textareaRef.current?.dom.select()
          }}
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
            isFixedHeight={isFixedHeight}
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
