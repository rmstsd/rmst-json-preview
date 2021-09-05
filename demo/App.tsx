
import JsonView from "../src/index";

const data = [
    {
        name: '大家闺秀',
        love: null,
        use: false,
        gender: -1,
        vip_info: {
            rename_days: '60'
        },
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
    {
        name: '人美声甜'
    }
]

const App = () => {

    return (
        <JsonView value={data}
        // showArrayIndex={false}
        // indent={4}
        // singleQuote
        // keyQuote
        />
    )
}

export default App
