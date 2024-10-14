import Map from './map/Map'
import Style from './MapWapper.module.less'
import ShopList from './shopList/ShopList'

// 地图容器
const MapWapper = () => {
  return (
    <div className={Style.mapWapper}>
      <Map />
      <ShopList />
    </div>
  )
}

export default MapWapper
