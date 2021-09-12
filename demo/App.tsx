import React, { useState } from "react";
import JsonView from "../src/index";

import Switch from "./Switch";

const zhihu = [
    {
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
    },
    { name: '人美声甜' }
]

const ddd = [
    {
        name: '大家闺秀',
        vip_info: { rename_days: '60' },
    },
    {
        name: '大家闺秀',
        vip_info: { rename_days: '60' },
    }
]

const App = () => {

    const [indent, setIndent] = useState(4)
    const [showArrayIndex, setShowArrayIndex] = useState(true)
    const [singleQuote, setSingleQuote] = useState(false)
    const [keyQuote, setKeyQuote] = useState(false)


    const [data, setData] = useState<any>(ddd)

    return (
        <div style={{ padding: '10px 40px 40px' }}>

            <section>
                <div>
                    当前缩进 : <input type="range" min={0} max={20} value={String(indent)} onChange={evt => setIndent(Number(evt.target.value))} />  {indent}
                </div>

                <div>
                    是否显示数组索引：<Switch checked={showArrayIndex} onChange={setShowArrayIndex} />
                </div>

                <div>
                    是否使用单引号(只针对值起作用)：<Switch checked={singleQuote} onChange={setSingleQuote} />
                </div>

                <div>
                    对象的 key 是否显示引号：<Switch checked={keyQuote} onChange={setKeyQuote} />
                </div>

                {/* <button onClick={() => setData(zhihu)}>数据1</button>
                <button onClick={() => setData(ddd)}>数据2</button> */}
            </section>

            <hr />

            <section style={{ padding: 10 }}>
                <JsonView value={data}
                    showArrayIndex={showArrayIndex}
                    indent={indent}
                    singleQuote={singleQuote}
                    keyQuote={keyQuote}
                />
            </section>
        </div>

    )
}

export default App
