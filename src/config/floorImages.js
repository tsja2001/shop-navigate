import Floor1 from '@/assets/map/1F.png'
import Floor2 from '@/assets/map/2F.png'
import Floor3 from '@/assets/map/3F.png'
import Floor4 from '@/assets/map/4F.png'
import Floor5 from '@/assets/map/5F.png'
import Below1 from '@/assets/map/B1.png'

export const FLOOR_IMAGES = [
  { floor: 'B1', src: Below1 },
  { floor: '1F', src: Floor1 },
  { floor: '2F', src: Floor2 },
  { floor: '3F', src: Floor3 },
  { floor: '4F', src: Floor4 },
  { floor: '5F', src: Floor5 },
]

export const FLOOR_IMAGE_URLS = FLOOR_IMAGES.map((item) => item.src)

export const getFloorImg = (floor) => {
  return FLOOR_IMAGES.find((item) => item.floor === floor)?.src
}
