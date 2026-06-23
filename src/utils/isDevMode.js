// 编辑模式判断
// 在模块加载时(早于 HashRouter 的重定向)就读一次 URL 的 type 参数并缓存,
// 之后即使被路由重定向从 URL 里冲掉也不影响。
//   type=dev  -> 旧的手动编辑模式(地图点选 + 复制坐标)
//   type=dev2 -> 新的图形化编辑器(可拖拽浮窗, 商户/版面维护)
const detect = () => {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash || ''
  const qIndex = hash.indexOf('?')
  const search = qIndex >= 0 ? hash.slice(qIndex) : window.location.search
  const t = new URLSearchParams(search).get('type')
  return t === 'dev' || t === 'dev2' ? t : null
}

const mode = detect()

export const getEditMode = () => mode // 'dev' | 'dev2' | null
export const isEditMode = () => mode !== null // 任一编辑模式: 地图可点选/定位
export const isDevMode = () => mode === 'dev' // 旧手动模式
export const isDev2Mode = () => mode === 'dev2' // 新图形编辑器
