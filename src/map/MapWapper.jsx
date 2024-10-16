import { createContext, useContext, useEffect, useState } from 'react'
import { NavContext } from '../App'
import Map from './map/Map'
import Style from './MapWapper.module.less'
import ShopList1F from './shopList/ShopList1F'
import ShopList2F from './shopList/ShopList2F'

import Floor1 from '@/assets/map/1F.png'
import Floor2 from '@/assets/map/2F.png'
import Floor3 from '@/assets/map/3F.png'
import Floor4 from '@/assets/map/4F.png'
import Floor5 from '@/assets/map/5F.png'
import Below1 from '@/assets/map/B1.png'

import f1Config from '../config/f1.config'
import f2Config from '../config/f2.config'
import ShopList3F from './shopList/ShopList3F'
import ShopList4F from './shopList/ShopList4F'
import ShopList5F from './shopList/ShopList5F'
import ShopListB1 from './shopList/ShopListB1'
import f3Config from '../config/f3.config'
import f4Config from '../config/f4.config'
import f5Config from '../config/f5.config'
import b1Config from '../config/b1.config'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'antd'
// import f3Config from '../config/f3.config'
// import f4Config from '../config/f4.config'
// import f5Config from '../config/f5.config'
// import b1Config from '../config/b1.config'

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

  useEffect(() => {}, [floor])

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
          return {
            ...item,
            isClick: false,
            position: { x, y },
          }
        }
      )

      console.log(newConfig)

      setConfigFn(newConfig)
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
  }

  const handleExportJSON = () => {
    console.log(getConfig(floor))
  }

  return (
    // provider
    <MapContext.Provider
      value={{ handleClickShop, currentFloorConfig: getConfig(floor) }}
    >
      <div className={Style.mapWapper}>
        <Map floor={getFloorImg(floor)} clickHandler={handleClick} />
        {devModel && (
          <Button onClick={handleExportJSON}>导出JSON</Button>
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
