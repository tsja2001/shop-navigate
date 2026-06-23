import { useContext } from 'react'
import { MapContext } from '../MapWapper'
import { NavContext } from '../../App'
import LegendBox from './legendBox/LegendBox'
import ShopGroup from './shopGroup/ShopGroup'
import Style from './ShopList.module.less'
import { FLOOR_DETAIL } from './floorMeta'

// 按 layout_col 把品类分到各列, 列内按 sort_order 从上到下排
const buildColumns = (config) => {
  const byCol = {}
  ;(config || []).forEach((cat) => {
    const c = cat.layout_col ?? 0
    if (!byCol[c]) byCol[c] = []
    byCol[c].push(cat)
  })
  return Object.keys(byCol)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) =>
      byCol[k].slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    )
}

// 右侧品类区: 完全由数据(layout_col/sort_order/width_cols)驱动渲染
const ShopList = () => {
  const { currentFloorConfig } = useContext(MapContext)
  const { floor } = useContext(NavContext)
  const columns = buildColumns(currentFloorConfig)

  return (
    <div className={Style.shopList}>
      {columns.map((col, ci) => (
        <div key={ci} className={Style.group}>
          {col.map((cat) => (
            <ShopGroup key={cat.id} config={cat} col={cat.width_cols || 1} />
          ))}
        </div>
      ))}
      <div className={Style.legendBox}>
        <LegendBox hasShouyintai={floor === '1F'} />
      </div>
      {FLOOR_DETAIL[floor] && (
        <div className={Style.detail}>{FLOOR_DETAIL[floor]}</div>
      )}
    </div>
  )
}

export default ShopList
