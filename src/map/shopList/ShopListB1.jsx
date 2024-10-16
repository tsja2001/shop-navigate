import { useContext } from 'react'
import b1Config from '../../config/b1.config'
import f1Config from '../../config/f1.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'
import { MapContext } from '../MapWapper'

// 地图容器
const ShopListB1 = () => {
  const { currentFloorConfig } = useContext(MapContext)

  const config = currentFloorConfig

  return (
    <div className={Style.shopList}>
      <div className={`${Style.group} ${Style.group1}`}>
        <div className={Style.weiyu}>
          <ShopGroup config={getTypeInFloorConfig(config, '电梯')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '定制')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '进口软床')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group1}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '办公家具')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '沙发')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '灯饰')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group2}`}>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '家具')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '涂料/床垫')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group2}`}>
        <div className={Style.cizhuan}>
          <ShopGroup
            style={{ fontSize: '16px' }}
            config={getTypeInFloorConfig(config, '直播间、文创孵化基地')}
          />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(config, '超市')} />
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

export default ShopListB1
