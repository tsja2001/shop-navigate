import { useContext, useEffect, useRef, useState } from 'react'
import Style from './Map.module.less'
import { MapContext } from '../MapWapper'
import { useSearchParams } from 'react-router-dom'

// 地图容器
const Map = ({ floor, clickHandler }) => {
  const mapRef = useRef(null)

  const { currentFloorConfig, clickShopItem } = useContext(MapContext)
  // 地图容器宽高
  const [mapRect, setMapRect] = useState({})
  // dev模式下 要现实所有的points
  const [allPoints, setAllPoints] = useState([])
  // 显示当前点击的店铺
  const [currentPoint, setCurrentPoint] = useState(null)

  // 地图容器margin-top
  const mapMarginTop = -150

  // 编辑模式, 展示所有店铺位置
  const [devModel, setDevModel] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 获取url参数, 判断是否是编辑模式
    const type = searchParams.get('type')
    console.log(type)
    console.log(type == 'dev')
    if (type == 'dev') {
      setDevModel(true)
    }
  }, [])

  // 初始化计算父元素宽高
  useEffect(() => {
    setTimeout(() => {
      const mapRect = mapRef.current.getBoundingClientRect()
      setMapRect(mapRect)
    }, 100)
  }, [])

  window.addEventListener('resize', () => {
    const mapRect = mapRef.current.getBoundingClientRect()
    setMapRect(mapRect)
  })

  const handleClick = (event) => {
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

  // 获取要显示的点击位置
  const getShowClickPosition = () => {
    const positions = []
    currentFloorConfig.map((item) => {
      item.content.map((content) => {
        if (content.position?.length > 0) {
          content.position.forEach((position) => {
            console.log('mapRect.width mapRect.height', mapRect.width, mapRect.height)
            const x = (position[0] * mapRect.width).toFixed(2) + 'px'
            const y = (position[1] * mapRect.height).toFixed(2) -150 + 'px'
            positions.push({ x, y })
          })
        }
      })
    })

    return positions
  }

  // dev模式下展示所有点击的店铺
  useEffect(() => {
    if (!devModel) return
    const positions = getShowClickPosition()
    // console.log('positions allallall', positions)
    setAllPoints(positions)
  }, [currentFloorConfig, mapRect])

  // 监听当前点击的店铺, 显示当前店铺位置
  useEffect(() => {
    if (clickShopItem?.position?.length > 0) {
      console.log('clickShopItem', clickShopItem)
      const positions = []
      clickShopItem.position.forEach((position) => {
        console.log('position', position)
        console.log('mapRect.height', mapRect.height)
        const x = (position[0] * mapRect.width).toFixed(2) + 'px'
        const y = (position[1] * mapRect.height).toFixed(2) -150 + 'px'
        positions.push({ x, y })
      })

      setCurrentPoint(positions)
      console.log('setCurrentPoint--', positions)
    }
  }, [clickShopItem])

  return (
    <div className={Style.map}>
      <img
        onClick={handleClick}
        ref={mapRef}
        className={`${Style.floor} ${Style.floor1}`}
        src={floor}
        style={{ marginTop: mapMarginTop }}
        alt="1F"
      />
      <div
        className={Style.cover}
        style={{
          width: mapRect.width + 'px',
          height: mapRect.height + 'px',
          // marginTop: '-150px',
        }}
      >
        {/* 编辑模式下展示所有店铺位置 */}
        {devModel &&
          allPoints.map((item, index) => {
            return (
              <div
                key={index}
                className={Style.point}
                style={{ left: item.x, top: item.y }}
              ></div>
            )
          })}
        {
          currentPoint && currentPoint.map((item, index) => {
            return (
              <div
                key={index}
                className={`${Style.currentPoint} ${Style.point}`}
                style={{ left: item.x, top: item.y }}
              >
                <div className={Style.currentPointInner}></div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Map
