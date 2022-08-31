import React from 'react'
import { faker } from '@faker-js/faker'
import VirtualList from '../src/components/VirtualList'

faker.setLocale('zh_CN')

function createRandomUser(_, index) {
  return {
    index,
    username: faker.internet.userName(),
    avatar: faker.image.abstract(),
    desc: faker.internet.userName().repeat(Math.floor(Math.random() * 20 + 10))
  }
}

const users = Array.from({ length: 100 }, createRandomUser)

console.log(users)
const NotFixedHeightDemo = () => {
  return (
    <div style={{ height: '100%' }}>
      <VirtualList
        containerHeight={800}
        rowHeight={40}
        isFixedHeight={false}
        dataSource={users}
        renderRow={item => (
          <div key={item.index} row-key={item.index} className="not-fixed-row-item">
            {/* <img src={item.avatar} /> */}
            <h3>索引: {item.index}</h3>
            <h4>{item.username}</h4>
            <div>{item.desc}</div>
          </div>
        )}
      />
    </div>
  )
}

export default NotFixedHeightDemo
