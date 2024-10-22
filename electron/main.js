const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      frame: false,   // 禁用窗口框架
      contextIsolation: true  // 确保启用上下文隔离
    },
  });

  mainWindow.setMenu(null);

  

  if (isDev) {
    // 开发环境加载 Vite 的本地服务器
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // 生产环境加载打包后的 HTML 文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 打开开发者工具（无论是否在开发环境）
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
