import React, { useRef, useState } from 'react'
import { faker } from '@faker-js/faker'
import VirtualList from '../src/components/VirtualList'

import { useRefState } from '../src/hooks'

faker.setLocale('zh_CN')

function createRandomUser(_, index) {
  return {
    index,
    username: faker.internet.userName(),
    image: faker.image.abstract(
      Math.floor(Math.random() * 200 + 500),
      Math.floor(Math.random() * 200 + 200),
      true
    ),
    desc: faker.internet.userName().repeat(Math.floor(Math.random() * 20 + 10))
  }
}

const users = Array.from({ length: 100 }, createRandomUser)

console.log(users)
const NotFixedHeightDemo = () => {
  const [state, render] = useRefState({ startIndex: 0 })

  return (
    <div style={{ height: '100%' }}>
      <button
        onClick={() => {
          state.startIndex = 1

          render()

          console.log(state.startIndex)
        }}
      >
        {state.startIndex}
      </button>
      <VirtualList
        containerHeight={800}
        rowHeight={40}
        isFixedHeight={false}
        dataSource={users}
        renderRow={item => (
          <div key={item.index} row-key={item.index} className="not-fixed-row-item">
            <h3>索引: {item.index}</h3>
            <h4>{item.username}</h4>
            <div>{item.desc}</div>
            <img src={item.image} style={{ marginTop: 10 }} />
          </div>
        )}
      />
    </div>
  )
}

export default NotFixedHeightDemo
