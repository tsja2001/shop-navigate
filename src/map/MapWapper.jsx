import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { NavContext } from '../App'
import Map from './map/Map'
import Style from './MapWapper.module.less'
import ShopList1F from './shopList/ShopList1F'
import ShopList2F from './shopList/ShopList2F'
import ShopList3F from './shopList/ShopList3F'
import ShopList4F from './shopList/ShopList4F'
import ShopList5F from './shopList/ShopList5F'
import ShopListB1 from './shopList/ShopListB1'

import Floor1 from '@/assets/map/1F.png'
import Floor2 from '@/assets/map/2F.png'
import Floor3 from '@/assets/map/3F.png'
import Floor4 from '@/assets/map/4F.png'
import Floor5 from '@/assets/map/5F.png'
import Below1 from '@/assets/map/B1.png'

import f1Config from '../config/f1.config'
import f2Config from '../config/f2.config'
import f3Config from '../config/f3.config'
import f4Config from '../config/f4.config'
import f5Config from '../config/f5.config'
import b1Config from '../config/b1.config'

import { useSearchParams } from 'react-router-dom'
import { Button } from 'antd'

const getFloorImg = (floor) => {
  switch (floor) {
    case '1F':
      return Floor1
    case '2F':
      return Floor2
    case '3F':
      return Floor3
    case '4F':
      return Floor4
    case '5F':
      return Floor5
    case 'B1':
      return Below1
  }
}

export const MapContext = createContext(null)

// 地图容器
const MapWapper = () => {
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  // 记录当前点击的店铺所在类型、名称
  const [clickShopTypeConfig, setClickShopTypeConfig] = useState({})
  const [clickShopItem, setClickShopItem] = useState({})

  const [F1Config, setF1Config] = useState(f1Config)
  const [F2Config, setF2Config] = useState(f2Config)
  const [F3Config, setF3Config] = useState(f3Config)
  const [F4Config, setF4Config] = useState(f4Config)
  const [F5Config, setF5Config] = useState(f5Config)
  const [B1Config, setB1Config] = useState(b1Config)

  // 编辑模式, 可以设置店铺位置
  const [devModel, setDevModel] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 获取url参数, 判断是否是编辑模式
    const type = searchParams.get('type')
    console.log(type)
    console.log(type == 'dev')
    if (type == 'dev') {
      setDevModel(true)
    }
  }, [])

  const getConfig = (floor) => {
    switch (floor) {
      case '1F':
        return F1Config
      case '2F':
        return F2Config
      case '3F':
        return F3Config
      case '4F':
        return F4Config
      case '5F':
        return F5Config
      case 'B1':
        return B1Config
    }
  }

  const getSetConfigFn = (floor) => {
    switch (floor) {
      case '1F':
        return setF1Config
      case '2F':
        return setF2Config
      case '3F':
        return setF3Config
      case '4F':
        return setF4Config
      case '5F':
        return setF5Config
      case 'B1':
        return setB1Config
    }
  }

  // 监听楼层变化
  const navContext = useContext(NavContext)
  const { floor } = navContext

  // 当切换楼层时, 清空当前点击的店铺的状态

  // 使用 useRef 存储之前的 floor 值
  const prevFloorRef = useRef(floor)
  useEffect(() => {
    // 这个是 floor 变化前的值
    const prevFloor = prevFloorRef.current

    const prevFloorConfig = getConfig(prevFloor)
    const newConfig = clearShopClickStatus(prevFloorConfig)

    const setConfigFn = getSetConfigFn(prevFloor)
    setConfigFn(newConfig)

    // 更新 prevFloorRef 为当前的 floor
    prevFloorRef.current = floor
  }, [floor])

  // 获取当前点击的位置
  const handleClick = (x, y) => {
    setClickPosition({ x, y })
    const setConfigFn = getSetConfigFn(floor)
    // 如果是开发模式, 记录点击位置
    console.log('clickShopItem', clickShopItem)
    if (devModel) {
      const newConfig = getCurrentShop(
        getConfig(floor),
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
        }
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

  // 获取当前点击的店铺
  const getCurrentShop = (config, curTypeConfig, shop, cb) => {
    return config.map((item) => {
      if (item.type === curTypeConfig.type) {
        item.content = item.content.map((item) => {
          if (item.name === shop.name) {
            return cb(item)
          }
          return item
        })
      }
      return item
    })
  }

  // 当子元素点击了店铺
  const handleClickShop = (shop, config) => {
    const setConfigFn = getSetConfigFn(floor)
    const curConfig = getConfig(floor)

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
    console.log(JSON.stringify(getConfig(floor)))
  }

  const handleClearPosition = () => {
    const setConfigFn = getSetConfigFn(floor)
    const newConfig = getCurrentShop(
      getConfig(floor),
      clickShopTypeConfig,
      clickShopItem,
      (item) => {
        return {
          ...item,
          position: [],
        }
      }
    )

    console.log(newConfig)

    setConfigFn(newConfig)
    // 本地缓存
    localStorage.setItem('config', JSON.stringify(newConfig))
  }

  return (
    // provider
    <MapContext.Provider
      value={{
        handleClickShop,
        currentFloorConfig: getConfig(floor),
        clickShopItem,
      }}
    >
      <div className={Style.mapWapper}>
        <Map floor={getFloorImg(floor)} clickHandler={handleClick} />
        {devModel && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <Button style={{ marginLeft: '500px' }} onClick={handleExportJSON}>
              导出JSON
            </Button>
            <Button
              style={{ marginLeft: '500px' }}
              onClick={handleClearPosition}
            >
              清除position
            </Button>
          </div>
        )}
        {floor === '1F' && <ShopList1F />}
        {floor === '2F' && <ShopList2F />}
        {floor === '3F' && <ShopList3F />}
        {floor === '4F' && <ShopList4F />}
        {floor === '5F' && <ShopList5F />}
        {floor === 'B1' && <ShopListB1 />}
      </div>
    </MapContext.Provider>
  )
}

export default MapWapper
