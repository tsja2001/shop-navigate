import { useRef, useState } from 'react'
import Style from './DraggablePanel.module.css'

// 可拖拽浮窗：标题栏按住拖动，body 可滚动，不铺满屏幕，方便随时挪开看地图
const DraggablePanel = ({
  title,
  onClose,
  children,
  defaultPos = { x: 60, y: 70 },
  width = 400,
}) => {
  const [pos, setPos] = useState(defaultPos)
  const dragRef = useRef(null)

  const onMouseDown = (e) => {
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      bx: pos.x,
      by: pos.y,
    }
    const onMove = (ev) => {
      const d = dragRef.current
      if (!d) return
      setPos({ x: d.bx + (ev.clientX - d.sx), y: d.by + (ev.clientY - d.sy) })
    }
    const onUp = () => {
      dragRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  }

  return (
    <div className={Style.panel} style={{ left: pos.x, top: pos.y, width }}>
      <div className={Style.header} onMouseDown={onMouseDown}>
        <span className={Style.title}>{title}</span>
        <span className={Style.close} onClick={onClose}>
          ×
        </span>
      </div>
      <div className={Style.body}>{children}</div>
    </div>
  )
}

export default DraggablePanel
