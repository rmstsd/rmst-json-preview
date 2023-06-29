import { useEffect, useMemo, useState } from 'react'
import VirtualList from '../components/virtual-scroll-list'

const TOTAL_COUNT = 200

const dataSources = []
let count = TOTAL_COUNT
while (count--) {
  const index = TOTAL_COUNT - count
  dataSources.push({
    index,
    name: index + '-name',
    id: index
  })
}

const Test = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setData(dataSources)
    }, 1000)
  }, [])

  return (
    <div>
      <VirtualList
        className="list"
        style={{ height: 600, overflow: 'auto', border: '2px solid #333' }}
        dataKey="id"
        dataSources={data}
        dataComponent={ItemComponent}
        keeps={50}
        estimateSize={30}
        // header={<div style={{ height: 100 }}>header</div>}
        // footer={<div style={{ height: 80 }}>footer</div>}
      />
    </div>
  )
}

const ItemComponent = item => {
  const randomHeight = useMemo(() => 10 + Math.random() * 100, [])

  return (
    <div
      className="item-inner"
      style={{ display: 'flex', alignItems: 'center', height: 30, borderBottom: '1px solid #aaa' }}
    >
      <span># {item.index}</span>
      <NameComponent index={item.index} name={item.source.name}></NameComponent>
    </div>
  )
}

const NameComponent = ({ index, name }) => {
  if (index % 3 === 0) return null

  return <span style={{ marginLeft: 40, border: '1px solid #333', padding: 2 }}>{name}</span>
}

export default Test
