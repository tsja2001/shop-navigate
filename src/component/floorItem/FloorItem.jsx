import React from 'react'
import Style from './FloorItem.module.less'

const FloorItem = ({ title, content, onClick, active, disable = false }) => {
  return (
    <div
      className={`${Style.floorItem} ${active ? Style.active : ''} ${
        disable ? Style.disable : ''
      }`}
      onClick={disable ? null : onClick}
    >
      <div className={Style.floorItem_title}>{title}</div>
      <div className={Style.floorItem_content}>{content}</div>
    </div>
  )
}

export default FloorItem
