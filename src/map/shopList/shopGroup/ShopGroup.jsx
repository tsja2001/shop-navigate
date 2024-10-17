import { useContext, useEffect, useState } from 'react'
import Style from './ShopGroup.module.less'
import { MapContext } from '../../MapWapper'
import { useSearchParams } from 'react-router-dom'

// 地图容器
const ShopGroup = ({ config, col = 1, style = {} }) => {
  const width = 186 * col + 3 * (col - 1) + 7 * 2 + 'px'
  const { handleClickShop } = useContext(MapContext)

  // 编辑模式, 可以显示坐标
  const [devModel, setDevModel] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 获取url参数, 判断是否是编辑模式
    const type = searchParams.get('type')
    if (type == 'dev') {
      setDevModel(true)
    }
  }, [])

  return (
    <div
      className={Style.shopGroup}
      style={{ backgroundColor: config?.color, width: width }}
    >
      <div className={Style.title} style={style}>
        {config.type}
      </div>
      <div
        className={Style.content}
        style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}
      >
        {config.content.map((item) => {
          return (
            <div
              key={item.num}
              className={`${Style.item} ${item.isClick ? Style.active : ''}`}
              onClick={() => handleClickShop(item, config)}
            >
              <div className={Style.itemName}>
                {item.name}
                {devModel && item.position && item.position.map(item => item.join('-')).join(',')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShopGroup
