

# react-json-preview

react-json-preview 是一个一个普普通通的, 不算太丑的 react 的 json 数据预览组件

# 使用

```jsx
import ReactJsonPreview from "react-json-preview";

const data = [
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
            [4, { name: '大家闺秀' }, 6],
            { name: '大家闺秀' },
            { rename_days: '60' },
            [4, { name: '大家闺秀' }, 6]
        ]
    },
    { name: '人美声甜' }
]


<ReactJsonPreview value={data}
    showArrayIndex={false}
    indent={4}
    singleQuote
    keyQuote
/>

```

# props

|  Name  |   type   |   Default   | Description |
| ---- | ---- | ---- | ---- |
| value | `JSON Object` | None | 数组或者对象 ( JSON 数据格式) |
| showArrayIndex | `boolean` | `false` | 如果是数组, 是否显示索引 |
| indent | `number` | `4` | 缩进 |
| singleQuote | `boolean` | `false` | 是否使用单引号(只针对值起作用) |
| keyQuote | `boolean` | `false` | 对象的 key 是否显示引号 |


