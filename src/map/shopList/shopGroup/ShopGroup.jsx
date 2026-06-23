import { useContext } from 'react'
import Style from './ShopGroup.module.less'
import { MapContext } from '../../MapWapper'
import { isEditMode } from '@/utils/isDevMode'
import { Button, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

// 地图容器
const ShopGroup = ({ config, col = 1, style = {} }) => {
  const width = 186 * col + 3 * (col - 1) + 7 * 2 + 'px'
  const { handleClickShop } = useContext(MapContext)

  // 编辑模式(dev/dev2)下显示坐标, 方便核对
  const devModel = isEditMode()

  // 复制 position 数据
  const copyPosition = (position, e) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发 handleClickShop
    const positionStr = position.map((item) => `[${item.join(',')}]`).join(',')
    navigator.clipboard.writeText(positionStr).then(() => {
      message.success('位置数据已复制到剪贴板')
    })
  }

  return (
    <div
      className={`${Style.shopGroup} ${
        config?.isSearchResult ? Style.shopGroupSearchResult : ''
      }`}
      style={{ backgroundColor: config?.color, width: width }}
    >
      <div className={Style.title} style={style}>
        {config.type}
      </div>
      <div
        className={Style.content}
        style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}
      >
        {(config.content || []).map((item) => {
          return (
            <div
              key={item.id ?? item.num}
              className={`${Style.item} ${item.isSearchResult ? Style.shopItemSearchResult : ''} ${item.isClick ? Style.active : ''} `}
              onClick={() => handleClickShop(item, config)}
            >
              <div className={Style.itemName}>
                {item.name}
                {devModel && item.position && (
                  <span className={Style.positionInfo}>
                    {item.position
                      .map((item) => `[${item.join(',')}]`)
                      .join(',')}
                    <Button
                      type="link"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={(e) => copyPosition(item.position, e)}
                      className={Style.copyBtn}
                    />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShopGroup
