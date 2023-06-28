import { faker } from '@faker-js/faker'
import VirtualList from '../source-code/uiComponents/VirtualList'

import { useStateRef } from '../source-code/hooks'

faker.setLocale('zh_CN')

function createRandomUser(_, index) {
  return {
    index,
    username: faker.internet.userName(),
    // image: faker.image.abstract(
    //   Math.floor(Math.random() * 200 + 500),
    //   Math.floor(Math.random() * 200 + 200),
    //   true
    // ),
    desc: faker.internet.userName().repeat(Math.floor(Math.random() * 40 + 10))
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
            <h3>索引: {item.index}</h3>
            <h4>{item.username}</h4>
            <div>{item.desc}</div>
            {/* <img src={item.image} style={{ marginTop: 10 }} /> */}
          </div>
        )}
      />
    </div>
  )
}

export default NotFixedHeightDemo
