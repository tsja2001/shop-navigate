import { useContext } from 'react'
import f3Config from '../../config/f3.config'
import f4Config from '../../config/f4.config'
import f5Config from '../../config/f5.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import { MapContext } from '../MapWapper'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'

// 地图容器
const ShopList5F = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={Style.group}>
        <div className={Style.weiyu}>
          <ShopGroup config={getTypeInFloorConfig(config, '实木家具')} />
        </div>
        <div className={Style.weiyu}>
          <ShopGroup config={getTypeInFloorConfig(config, '灯饰')} />
        </div>
      </div>
      <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '装饰公司')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '极简轻奢')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '会员设计中心')} />
        </div>
      </div>
      <div className={Style.group}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '欧美家具')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '红木、榆木家具')} />
        </div>
      </div>
      <div className={`${Style.group}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '定制')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup
            config={getTypeInFloorConfig(config, 'AI+智能家居生活馆')}
          />
        </div>
      </div>
      <div className={Style.legendBox}>
        <LegendBox />
      </div>
      <div className={Style.detail}>
        环渤海国际家居五层，低调中的奢华是唯一的主旋律，独具匠心的中式家具、浪漫轻奢的欧美家具、美轮美奂的名品灯饰在这里相融共生，高贵的生活品质在这里充分彰显，让您尽享健康舒适的美居生活。
      </div>
    </div>
  )
}

export default ShopList5F
