import { useContext } from 'react'
import f2Config from '../../config/f2.config'
import f3Config from '../../config/f3.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import { MapContext } from '../MapWapper'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'

// 地图容器
const ShopList2F = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={Style.weiyu}>
        <ShopGroup config={getTypeInFloorConfig(config, '定制、衣柜')} />
      </div>
      <div className={Style.group}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '家装、楼梯')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '地板')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group1}`}>
        <div className={Style.cizhuan}>
          <ShopGroup
            col={2}
            config={getTypeInFloorConfig(config, '影音、灯饰、玻璃、硅藻泥')}
          />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup
            col={2}
            config={getTypeInFloorConfig(config, '门、门窗')}
          />
        </div>
      </div>
      <div className={Style.legendBox}>
        <LegendBox />
      </div>
      <div className={Style.detail}>
        环渤海国际家具一楼，是以卫浴
        、瓷砖、石材、装饰公司等为主要经营品类的楼层。这里汇集了众多知名品牌，如九牧、科勒、马可波罗等，为消费者提供了丰富多样的家居选择。此外，这里还设有专业的装饰公司，可为顾客提供一站式的家居装修解决方案。无论是寻找高品质的建材还是寻求专业的装修建议，环渤海国际家具一楼都能满足顾客的各种需求。
      </div>
    </div>
  )
}

export default ShopList2F
