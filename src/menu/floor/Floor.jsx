import React, { useContext } from 'react'
import Style from './Floor.module.less'
import FloorItem from '../../component/floorItem/FloorItem'
import floorConfig from '../../config/floor.config'
import { NavContext } from '../../App'

// 楼层菜单
const Floor = () => {
  const { floor, setFloor } = useContext(NavContext)

  // 点击楼层
  const handleClickFloor = (floor) => {
    setFloor(floor)
  }

  return (
    <div className={Style.floor}>
      {floorConfig.map((item, index) => (
        <FloorItem
          key={item.title}
          title={item.title}
          content={item.content.join(' ')}
          onClick={() => handleClickFloor(item.title)}
          active={floor === item.title}
          disable={item.disable}
        />
      ))}
    </div>
  )
}

export default Floor
