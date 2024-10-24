import React from 'react'
import Style from './FloorItem.module.less'

const FloorItem = ({
  title,
  content,
  searchResText,
  onClick,
  active,
  disable = false,
}) => {
  return (
    <div
      className={`${Style.floorItem} ${active ? Style.active : ''} ${
        disable ? Style.disable : ''
      }`}
      onClick={disable ? null : onClick}
    >
      <div className={Style.line1}>
        <div className={Style.floorItem_title}>{title}</div>
        <div className={Style.floorItem_content}>{content}</div>
      </div>
      {searchResText && (
        <div className={Style.line2}>
          <div className="searchResText">{searchResText}</div>
        </div>
      )}
    </div>
  )
}

export default FloorItem
