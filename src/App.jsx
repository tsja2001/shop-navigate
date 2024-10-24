import { Navigate, Route, Routes } from 'react-router-dom'
import Style from './App.module.less'
import AppHeader from './layout/appHeader/AppHeader'
import AppSider from './layout/AppSider/AppSider'
import Floor from './menu/floor/Floor'
import { createContext, useEffect, useState } from 'react'
import MapWapper from './map/MapWapper'
import Search from './menu/search/Search'

import f1Config from './config/f1.config'
import f2Config from './config/f2.config'
import f3Config from './config/f3.config'
import f4Config from './config/f4.config'
import f5Config from './config/f5.config'
import b1Config from './config/b1.config'


// 用于当前选中楼层、搜索内容的上下文
export const NavContext = createContext(null)

function App() {
  // 当前选中楼层
  const [floor, setFloor] = useState("1F")
  // 搜索内容
  const [search, setSearch] = useState('')


  const [F1Config, setF1Config] = useState(f1Config)
  const [F2Config, setF2Config] = useState(f2Config)
  const [F3Config, setF3Config] = useState(f3Config)
  const [F4Config, setF4Config] = useState(f4Config)
  const [F5Config, setF5Config] = useState(f5Config)
  const [B1Config, setB1Config] = useState(b1Config)


  const getFloorConfig = (floor) => {
    switch (floor) {
      case '1F':
        return F1Config
      case '2F':
        return F2Config
      case '3F':
        return F3Config
      case '4F':
        return F4Config
      case '5F':
        return F5Config
      case 'B1':
        return B1Config
    }
  }

  const getSetFloorConfigFn = (floor) => {
    switch (floor) {
      case '1F':
        return setF1Config
      case '2F':
        return setF2Config
      case '3F':
        return setF3Config
      case '4F':
        return setF4Config
      case '5F':
        return setF5Config
      case 'B1':
        return setB1Config
    }
  }

  return (
    <div className={Style.app}>
      <NavContext.Provider value={{ getFloorConfig, getSetFloorConfigFn, floor, setFloor, search, setSearch }}>
        <AppHeader />
        <div className={Style.content}>
          {/* 一级菜单 楼层导览、智能搜索 */}
          <AppSider />
          {/* 二级菜单 */}
          <Routes>
            <Route path="/floor" element={<Floor />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/home/floor" replace />} />
          </Routes>
          {/* 主体部分 */}
          <MapWapper />
        </div>
      </NavContext.Provider>
    </div>
  )
}

export default App
