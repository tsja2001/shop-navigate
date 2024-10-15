import f1Config from '../../config/f1.config'
import { getTypeInFloorConfig } from '../../utils/getTypeInFloorConfig'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'

// 地图容器
const ShopList = () => {
  return (
    <div className={Style.shopList}>
      <div className={Style.weiyu}>
        <ShopGroup config={getTypeInFloorConfig(f1Config, '卫浴')} />
      </div>
      <div className={Style.cizhuan}>
        <ShopGroup config={getTypeInFloorConfig(f1Config, '瓷砖')} />
      </div>
      <div className={`${Style.group} ${Style.group1}`} >
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(f1Config, '石材')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(f1Config, '装饰公司')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(f1Config, '淋浴房')} />
        </div>
      </div>
      <div className={`${Style.group} ${Style.group2}`} >
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(f1Config, '美缝')} />
        </div>
        <div className={Style.cizhuan}>
          <ShopGroup config={getTypeInFloorConfig(f1Config, '净水')} />
        </div>
      </div>
      <div className={Style.legendBox}>
        <LegendBox />
      </div>
      <div className={Style.detail}>
        环渤海国际家具一楼，是以卫浴  、瓷砖、石材、装饰公司等为主要经营品类的楼层。这里汇集了众多知名品牌，如九牧、科勒、马可波罗等，为消费者提供了丰富多样的家居选择。此外，这里还设有专业的装饰公司，可为顾客提供一站式的家居装修解决方案。无论是寻找高品质的建材还是寻求专业的装修建议，环渤海国际家具一楼都能满足顾客的各种需求。
      </div>
    </div>
  )
}

export default ShopList
