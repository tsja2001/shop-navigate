import React from 'react'
import Style from './FloorItem.module.less'

const FloorItem = ({ title, content, onClick, active }) => {
  return (
    <div
      className={`${Style.floorItem} ${active ? Style.active : ''}`}
      onClick={onClick}
    >
      <div className={Style.floorItem_title}>{title}</div>
      <div className={Style.floorItem_content}>{content}</div>
    </div>
  )
}

export default FloorItem
