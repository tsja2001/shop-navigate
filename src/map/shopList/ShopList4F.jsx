import { useContext } from 'react'
import f3Config from '../../config/f3.config'
import f4Config from '../../config/f4.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'
import { MapContext } from '../MapWapper'

// 地图容器
const ShopList4F = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={Style.weiyu}>
        <ShopGroup col={2} config={getTypeInFloorConfig(config, '软体家具')} />
      </div>
      <div className={Style.group}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '欧美家具')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '定制')} />
        </div>
      </div>
      <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '儿童家具')} />
        </div>
      </div>
      {/* <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup
            config={getTypeInFloorConfig(config, '地暖、灯饰、涂料、艺术漆')}
          />
        </div>
      </div> */}
      <div className={Style.legendBox}>
        <LegendBox />
      </div>
      <div className={Style.detail}>
      环渤海国际家居四层，各种体验式门店风格迥异，软体家具、欧美家具、儿童家具等品类共同演绎着灵动、生机与活力，在简单舒适中探寻生活的精致，传递着安全健康的居家理念，享轻奢，悦生活，给您打造一个梦想家！
      </div>
    </div>
  )
}

export default ShopList4F
