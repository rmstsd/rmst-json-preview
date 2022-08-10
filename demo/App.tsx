import React, { useEffect, useRef, useState } from 'react'
import JsonView from '../src/index'

import './app.less'

const data = [
  {
    name: '人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜人美声甜',
    age: 24,
    love: ['eat'],
    ui: '{"a":1,"b":2,"c":[4,5,6]}'
  },
  {
    show_type: 'new_questions',
    learning: [
      {
        id: '1385674069266845696',
        title: '《创作者》独家分享第二课：内容创作有哪些好上手的基本方法？',
        image_url: 'https://pic3.zhimg.com/v2-461110a6198029f9b3a86552a0a7ef9d_r.jpg?source=2231c908',
        type: 'zvideo',
        created_at: 1623150442,
        updated_at: 1623306613,
        play_count: 420324,
        zvideo_type: 'original',
        state: 'Published'
      }
    ],
    activities: [
      {
        token: 'roundtable-arknights2022',
        name: '明日方舟 | 狂欢过夏天',
        entrance_word: '参与讨论赢手办',
        show_order: 269,
        url: 'https://www.zhihu.com/roundtable/arknights2022',
        banner_order: 2,
        images: {
          banner_image: 'https://pic3.zhimg.com/v2-d3439a697b60e049eae7843d87633a57.jpg?source=8c23436a',
          entrance_image: 'https://picx.zhimg.com/v2-5f52a97e20d18bedf239b06122b1a4ea.jpg?source=8c23436a',
          original_image: ''
        },
        status: 1,
        online_time: 1660010713,
        offline_time: 1661393113,
        created_at: 1660010785,
        updated_at: 1660010814,
        ext: ''
      },
      {
        token: 'roundtable-youxixiatian',
        name: '宅家游戏过夏天',
        entrance_word: '参与讨论赢现金',
        show_order: 268,
        url: 'https://www.zhihu.com/roundtable/youxixiatian',
        banner_order: 0,
        images: {
          banner_image: 'https://pic1.zhimg.com/v2-659bc61939711b654c95374a9137243f.jpg?source=8c23436a',
          entrance_image: 'https://pic3.zhimg.com/v2-6219a76c85eac5a29987f2a565d3255b.jpg?source=8c23436a',
          original_image: ''
        },
        status: 1,
        online_time: 1659319730,
        offline_time: 1661738930,
        created_at: 1659406189,
        updated_at: 1659922813,
        ext: ''
      },
      {
        token: 'roundtable-shishangdazhutiaozhansaiwanmeizhongxia',
        name: '时尚答主挑战赛- 01期「玩美仲夏」',
        entrance_word: '2022 时尚答主挑战赛，瓜分 5 万元激励金',
        show_order: 267,
        url: 'https://www.zhihu.com/roundtable/shishangdazhutiaozhansaiwanmeizhongxia',
        banner_order: 4,
        images: {
          banner_image: 'https://pic1.zhimg.com/v2-25628de0a927884e7a1bf2e37181a202.jpg?source=8c23436a',
          entrance_image: 'https://pic1.zhimg.com/v2-57b9442cf4238cb466171c0b778931a8.jpg?source=8c23436a',
          original_image: ''
        },
        status: 1,
        online_time: 1658734553,
        offline_time: 1661326553,
        created_at: 1658993917,
        updated_at: 1659922831,
        ext: ''
      },
      {
        token: 'ecom-page-1534623243902586880',
        name: '创作者训练营',
        entrance_word: '「知乎创作者训练营」首期火热招募中',
        show_order: 266,
        url: 'https://www.zhihu.com/xen/market/ecom-page/1534623243902586880',
        banner_order: 0,
        images: {
          banner_image: 'https://pic2.zhimg.com/v2-11f36749e098990daecbe16a8beeb3a6.jpg?source=8c23436a',
          entrance_image: 'https://pic1.zhimg.com/v2-a728b4836273499ffed3ce9d3e3d535e.jpg?source=8c23436a',
          original_image: ''
        },
        status: 1,
        online_time: 1658739841,
        offline_time: 1661418241,
        created_at: 1658739908,
        updated_at: 1659406226,
        ext: ''
      },
      {
        token: 'roundtable-shengxialidetongnian',
        name: '盛夏里的童年',
        entrance_word: '邀你一起，寻找夏天带给童年的礼物',
        show_order: 265,
        url: 'https://www.zhihu.com/roundtable/shengxialidetongnian',
        banner_order: 0,
        images: {
          banner_image: 'https://pica.zhimg.com/v2-c447101de3155a967158fb65ec6210f9.jpg?source=8c23436a',
          entrance_image: 'https://pic1.zhimg.com/v2-84fae7699378be0187cc1f4284d5fc5a.jpg?source=8c23436a',
          original_image: ''
        },
        status: 1,
        online_time: 1657870824,
        offline_time: 1661413224,
        created_at: 1658389283,
        updated_at: 1659315588,
        ext: ''
      }
    ],
    new_questions: [
      {
        type: 'question',
        id: 547650289,
        title: '8 月 9 日东部战区继续位台岛周边海空域组织实战化联合演训，哪些信息值得关注？',
        question_type: 'normal',
        created: 1660020189,
        updated_time: 1660020189,
        url: 'https://www.zhihu.com/question/547650289',
        answer_count: 575,
        follower_count: 1416,
        author: {
          id: 'ee30969329b7403f32dc9d5b1e035135',
          url_token: 'zhong-guo-wang-25',
          name: '中国网',
          use_default_avatar: false,
          avatar_url: 'https://pic4.zhimg.com/v2-246e77737db8bcb2f9462f0a85da309b_l.jpg?source=2231c908',
          avatar_url_template:
            'https://pic1.zhimg.com/v2-246e77737db8bcb2f9462f0a85da309b.jpg?source=2231c908',
          is_org: true,
          type: 'people',
          url: 'https://www.zhihu.com/people/ee30969329b7403f32dc9d5b1e035135',
          actived_at: 1573625082
        },
        is_deleted: false
      },
      {
        type: 'question',
        id: 547625942,
        title: '台媒称台军 9 日举行「天雷操演」，台防务部门表示仅是正常的年度训练，有哪些信息值得关注？',
        question_type: 'normal',
        created: 1660009542,
        updated_time: 1660011599,
        url: 'https://www.zhihu.com/question/547625942',
        answer_count: 850,
        follower_count: 1935,
        author: {
          id: '0f266fddf1315d97c652161dd58de5e1',
          url_token: 'guan-cha-zhe-wang-31',
          name: '观察者网',
          use_default_avatar: false,
          avatar_url: 'https://pic3.zhimg.com/v2-bee337c97796fae3dc71c0ea42ddc57e_l.jpg?source=2231c908',
          avatar_url_template:
            'https://pic2.zhimg.com/v2-bee337c97796fae3dc71c0ea42ddc57e.jpg?source=2231c908',
          is_org: true,
          type: 'people',
          url: 'https://www.zhihu.com/people/0f266fddf1315d97c652161dd58de5e1',
          actived_at: 1571208315
        },
        is_deleted: false
      },
      {
        type: 'question',
        id: 547645764,
        title: '北京地铁 2 号线一乘客翻入轨道，现已身亡，此事反映出地铁设计或管理方面存在哪些安全隐患？',
        question_type: 'normal',
        created: 1660017700,
        updated_time: 1660048987,
        url: 'https://www.zhihu.com/question/547645764',
        answer_count: 240,
        follower_count: 495,
        author: {
          id: 'ef6f25636768e9ee891a0d9c57d45182',
          url_token: 'jing-ji-guan-cha-bao',
          name: '经济观察报',
          use_default_avatar: false,
          avatar_url: 'https://pic3.zhimg.com/v2-a95daa919536ac715a081b5f1ed2e5b4_l.jpg?source=2231c908',
          avatar_url_template:
            'https://pic4.zhimg.com/v2-a95daa919536ac715a081b5f1ed2e5b4.jpg?source=2231c908',
          is_org: true,
          type: 'people',
          url: 'https://www.zhihu.com/people/ef6f25636768e9ee891a0d9c57d45182',
          actived_at: 1574407081
        },
        is_deleted: false
      },
      {
        type: 'question',
        id: 547698439,
        title: '台媒称 20 艘解放军及台军舰在所谓「台湾海峡中线」附近对峙，具体情况如何？',
        question_type: 'normal',
        created: 1660039523,
        updated_time: 1660039697,
        url: 'https://www.zhihu.com/question/547698439',
        answer_count: 214,
        follower_count: 662,
        author: {
          id: 'ad7494373cfde1f628314546e6704b8b',
          url_token: 'sou-hu-xin-wen-59',
          name: '搜狐新闻',
          use_default_avatar: false,
          avatar_url: 'https://pic1.zhimg.com/v2-1b61e631080d778a6bae88f13cb959ea_l.jpg?source=2231c908',
          avatar_url_template:
            'https://pic2.zhimg.com/v2-1b61e631080d778a6bae88f13cb959ea.jpg?source=2231c908',
          is_org: true,
          type: 'people',
          url: 'https://www.zhihu.com/people/ad7494373cfde1f628314546e6704b8b',
          actived_at: 1557196310
        },
        is_deleted: false
      }
    ],
    debug: null
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

const useLocalStorageState = <S,>(initialValue: S, key: string) => {
  const [state, setState] = useState(
    localStorage[key] ? (JSON.parse(localStorage[key]).value as S) : initialValue
  )

  const updateCache = (value: S) => {
    localStorage[key] = JSON.stringify({ value })

    setState(value)
  }

  return [state, updateCache] as const
}

const App = () => {
  const [indent, setIndent] = useLocalStorageState(2, 'ind')

  const [isStrToObject, setIsStrToObject] = useLocalStorageState(false, 'sto')
  const [isVirtualMode, setIsVirtualMode] = useLocalStorageState(true, 'vir')
  const [isShowArrayIndex, setIsShowArrayIndex] = useLocalStorageState(true, 'sk')

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

        <label className="tool-item">
          显示数组索引 :
          <input
            type="checkbox"
            checked={isShowArrayIndex}
            onChange={evt => setIsShowArrayIndex(evt.target.checked)}
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
            isShowArrayIndex={isShowArrayIndex}
            style={{ height: '100%' }}
          />
        </section>
      </main>
    </div>
  )
}

export default App
