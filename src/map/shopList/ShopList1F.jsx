import { useContext } from 'react'
import f1Config from '../../config/f1.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import { MapContext } from '../MapWapper'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'

// 地图容器
const ShopList = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={Style.weiyu}>
        <ShopGroup config={getTypeInFloorConfig(config, '卫浴')} />
      </div>
      <div className={Style.cizhuan}>
        <ShopGroup config={getTypeInFloorConfig(config, '瓷砖')} />
      </div>
      <div className={`${Style.group} ${Style.group1}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '家装')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '石材')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group2}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '美缝')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '电器')} />
        </div>
      </div>
      <div className={Style.legendBox}>
        <LegendBox hasShouyintai={true} />
      </div>
      <div className={Style.detail}>
        环渤海国际家居一层主营瓷砖、卫浴及知名家装公司等品类。这里的商品服务家庭，面向工程，传递给广大顾客极尽家的奢华与美的享受。精美的瓷白、优雅的质感、考究的设计无一不诉说着这个美好年代的时尚与经典。
      </div>
    </div>
  )
}

export default ShopList
