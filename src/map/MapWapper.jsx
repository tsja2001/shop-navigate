import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { NavContext } from '../App'
import Map from './map/Map'
import Style from './MapWapper.module.less'
import ShopList from './shopList/ShopList'
import MapEditor from './editor/MapEditor'

import { getFloorImg } from '@/config/floorImages'

import { Button } from 'antd'
import { isEditMode, isDevMode, isDev2Mode } from '@/utils/isDevMode'

export const MapContext = createContext(null)

// 地图容器
const MapWapper = () => {
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  // 记录当前点击的店铺所在类型、名称
  const [clickShopTypeConfig, setClickShopTypeConfig] = useState({})
  const [clickShopItem, setClickShopItem] = useState({})

  // 编辑模式, 可以设置店铺位置
  const [devModel, setDevModel] = useState(false)
  // 控制是否显示所有品牌位置
  const [showAllBrands, setShowAllBrands] = useState(false)
  // 控制是否在地图上展示商户名称
  const [showLabelsOnMap, setShowLabelsOnMap] = useState(false)

  useEffect(() => {
    // 任一编辑模式(dev/dev2)都允许地图点选定位
    if (isEditMode()) {
      setDevModel(true)
    }
  }, [])

  // 监听楼层变化
  const navContext = useContext(NavContext)
  const { floor, getFloorConfig, getSetFloorConfigFn } = navContext

  // 使用 useRef 存储之前的 floor 值
  const prevFloorRef = useRef(floor)
  // 当切换楼层时, 清空当前点击的店铺的状态
  useEffect(() => {
    // 这个是 floor 变化前的值
    const prevFloor = prevFloorRef.current

    const prevFloorConfig = getFloorConfig(prevFloor)
    const newConfig = clearShopClickStatus(prevFloorConfig)

    const setConfigFn = getSetFloorConfigFn(prevFloor)
    setConfigFn(newConfig)

    // 切换楼层时隐藏所有品牌位置显示
    setShowAllBrands(false)

    // 更新 prevFloorRef 为当前的 floor
    prevFloorRef.current = floor
  }, [floor])

  // 获取当前点击的位置
  const handleClick = (x, y) => {
    setClickPosition({ x, y })
    const setConfigFn = getSetFloorConfigFn(floor)
    // 如果是开发模式, 记录点击位置
    console.log('clickShopItem', clickShopItem)
    if (devModel) {
      const newConfig = getCurrentShop(
        getFloorConfig(floor),
        clickShopTypeConfig,
        clickShopItem,
        (item) => {
          // 一个店铺可能有多个位置
          let position = []
          if (item.position) {
            position = item.position
          }
          position.push([x, y])
          return {
            ...item,
            position: position,
          }
        },
      )

      console.log(newConfig)

      setConfigFn(newConfig)
      // 本地缓存
      localStorage.setItem('config', JSON.stringify(newConfig))
    }
  }

  // 清除其他店铺的点击状态
  const clearShopClickStatus = (config) => {
    return config.map((item) => {
      item.content = item.content.map((item) => {
        return {
          ...item,
          isClick: false,
        }
      })
      return item
    })
  }

  // 获取当前点击的店铺（有 id 用 id 匹配, 否则回退按名称）
  const getCurrentShop = (config, curTypeConfig, shop, cb) => {
    return config.map((item) => {
      if (item.type === curTypeConfig.type) {
        item.content = item.content.map((c) => {
          const match = shop.id != null ? c.id === shop.id : c.name === shop.name
          return match ? cb(c) : c
        })
      }
      return item
    })
  }

  // 当子元素点击了店铺
  const handleClickShop = (shop, config) => {
    const setConfigFn = getSetFloorConfigFn(floor)
    const curConfig = getFloorConfig(floor)

    // 清空其他店铺的点击状态
    let newConfig = clearShopClickStatus(curConfig)

    // 设置当前店铺的点击状态
    newConfig = getCurrentShop(newConfig, config, shop, (item) => {
      return {
        ...item,
        isClick: !item.isClick,
      }
    })

    setClickShopTypeConfig(config)
    setClickShopItem(shop)

    setConfigFn(newConfig)

    // 在地图上高亮店铺
  }

  const handleExportJSON = () => {
    console.log(JSON.stringify(getFloorConfig(floor)))
  }

  const handleClearPosition = () => {
    const setConfigFn = getSetFloorConfigFn(floor)
    const newConfig = getCurrentShop(
      getFloorConfig(floor),
      clickShopTypeConfig,
      clickShopItem,
      (item) => {
        return {
          ...item,
          position: [],
        }
      },
    )

    console.log(newConfig)

    setConfigFn(newConfig)
    // 本地缓存
    localStorage.setItem('config', JSON.stringify(newConfig))
  }

  // 切换显示所有品牌位置
  const handleToggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands)
  }

  // 切换在地图上展示名称
  const handleToggleLabelsOnMap = () => {
    setShowLabelsOnMap(!showLabelsOnMap)
  }

  return (
    // provider
    <MapContext.Provider
      value={{
        handleClickShop,
        currentFloorConfig: getFloorConfig(floor),
        clickShopItem,
        showAllBrands,
        showLabelsOnMap,
        toggleShowAllBrands: handleToggleShowAllBrands,
        toggleLabelsOnMap: handleToggleLabelsOnMap,
        devModel,
      }}
    >
      <div className={Style.mapWapper}>
        <Map floor={getFloorImg(floor)} clickHandler={handleClick} />
        {/* 旧的手动编辑模式 (?type=dev) 工具条 */}
        {isDevMode() && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <Button style={{ marginLeft: '500px' }} onClick={handleExportJSON}>
              导出JSON
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleClearPosition}
            >
              清除position
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type={showAllBrands ? 'primary' : 'default'}
              onClick={handleToggleShowAllBrands}
            >
              {showAllBrands ? '隐藏所有品牌位置' : '显示所有品牌位置'}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type={showLabelsOnMap ? 'primary' : 'default'}
              onClick={handleToggleLabelsOnMap}
            >
              {showLabelsOnMap ? '隐藏地图名称' : '在地图上展示名称'}
            </Button>
          </div>
        )}
        {/* 新的图形化编辑器 (?type=dev2) */}
        {isDev2Mode() && <MapEditor />}
        <ShopList />
      </div>
    </MapContext.Provider>
  )
}

export default MapWapper
