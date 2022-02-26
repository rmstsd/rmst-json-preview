import React, { useState } from "react";
import JsonView from "../src/index";

import Switch from "./Switch";
import './app.less'

const zhihu = {
    gender: 1,
    vip_info: {
        rename_days: 60,
        gender: 1,
        array: [
            1, 2, 3
        ]
    },
    name: '大家闺秀',
    aaa: null,
    yu: true
}


const ddd = [
    {
        name: '哔哩哔哩',
        vip_info: { rename_days: '60' },
    },
    {
        name: '虎牙',
        vip_info: { rename_days: '60' },
    }
]

const data3 = {
    name: '大家闺秀',
    love: null,
    use: false,
    gender: -1,
    vip_info: { rename_days: '60' },
    editor_info: [
        'bio',
        'topic',
        { name: '大家闺秀' },
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
    const [indent, setIndent] = useState(4)
    const [showArrayIndex, setShowArrayIndex] = useState(true)
    const [singleQuote, setSingleQuote] = useState(false)
    const [keyQuote, setKeyQuote] = useState(false)

    const [value, setValue] = useState<any>(JSON.stringify(Array.from({ length: 100 }, () => zhihu)))
    const jsonData = handleData(value)

    return (
        <div className="app-container">

            <section className="tool-container" >
                {/* <span className="tool-item">
                    当前缩进 : <input type="range" min={0} max={20} value={String(indent)} onChange={evt => setIndent(Number(evt.target.value))} />  {indent}
                </span>

                <span className="tool-item">
                    是否显示数组索引：<Switch checked={showArrayIndex} onChange={setShowArrayIndex} />
                </span>

                <span className="tool-item">
                    是否使用单引号(只针对值起作用)：<Switch checked={singleQuote} onChange={setSingleQuote} />
                </span>

                <span className="tool-item">
                    对象的 key 是否显示引号：<Switch checked={keyQuote} onChange={setKeyQuote} />
                </span> */}

                <span className="tool-item">
                    <button onClick={() => setValue(JSON.stringify(zhihu))}>数据1</button>
                    <button onClick={() => setValue(JSON.stringify(ddd))}>数据2</button>
                    <button onClick={() => setValue(JSON.stringify(data3))}>数据3</button>
                    <button
                        onClick={() =>
                            setValue(
                                JSON.stringify(
                                    Array.from({ length: 1000 }, () => (data3))
                                )
                            )
                        }
                    >
                        1000 条数据 不卡顿
                    </button>
                </span>

                {/* <span className="tool-item">
                    <a href="https://github.com/lichunlei1225/react-json-preview" target="_blank" style={{ color: 'blueviolet' }} >GitHub地址</a>
                </span> */}

            </section>


            <main className="main-container">
                {/* <section className="textarea-box">
                    <textarea className="textarea" value={value} placeholder="输入json字符串" onChange={evt => setValue(evt.target.value)} />
                </section> */}
                <section className="json-preview-box">
                    <JsonView value={jsonData}
                        showArrayIndex={showArrayIndex}
                        indent={indent}
                        singleQuote={singleQuote}
                        keyQuote={keyQuote}
                    />
                </section>
            </main>

        </div>
    )
}

export default App
