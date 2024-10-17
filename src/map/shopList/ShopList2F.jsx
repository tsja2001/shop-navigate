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
      环渤海国际家居二层主营地板、全屋定制、门、门窗等品类。用木质的沉稳基调绘写自然，再配以缤纷的色彩、环保的型材，浓郁的大自然气息散发在每一处角落，将地面、墙体上的风景演绎得淋漓尽致，让每个家庭一起分享更多的快乐！
      </div>
    </div>
  )
}

export default ShopList2F
