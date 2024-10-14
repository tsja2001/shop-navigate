import Style from './Map.module.less'
import Floor1 from '@/assets/map/1F.png'
import Floor2 from '@/assets/map/2F.png'
import Floor3 from '@/assets/map/3F.png'
import Floor4 from '@/assets/map/4F.png'
import Floor5 from '@/assets/map/5F.png'
import Below1 from '@/assets/map/B1.png'

// 地图容器
const Map = () => {
  return (
    <div className={Style.map}>
      {/* <img className={`${Style.floor} ${Style.floor1}`} src={Floor1} alt="1F" /> */}
    </div>
  )
}

export default Map
