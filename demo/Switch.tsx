import React, { CSSProperties, FC } from 'react'

const Switch: FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
  const pos: CSSProperties = checked ? { right: 0 } : { left: 0 }

  const style: CSSProperties = Object.assign(
    {
      transition: '0.2s',
      display: 'inline-block',
      width: 25,
      height: '100%',
      borderRadius: 100,
      backgroundColor: checked ? '#3a54ff' : '#a9a9a9',
      position: 'absolute',
      top: 0
    },
    pos
  )

  return (
    <button
      style={{
        width: 60,
        height: 22,
        borderRadius: 100,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        verticalAlign: 'middle'
      }}
      onClick={() => onChange(!checked)}
    >
      <span style={style}></span>
    </button>
  )
}

export default Switch
