import { useContext, useEffect } from 'react'
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

const getShopListConfig = (floor) => {
  switch (floor) {
    case '1F':
      return f1Config
    case '2F':
      return f2Config
  }
}

// 地图容器
const MapWapper = () => {
  // 监听楼层变化
  const navContext = useContext(NavContext)
  const { floor } = navContext

  useEffect(() => {
    console.log('MapWapper', floor)
  }, [floor])

  return (
    <div className={Style.mapWapper}>
      <Map floor={getFloorImg(floor)} />
      {floor === '1F' && <ShopList1F />}
      {floor === '2F' && <ShopList2F />}
    </div>
  )
}

export default MapWapper
