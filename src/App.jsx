import { Navigate, Route, Routes } from 'react-router-dom'
import Style from './App.module.less'
import AppHeader from './layout/appHeader/AppHeader'
import AppSider from './layout/AppSider/AppSider'
import Floor from './menu/floor/Floor'
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import MapWapper from './map/MapWapper'
import Search from './menu/search/Search'

import f1Config from './config/f1.config'
import f2Config from './config/f2.config'
import f3Config from './config/f3.config'
import f4Config from './config/f4.config'
import f5Config from './config/f5.config'
import b1Config from './config/b1.config'
import { FLOOR_IMAGE_URLS } from './config/floorImages'
import { preloadImages } from './utils/preloadImages'


// 用于当前选中楼层、搜索内容的上下文
export const NavContext = createContext(null)

const getAssetName = (url) => {
  const cleanUrl = String(url).split('?')[0]
  const filename = cleanUrl.split('/').pop() || cleanUrl
  return decodeURIComponent(filename)
}

const getNetworkText = (status) => {
  if (status === 'retrying') {
    return '网络异常，正在自动重试'
  }

  if (status === 'failed') {
    return '网络异常'
  }

  return '网络检测中'
}

function App() {
  const [mapAssetsReady, setMapAssetsReady] = useState(false)
  const [mapAssetsError, setMapAssetsError] = useState('')
  const [mapAssetsProgress, setMapAssetsProgress] = useState({
    loaded: 0,
    total: FLOOR_IMAGE_URLS.length,
  })
  const [mapAssetsStatus, setMapAssetsStatus] = useState({
    status: 'idle',
    currentAsset: '',
    attempt: 1,
    maxRetries: 5,
    speedText: '检测中',
    error: '',
  })
  const loadRunRef = useRef(0)
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

  const loadMapAssets = useCallback(() => {
    const loadRunId = loadRunRef.current + 1
    loadRunRef.current = loadRunId

    setMapAssetsReady(false)
    setMapAssetsError('')
    setMapAssetsProgress({
      loaded: 0,
      total: FLOOR_IMAGE_URLS.length,
    })
    setMapAssetsStatus({
      status: 'loading',
      currentAsset: '',
      attempt: 1,
      maxRetries: 5,
      speedText: '检测中',
      error: '',
    })

    preloadImages(FLOOR_IMAGE_URLS, {
      maxRetries: 5,
      onProgress: (loaded, total) => {
        if (loadRunRef.current !== loadRunId) return
        setMapAssetsProgress({ loaded, total })
      },
      onStatus: (status) => {
        if (loadRunRef.current !== loadRunId) return

        setMapAssetsProgress({
          loaded: status.loaded,
          total: status.total,
        })
        setMapAssetsStatus({
          status: status.status,
          currentAsset: status.url ? getAssetName(status.url) : '',
          attempt: status.attempt,
          maxRetries: status.maxRetries,
          speedText: status.speedText || '检测中',
          error: status.error || '',
        })
      },
    })
      .then(() => {
        if (loadRunRef.current !== loadRunId) return
        setMapAssetsReady(true)
      })
      .catch((error) => {
        if (loadRunRef.current !== loadRunId) return
        setMapAssetsError(error.message || '地图资源加载失败')
      })
  }, [])

  useEffect(() => {
    loadMapAssets()
  }, [loadMapAssets])

  if (!mapAssetsReady) {
    const remainingMapAssets = mapAssetsProgress.total - mapAssetsProgress.loaded
    const progressPercent = mapAssetsProgress.total
      ? (mapAssetsProgress.loaded / mapAssetsProgress.total) * 100
      : 0
    const retryText = mapAssetsStatus.status === 'retrying' || mapAssetsStatus.status === 'failed'
      ? `第 ${mapAssetsStatus.attempt} 次尝试 / 最多 ${mapAssetsStatus.maxRetries + 1} 次`
      : '暂无重试'

    return (
      <div className={Style.loadingPage}>
        <div className={Style.loadingPanel}>
          <div className={Style.loadingTitle}>地图资源加载中</div>
          <div className={Style.loadingText}>
            已加载 {mapAssetsProgress.loaded} 张，还剩 {remainingMapAssets} 张
          </div>
          <div className={Style.loadingDetails}>
            <div className={Style.loadingDetailItem}>
              <span>当前资源</span>
              <strong>{mapAssetsStatus.currentAsset || '准备下载地图图片'}</strong>
            </div>
            <div className={Style.loadingDetailItem}>
              <span>网络状态</span>
              <strong>{getNetworkText(mapAssetsStatus.status)}</strong>
            </div>
            <div className={Style.loadingDetailItem}>
              <span>估算网速</span>
              <strong>{mapAssetsStatus.speedText}</strong>
            </div>
            <div className={Style.loadingDetailItem}>
              <span>重试状态</span>
              <strong>{retryText}</strong>
            </div>
          </div>
          <div className={Style.loadingTrack}>
            <div
              className={Style.loadingBar}
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
          {mapAssetsStatus.status === 'retrying' && (
            <div className={Style.loadingWarning}>
              {mapAssetsStatus.currentAsset} 下载失败，正在自动重试。
            </div>
          )}
          {mapAssetsError && (
            <>
              <div className={Style.loadingError}>
                <div>{mapAssetsError}</div>
                {mapAssetsStatus.currentAsset && <div>卡住位置：{mapAssetsStatus.currentAsset}</div>}
                {mapAssetsStatus.error && <div>最后错误：{mapAssetsStatus.error}</div>}
              </div>
              <button className={Style.retryButton} onClick={loadMapAssets}>
                重新加载
              </button>
            </>
          )}
        </div>
      </div>
    )
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
