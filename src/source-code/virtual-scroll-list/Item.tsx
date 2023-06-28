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

const useWrapper = props => {
  const { uniqueKey, horizontal, event, onItemSizeChange } = props

  const shapeKey = horizontal ? 'offsetWidth' : 'offsetHeight'

  const ref = useRef(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      ref.current && dispatchSizeChange()
    })
    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const getCurrentSize = () => {
    return ref.current ? ref.current[shapeKey] : 0
  }

  const hasInitial = false

  const dispatchSizeChange = () => {
    onItemSizeChange(event, uniqueKey, getCurrentSize(), hasInitial)
  }

  return ref
}

type ItemProps = {
  component: React.FC
  index: number
  source: Record<string, any>
  uniqueKey: string | number
}

const Item = props => {
  const { component: Component, index, source, uniqueKey } = props

  const ref = useWrapper(props)

  const cprops = { source, index }

  return (
    <div ref={ref} key={uniqueKey} {...{ role: 'listitem', index }}>
      <Component {...cprops} />
    </div>
  )
}

export const Slot = props => {
  const ref = useWrapper(props)

  return (
    <div ref={ref} className="slot">
      {props.children}
    </div>
  )
}

export default Item
