import Style from './ShopGroup.module.less'

// 地图容器
const ShopGroup = ({ config }) => {
  console.log('config', config)
  return (
    <div className={Style.shopGroup} style={{ backgroundColor: config?.color }}>
      <div className={Style.title}>{config.type}</div>
      <div className={Style.content}>
        {config.content.map((item) => {
          return (
            <div key={item.num} className={Style.item}>
              <div className={Style.itemName}>{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShopGroup
