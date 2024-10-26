import React, { useContext, useState } from 'react'
import Style from './Search.module.less'
import FloorItem from '../../component/floorItem/FloorItem'
import floorConfig from '../../config/floor.config'
import { NavContext } from '../../App'
import { Input } from 'antd'

// 楼层菜单
const Search = () => {
  const { floor, setFloor, getFloorConfig, getSetFloorConfigFn } =
    useContext(NavContext)

  const [sideBarFloorConfig, setSideBarFloorConfig] = useState(floorConfig)

  const [searchText, setSearchText] = useState('')

  // 点击楼层
  const handleClickFloor = (floor) => {
    setFloor(floor)
  }

  // 搜索事件
  const onSearch = (value) => {
    const str = value.trim()
    if (str.length == 0) return
    setSearchText(str)
    searchContent(str)
  }

  // 搜索内容
  const searchContent = (value) => {
    resetSearchResult()

    const f1Config = getFloorConfig('1F')
    const f2Config = getFloorConfig('2F')
    const f3Config = getFloorConfig('3F')
    const f4Config = getFloorConfig('4F')
    const f5Config = getFloorConfig('5F')
    const b1Config = getFloorConfig('B1')

    // 设置
    const getFloorConfigResult = (config) => {
      let typeCount = 0
      let shopCount = 0
      const res = config.map((type) => {
        if (type.type.includes(value)) {
          type.isSearchResult = true
          typeCount++
        }
        type.content = type.content.map((shop) => {
          if (shop.name.includes(value)) {
            shop.isSearchResult = true
            shopCount++
          }
          return shop
        })

        return type
      })

      res.typeCount = typeCount
      res.shopCount = shopCount

      return res
    }

    const f1ConfigRes = getFloorConfigResult(f1Config, '1F')
    const f2ConfigRes = getFloorConfigResult(f2Config, '2F')
    const f3ConfigRes = getFloorConfigResult(f3Config, '3F')
    const f4ConfigRes = getFloorConfigResult(f4Config, '4F')
    const f5ConfigRes = getFloorConfigResult(f5Config, '5F')
    const b1ConfigRes = getFloorConfigResult(b1Config, 'B1')

    getSetFloorConfigFn('1F')(f1ConfigRes)
    getSetFloorConfigFn('2F')(f2ConfigRes)
    getSetFloorConfigFn('3F')(f3ConfigRes)
    getSetFloorConfigFn('4F')(f4ConfigRes)
    getSetFloorConfigFn('5F')(f5ConfigRes)
    getSetFloorConfigFn('B1')(b1ConfigRes)

    // 设置楼层导航栏内信息
    const setSideBarFloorConfigFn = (config, floorStr) => {
      if (config.typeCount == 0 && config.shopCount == 0) return
      sideBarFloorConfig.forEach((item) => {
        if (item.title == floorStr) {
          if (config.shopCount == 0) {
            item.searchResText = `找到${config.typeCount}个品类`
          }
          if (config.typeCount == 0) {
            item.searchResText = `找到${config.shopCount}个商家`
          }
          if (config.shopCount > 0 && config.typeCount > 0) {
            item.searchResText = `共找到${config.typeCount}个品类, ${config.shopCount}个商家`
          }
        }
      })

      setSideBarFloorConfig(sideBarFloorConfig)
    }

    setSideBarFloorConfigFn(f1ConfigRes, '1F')
    setSideBarFloorConfigFn(f2ConfigRes, '2F')
    setSideBarFloorConfigFn(f3ConfigRes, '3F')
    setSideBarFloorConfigFn(f4ConfigRes, '4F')
    setSideBarFloorConfigFn(f5ConfigRes, '5F')
    setSideBarFloorConfigFn(b1ConfigRes, 'B1')
  }

  // 重制所有搜索结果
  const resetSearchResult = () => {
    const f1Config = getFloorConfig('1F')
    const f2Config = getFloorConfig('2F')
    const f3Config = getFloorConfig('3F')
    const f4Config = getFloorConfig('4F')
    const f5Config = getFloorConfig('5F')
    const b1Config = getFloorConfig('B1')

    const resetFn = (config) => {
      const res = config.map((type) => {
        type.isSearchResult = false
        type.content = type.content.map((item) => {
          item.isSearchResult = false
          return item
        })

        return type
      })

      return res
    }

    resetFn(f1Config)
    resetFn(f2Config)
    resetFn(f3Config)
    resetFn(f4Config)
    resetFn(f5Config)
    resetFn(b1Config)

    getSetFloorConfigFn('1F')(f1Config)
    getSetFloorConfigFn('2F')(f2Config)
    getSetFloorConfigFn('3F')(f3Config)
    getSetFloorConfigFn('4F')(f4Config)
    getSetFloorConfigFn('5F')(f5Config)
    getSetFloorConfigFn('B1')(b1Config)

    // 重置楼层导航栏内信息
    sideBarFloorConfig.forEach((item) => {
      item.searchResText = ''
    })

    setSideBarFloorConfig(sideBarFloorConfig)
  }

  return (
    <div className={Style.search}>
      <Input.Search
        placeholder="请输入您要搜索的家具"
        onSearch={onSearch}
        enterButton
      />
      {sideBarFloorConfig.map((item, index) => {
        if (item.searchResText) {
          return (
            <FloorItem
              key={item.title}
              title={item.title}
              content={item.content.join(' ')}
              onClick={() => handleClickFloor(item.title)}
              searchResText={item.searchResText}
              active={floor === item.title}
              disable={item.disable}
            />
          )
        }
      })}
      {/* 如果一个都没有 */}
      {searchText.length > 0 &&
        sideBarFloorConfig.every((item) => !item.searchResText) && (
          <div className={Style.noSearchResult}>暂未找到相关结果</div>
        )}
    </div>
  )
}

export default Search
