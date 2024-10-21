import { Navigate, Route, Routes } from 'react-router-dom'
import Style from './App.module.less'
import AppHeader from './layout/appHeader/AppHeader'
import AppSider from './layout/AppSider/AppSider'
import Floor from './menu/floor/Floor'
import { createContext, useEffect, useState } from 'react'
import MapWapper from './map/MapWapper'

// 用于当前选中楼层、搜索内容的上下文
export const NavContext = createContext(null)

function App() {
  // 当前选中楼层
  const [floor, setFloor] = useState("1F")
  // 搜索内容
  const [search, setSearch] = useState('')

  // window.addEventListener('resize', () => {
  //   const scale = 1 / window.devicePixelRatio;
  //   document.body.style.transform = `scale(${scale})`;
  //   document.body.style.width = `${100 * window.devicePixelRatio}%`;

  // })

  // useEffect(() => {
  //   const scale = 1 / window.devicePixelRatio;
  //   document.body.style.transform = `scale(${scale})`;
  //   document.body.style.transformOrigin = 'top left';
  //   document.body.style.width = `${100 * window.devicePixelRatio}%`;
  // }, []);

  return (
    <>
      <NavContext.Provider value={{ floor, setFloor, search, setSearch }}>
        <AppHeader />
        <div className={Style.content}>
          {/* 一级菜单 楼层导览、智能搜索 */}
          <AppSider />
          {/* 二级菜单 */}
          <Routes>
            <Route path="/floor" element={<Floor />} />
            <Route path="/search" element={<h1></h1>} />
            <Route path="*" element={<Navigate to="/home/floor" replace />} />
          </Routes>
          {/* 主体部分 */}
          <MapWapper />
        </div>
      </NavContext.Provider>
    </>
  )
}

export default App
