import React, { useContext } from 'react'
import Style from './Search.module.less'
import FloorItem from '../../component/floorItem/FloorItem'
import floorConfig from '../../config/floor.config'
import { NavContext } from '../../App'
import { Input } from 'antd'

// 楼层菜单
const Search = () => {
  const { floor, setFloor } = useContext(NavContext)


  // 点击楼层
  const handleClickFloor = (floor) => {
    setFloor(floor)
  }

  // 搜索
  const onSearch = (value) => {
    console.log(value)
  }

  return (
    <div className={Style.search}>
      <Input.Search placeholder="input search text" onSearch={onSearch} enterButton />
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

export default Search
