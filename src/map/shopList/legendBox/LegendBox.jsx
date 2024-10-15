import Style from './LegendBox.module.less'
import buti from '@/assets/legend/步梯.png'
import dianti from '@/assets/legend/电梯.png'
import futi from '@/assets/legend/扶梯.png'
import huoti from '@/assets/legend/货梯.png'
import xishoujian from '@/assets/legend/洗手间.png'




const LegendBox = () => {
  return (
    <div className={Style.legendBox}>
			<div className={Style.legendBoxItem} style={{'backgroundColor': '#71130B'}}>
				<img src={buti} alt=""/>
				步梯
			</div>
			<div className={Style.legendBoxItem} style={{'backgroundColor': '#71130B'}}>
				<img src={dianti} alt=""/>
				电梯
			</div>
			<div className={Style.legendBoxItem} style={{'backgroundColor': '#71130B'}}>
				<img src={futi} alt=""/>
				扶梯
			</div>
			<div className={Style.legendBoxItem} style={{'backgroundColor': '#71130B'}}>
				<img src={huoti} alt=""/>
				货梯
			</div>
			<div className={Style.legendBoxItem} style={{'backgroundColor': '#D22D25'}}>
				<img src={xishoujian} alt=""/>
				洗手间
			</div>
    </div>
  )
}

export default LegendBox
