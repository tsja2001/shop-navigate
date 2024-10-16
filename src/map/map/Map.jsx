import { useRef } from 'react'
import Style from './Map.module.less'

// 地图容器
const Map = ({ floor, clickHandler }) => {
  const mapRef = useRef(null)

  const handleClick = (event) => {
    // 获取父容器的位置
    const mapRect = mapRef.current.getBoundingClientRect()

    // 计算相对父容器的点击位置
    const x = event.clientX - mapRect.left
    const y = event.clientY - mapRect.top

    // 计算父元素宽高
    const width = mapRect.width
    const height = mapRect.height

    // 计算点击位置在父元素中的比例
    const xRatio = (x / width).toFixed(2)
    const yRatio = (y / height).toFixed(2)

    clickHandler(xRatio, yRatio)
  }

  return (
    <div className={Style.map}>
      <img
        onClick={handleClick}
        ref={mapRef}
        className={`${Style.floor} ${Style.floor1}`}
        src={floor}
        alt="1F"
      />
    </div>
  )
}

export default Map
