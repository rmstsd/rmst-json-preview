import { useEffect, useRef } from 'react'

const ItemProps = {
  index: {
    type: Number
  },
  event: {
    type: String
  },
  tag: {
    type: String
  },
  horizontal: {
    type: Boolean
  },
  source: {
    type: Object
  },
  component: {
    type: [Object, Function]
  },
  slotComponent: {
    type: Function
  },
  uniqueKey: {
    type: [String, Number]
  },
  scopedSlots: {
    type: Object
  }
}

const Item = props => {
  const { component: Component, index, source, uniqueKey, horizontal, event, onItemSizeChange } = props

  const shapeKey = horizontal ? 'offsetWidth' : 'offsetHeight'

  const ref = useRef(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      dispatchSizeChange()
    })
    resizeObserver.observe(ref.current)
  }, [])

  const getCurrentSize = () => {
    return ref.current ? ref.current[shapeKey] : 0
  }

  const hasInitial = false

  // tell parent current size identify by unqiue key
  const dispatchSizeChange = () => {
    onItemSizeChange(event, uniqueKey, getCurrentSize(), hasInitial)
  }

  const cprops = { source, index }
  return (
    <div ref={ref} key={uniqueKey} {...{ role: 'listitem', index }} style={{ height: 50 }}>
      <Component {...cprops} />
    </div>
  )
}

export default Item
