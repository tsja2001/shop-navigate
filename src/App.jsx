import { Navigate, Route, Routes } from 'react-router-dom'
import Style from './App.module.less'
import AppHeader from './layout/appHeader/AppHeader'
import AppSider from './layout/AppSider/AppSider'
import Floor from './menu/floor/Floor'
import { createContext, useState } from 'react'
import MapWapper from './map/MapWapper'

// 用于当前选中楼层、搜索内容的上下文
export const NavContext = createContext(null)

function App() {
  // 当前选中楼层
  const [floor, setFloor] = useState("1F")
  // 搜索内容
  const [search, setSearch] = useState('')

  return (
    <>
      <NavContext.Provider value={{ floor, setFloor, search, setSearch }}>
        <AppHeader />
        <div className={Style.content}>
          <AppSider />
          <Routes>
            <Route path="/floor" element={<Floor />} />
            <Route path="/search" element={<h1>bbb</h1>} />
            <Route path="*" element={<Navigate to="/home/floor" replace />} />
          </Routes>
          <MapWapper />
        </div>
      </NavContext.Provider>
    </>
  )
}

export default App
