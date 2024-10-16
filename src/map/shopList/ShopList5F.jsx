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
          <ShopGroup config={getTypeInFloorConfig(config, '装饰公司')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '极简轻奢')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '会员设计中心')} />
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
        环渤海国际家具一楼，是以卫浴
        、瓷砖、石材、装饰公司等为主要经营品类的楼层。这里汇集了众多知名品牌，如九牧、科勒、马可波罗等，为消费者提供了丰富多样的家居选择。此外，这里还设有专业的装饰公司，可为顾客提供一站式的家居装修解决方案。无论是寻找高品质的建材还是寻求专业的装修建议，环渤海国际家具一楼都能满足顾客的各种需求。
      </div>
    </div>
  )
}

export default ShopList5F
