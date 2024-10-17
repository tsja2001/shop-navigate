import Style from './LegendBox.module.less'
import buti from '@/assets/legend/步梯.png'
import dianti from '@/assets/legend/电梯.png'
import futi from '@/assets/legend/扶梯.png'
import huoti from '@/assets/legend/货梯.png'
import xishoujian from '@/assets/legend/洗手间.png'
import shouyintai from '@/assets/legend/收银台.png'
import fuwutai from '@/assets/legend/服务台.png'

const LegendBox = ({ hasShouyintai = false }) => {
  return (
    <div className={Style.legendBox}>
      <div className={Style.col}>
        <div
          className={Style.legendBoxItem}
          style={{ backgroundColor: '#71130B' }}
        >
          <img src={buti} alt="" />
          步梯
        </div>
        <div
          className={Style.legendBoxItem}
          style={{ backgroundColor: '#71130B' }}
        >
          <img src={dianti} alt="" />
          电梯
        </div>
        <div
          className={Style.legendBoxItem}
          style={{ backgroundColor: '#71130B' }}
        >
          <img src={futi} alt="" />
          扶梯
        </div>
        <div
          className={Style.legendBoxItem}
          style={{ backgroundColor: '#71130B' }}
        >
          <img src={huoti} alt="" />
          货梯
        </div>
      </div>
      <div className={Style.col}>
        <div
          className={Style.legendBoxItem}
          style={{ backgroundColor: '#D22D25' }}
        >
          <img src={xishoujian} alt="" />
          洗手间
        </div>
        {hasShouyintai && (
          <div
            className={`${Style.legendBoxItem} ${Style.shouyintai}`}
            style={{ backgroundColor: '#D22D25' }}
          >
            <img src={shouyintai} alt="" />
            收银台
          </div>
        )}
        <div
          className={`${Style.legendBoxItem} ${Style.fuwutai}`}
          style={{ backgroundColor: '#538578' }}
        >
          <img src={fuwutai} alt="" />
          服务台
        </div>
      </div>
    </div>
  )
}

export default LegendBox
