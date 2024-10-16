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

    clickHandler(x, y)
  }

  return (
    <div className={Style.map} ref={mapRef}>
      <img
        onClick={handleClick}
        className={`${Style.floor} ${Style.floor1}`}
        src={floor}
        alt="1F"
      />
    </div>
  )
}

export default Map
