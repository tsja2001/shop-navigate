import { useContext } from 'react'
import f3Config from '../../config/f3.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'
import { MapContext } from '../MapWapper'

// 地图容器
const ShopList3F = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={Style.weiyu}>
        <ShopGroup config={getTypeInFloorConfig(config, '橱柜、定制')} />
      </div>
      <div className={Style.group}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '电器')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '吊顶')} />
        </div>
      </div>
      <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup
            config={getTypeInFloorConfig(config, '地暖、灯饰、涂料、艺术漆')}
          />
        </div>
      </div>
      <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '窗帘、壁纸')} />
        </div>
      </div>
      <div className={Style.legendBox}>
        <LegendBox />
      </div>
      <div className={Style.detail}>
        环渤海国际家居三层主营软装、电器及全屋定制等品类。顾客走进这里便是一个五彩斑斓的殿堂，或高端智能、或简约、或唯美、或古典⋯⋯，都能给您恰到好处的选择。
        家是一个延续一生的作品，在环渤海，家带来的幸福被无限放大。
      </div>
    </div>
  )
}

export default ShopList3F
