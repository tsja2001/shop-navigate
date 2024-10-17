import React, { useEffect, useState } from 'react'

const FullScreenPrompt = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  // 检测是否满足 1920x1080 分辨率
  const checkFullScreen = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    setIsFullScreen(width === 1920 && height === 1080)
  }

  // 请求全屏显示
  const requestFullScreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen()
    }
  }

  // 初始化检查并监听窗口大小变化
  useEffect(() => {
    checkFullScreen()
    window.addEventListener('resize', checkFullScreen)

    return () => {
      window.removeEventListener('resize', checkFullScreen)
    }
  }, [])

  return (
    <>
      {!isFullScreen && (
        <div style={styles.overlay}>
          <div style={styles.messageBox}>
            <p>请点击进入全屏显示</p>
            <button onClick={requestFullScreen} style={styles.button}>
              进入全屏
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// 样式
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: '#fff',
  },
  messageBox: {
    textAlign: 'center',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default FullScreenPrompt
