import classNames from 'classnames'
import { IconArrowDown, IconArrowUp, IconClose } from './Svg'

const SearchTool = props => {
  const {
    searchInputRef,
    searchVisible,
    setSearchVisible,
    wd,
    hightIndex,
    updateHightIndex,
    highlightSearchList,
    onSearchChange
  } = props
  return (
    <div
      className={classNames('custom-search-container', searchVisible && 'custom-search-container-visible')}
    >
      <input ref={searchInputRef} type="text" value={wd} onChange={evt => onSearchChange(evt.target.value)} />
      <span className="count-container">
        {highlightSearchList.length ? (
          <>
            <span>第 {hightIndex + 1} 项</span>, <span>共 {highlightSearchList.length} 项</span>
          </>
        ) : (
          '无结果'
        )}
      </span>
      <button
        className="find-match-btn"
        onClick={() => {
          const _v = hightIndex - 1
          updateHightIndex(_v === -1 ? highlightSearchList.length - 1 : _v)
        }}
      >
        <IconArrowUp />
      </button>

      <button
        className="find-match-btn"
        onClick={() => {
          const _v = hightIndex + 1
          updateHightIndex(_v === highlightSearchList.length ? 0 : _v)
        }}
      >
        <IconArrowDown />
      </button>

      <button className="find-match-btn" onClick={() => setSearchVisible(false)}>
        <IconClose />
      </button>
    </div>
  )
}

export default SearchTool
