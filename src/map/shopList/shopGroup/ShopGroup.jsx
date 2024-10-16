import { useContext } from 'react'
import Style from './ShopGroup.module.less'
import { MapContext } from '../../MapWapper'

// 地图容器
const ShopGroup = ({ config, col = 1, style = {} }) => {
  const width = 186 * col + 3 * (col - 1) + 7 * 2 + 'px'
  const { handleClickShop } = useContext(MapContext)
  return (
    <div
      className={Style.shopGroup}
      style={{ backgroundColor: config?.color, width: width }}
    >
      <div className={Style.title} style={style}>{config.type}</div>
      <div
        className={Style.content}
        style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}
      >
        {config.content.map((item) => {
          return (
            <div key={item.num} className={`${Style.item} ${item.isClick ? Style.active : ''}`} onClick={() => handleClickShop(item, config)}>
              <div className={Style.itemName}>{item.name} {item.position?.x},{item.position?.y}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShopGroup
