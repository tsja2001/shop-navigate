const { app, BrowserWindow, protocol, shell } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');
const {
  REMOTE_WEB_URL,
  REMOTE_WEB_PATHNAME,
  LOCAL_FALLBACK_DIR,
  LOCAL_FALLBACK_HTML,
  ALLOWED_ORIGINS,
} = require('./config');

const isDev = process.env.NODE_ENV === 'development';

function isAllowedUrl(targetUrl) {
  try {
    const url = new URL(targetUrl);

    if (url.protocol === 'file:') {
      return true;
    }

    return ALLOWED_ORIGINS.includes(url.origin);
  } catch {
    return false;
  }
}

function registerLocalFallbackAssetProtocol() {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname.startsWith(REMOTE_WEB_PATHNAME)) {
      const relativePath = decodeURIComponent(requestUrl.pathname.slice(REMOTE_WEB_PATHNAME.length));
      callback({ path: path.join(LOCAL_FALLBACK_DIR, relativePath) });
      return;
    }

    callback({ path: fileURLToPath(request.url) });
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.setMenu(null);

  let fallbackLoaded = false;

  function loadLocalFallback() {
    if (fallbackLoaded) {
      return;
    }

    fallbackLoaded = true;
    mainWindow.loadFile(LOCAL_FALLBACK_HTML);
  }

  mainWindow.webContents.on('did-fail-load', (_event, _errorCode, _errorDescription, validatedUrl, isMainFrame) => {
    if (!isMainFrame || isDev) {
      return;
    }

    if (validatedUrl.startsWith('file://')) {
      return;
    }

    loadLocalFallback();
  });

  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (isDev || isAllowedUrl(targetUrl)) {
      return;
    }

    event.preventDefault();
    shell.openExternal(targetUrl);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isDev || isAllowedUrl(url)) {
      return { action: 'allow' };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadURL(REMOTE_WEB_URL).catch(() => {
      loadLocalFallback();
    });
  }
}

app.whenReady().then(() => {
  registerLocalFallbackAssetProtocol();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
