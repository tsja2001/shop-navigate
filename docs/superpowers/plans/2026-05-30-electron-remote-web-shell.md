# Electron Remote Web With Local Offline Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前桌面应用改造成“远程 Web 优先 + Electron 包内本地 Web 离线兜底”的结构。联网时展示线上页面 `https://hbhgjjj.com/d8N4kP7sVq2R/`；远程页面无法加载时，自动回退到 Electron 包内置的本地 `dist/index.html`。

**Architecture:** Vite/React Web 端继续独立构建并部署到 Nginx 随机路径；Electron 生产环境先 `loadURL()` 加载远程地址，监听加载失败后 `loadFile()` 加载本地 `dist/index.html`。Web 页面不需要任何 Electron 原生能力，所以 preload 清空，Electron 只作为受限浏览器壳。

**Tech Stack:** Electron, Electron Forge, Vite, React, HashRouter, Nginx, HTTPS.

---

## Confirmed Decisions

- 线上 Web 地址已经部署并可访问：

```text
https://hbhgjjj.com/d8N4kP7sVq2R/
```

- Vite 已配置子路径：

```js
base: '/d8N4kP7sVq2R/',
```

- 路由使用 `HashRouter`，适合部署在 Nginx 子路径下。
- 需要离线能力：远程 URL 打不开时，不展示单独错误页，而是回退到 Electron 包内置的本地前端页面。
- Web 页面不需要 Electron 原生能力，不访问本地文件、系统、设备、串口、打印等能力。
- 第一阶段不做“运行时自动下载并缓存最新远程版本”。本地兜底版本来自打 Electron 包时包含的 `dist`。

---

## Current State

当前 `electron/main.js` 的生产逻辑是直接加载本地 `dist`：

```js
if (isDev) {
  mainWindow.loadURL('http://localhost:5173');
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}
```

这会导致每次业务前端更新都需要重新打包桌面应用。

目标改造后：

```text
开发环境：Electron -> http://localhost:5173
生产环境：Electron -> https://hbhgjjj.com/d8N4kP7sVq2R/
远程失败：Electron -> 内置 dist/index.html
```

---

## Release Model After Refactor

### Web Release

适用于日常业务更新：地图、商铺数据、楼层配置、样式、页面交互。

1. 修改 `src/` 或相关资源。
2. 执行：

```bash
npm run build
```

3. 将 `dist/` 内容上传到服务器目录。
4. 浏览器验证：

```text
https://hbhgjjj.com/d8N4kP7sVq2R/
```

5. 已安装的 Electron 应用联网时会加载这个新版本。

### Electron Release

只在以下情况需要重新打包并重新安装桌面应用：

- 修改 Electron 主进程逻辑
- 修改远程 URL
- 修改离线兜底策略
- 修改 preload / IPC
- 修改窗口行为、图标、安装器配置
- 希望更新“离线兜底版本”里的本地 `dist`

注意：如果只发布 Web 端，离线兜底版本不会自动变新。要更新离线兜底版本，需要重新 `npm run build` 后重新打 Electron 包。

---

## File Structure Plan

### Modify: `vite.config.js`

职责：

- 保持线上子路径资源前缀。
- 当前应为：

```js
base: '/d8N4kP7sVq2R/',
```

### Modify: `electron/main.js`

职责：

- 开发环境加载本地 Vite。
- 生产环境优先加载远程 HTTPS 页面。
- 远程主页面加载失败时回退到内置 `dist/index.html`。
- 限制生产环境页面跳转到未知域名。
- 阻止未知新窗口在 Electron 内打开。

### Modify: `electron/preload.js`

职责：

- 清空 preload。
- 不暴露 `window.api`。
- 避免远程 Web 页面获得不必要的 Electron 能力。

### Create: `electron/config.js`

职责：

- 统一维护远程 URL。
- 统一维护允许加载的 origin。
- 统一维护本地兜底页面路径。

### Modify: `package.json`

职责：

- 保留 `dist/**/*`，因为离线兜底需要本地前端产物。
- 保留 `electron/**/*`。
- 增加生产模式本地启动脚本，方便验证远程优先和离线回退。

### Modify: `README.md`

职责：

- 记录 Web 发布流程。
- 记录 Electron 发布流程。
- 记录 Nginx 配置。
- 记录离线兜底的版本规则。

---

## Task 1: Verify Web Deployment Configuration

**Files:**

- Modify: `vite.config.js`
- Server config: Nginx

- [x] **Step 1: 配置 Vite 子路径**

`vite.config.js` 应包含：

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/d8N4kP7sVq2R/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
```

- [x] **Step 2: 构建 Web 产物**

Run:

```bash
npm run build
```

Expected:

```text
dist/index.html 中的 JS/CSS/图片资源路径以 /d8N4kP7sVq2R/ 开头。
```

- [x] **Step 3: 部署到 Nginx 子路径**

当前域名已有其他服务占用 `/` 和 `/f37tD9MuUaxE/`，本项目使用新路径 `/d8N4kP7sVq2R/`。

推荐 Nginx location：

```nginx
location /d8N4kP7sVq2R/ {
    alias /var/www/navigation/;
    index index.html;
    try_files $uri $uri/ /d8N4kP7sVq2R/index.html;
}
```

服务器目录结构应为：

```text
/var/www/navigation/index.html
/var/www/navigation/assets/
/var/www/navigation/vite.svg
```

- [x] **Step 4: 验证线上访问**

Open:

```text
https://hbhgjjj.com/d8N4kP7sVq2R/
```

Expected:

```text
页面可访问，静态资源正常加载。
```

---

## Task 2: Add Electron Runtime Config

**Files:**

- Create: `electron/config.js`

- [x] **Step 1: 创建 Electron 配置文件**

Create `electron/config.js`:

```js
const path = require('path');

const REMOTE_WEB_URL = 'https://hbhgjjj.com/d8N4kP7sVq2R/';
const LOCAL_FALLBACK_HTML = path.join(__dirname, '../dist/index.html');

const ALLOWED_ORIGINS = [
  new URL(REMOTE_WEB_URL).origin,
];

module.exports = {
  REMOTE_WEB_URL,
  LOCAL_FALLBACK_HTML,
  ALLOWED_ORIGINS,
};
```

- [x] **Step 2: 验证配置文件可加载**

Run:

```bash
node -e "console.log(require('./electron/config'))"
```

Expected:

```text
输出 REMOTE_WEB_URL、LOCAL_FALLBACK_HTML、ALLOWED_ORIGINS。
REMOTE_WEB_URL 为 https://hbhgjjj.com/d8N4kP7sVq2R/。
```

---

## Task 3: Refactor Electron Main Process

**Files:**

- Modify: `electron/main.js`

- [x] **Step 1: 替换 Electron import**

Replace:

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');
```

With:

```js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { REMOTE_WEB_URL, LOCAL_FALLBACK_HTML, ALLOWED_ORIGINS } = require('./config');
```

- [x] **Step 2: 添加 URL 白名单判断**

Add below `isDev`:

```js
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
```

- [x] **Step 3: 修正 BrowserWindow 配置**

Current code has `frame: false` inside `webPreferences`; it should be a top-level `BrowserWindow` option.

Use:

```js
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  icon: path.join(__dirname, 'logo.ico'),
  frame: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
  },
});
```

- [x] **Step 4: 增加本地兜底加载函数**

Add inside `createWindow()` after `mainWindow.setMenu(null)`:

```js
let fallbackLoaded = false;

function loadLocalFallback() {
  if (fallbackLoaded) {
    return;
  }

  fallbackLoaded = true;
  mainWindow.loadFile(LOCAL_FALLBACK_HTML);
}
```

- [x] **Step 5: 增加加载失败回退**

Add inside `createWindow()` before first page load:

```js
mainWindow.webContents.on('did-fail-load', (_event, _errorCode, _errorDescription, validatedUrl, isMainFrame) => {
  if (!isMainFrame || isDev) {
    return;
  }

  if (validatedUrl.startsWith('file://')) {
    return;
  }

  loadLocalFallback();
});
```

- [x] **Step 6: 增加导航限制**

Add inside `createWindow()`:

```js
mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
  if (isDev || isAllowedUrl(targetUrl)) {
    return;
  }

  event.preventDefault();
  shell.openExternal(targetUrl);
});
```

- [x] **Step 7: 增加新窗口限制**

Add inside `createWindow()`:

```js
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  if (isDev || isAllowedUrl(url)) {
    return { action: 'allow' };
  }

  shell.openExternal(url);
  return { action: 'deny' };
});
```

- [x] **Step 8: 改造首屏加载逻辑**

Replace:

```js
if (isDev) {
  mainWindow.loadURL('http://localhost:5173');
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}
```

With:

```js
if (isDev) {
  mainWindow.loadURL('http://localhost:5173');
} else {
  mainWindow.loadURL(REMOTE_WEB_URL).catch(() => {
    loadLocalFallback();
  });
}
```

- [x] **Step 9: 目标 `electron/main.js` 完整形态**

After the refactor, `electron/main.js` should be equivalent to:

```js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { REMOTE_WEB_URL, LOCAL_FALLBACK_HTML, ALLOWED_ORIGINS } = require('./config');

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

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'logo.ico'),
    frame: false,
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

---

## Task 4: Remove Preload API Surface

**Files:**

- Modify: `electron/preload.js`

- [x] **Step 1: 检查业务代码是否使用 Electron API**

Run:

```bash
rg -n "window\\.api|ipcRenderer|toMain|fromMain|electron" src electron
```

Expected:

```text
src/ 中没有 window.api、ipcRenderer 等业务依赖。
electron/preload.js 里会命中旧代码，这是预期。
```

- [x] **Step 2: 清空 preload**

Replace `electron/preload.js` with:

```js
// The remote and local web pages do not need privileged Electron APIs.
```

Reason:

```text
远程 Web 页面不需要访问文件、系统或设备，因此不应暴露 IPC。
```

---

## Task 5: Keep Local Dist In Electron Package

**Files:**

- Modify: `package.json`

- [x] **Step 1: 保留打包文件**

`package.json` must keep:

```json
"files": [
  "dist/**/*",
  "electron/**/*"
]
```

Reason:

```text
dist/**/* 是离线兜底页面，不能移除。
```

- [x] **Step 2: 增加生产模式启动脚本**

Modify `scripts`:

```json
"scripts": {
  "start": "vite",
  "dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron-forge start\"",
  "build": "vite build",
  "start:electron": "electron-forge start",
  "package": "electron-forge package",
  "make": "electron-forge make"
}
```

Usage:

```bash
npm run start:electron
```

Expected:

```text
不启动 Vite，Electron 按生产逻辑优先加载远程 URL。
```

---

## Task 6: Verify Local Development Mode

**Files:**

- No code change required

- [ ] **Step 1: 启动开发模式**

Run:

```bash
npm run dev
```

Expected:

```text
Vite 启动在 http://localhost:5173。
Electron 加载本地开发页面。
```

- [ ] **Step 2: 验证开发模式不触发远程加载**

Temporarily disconnect network or block `hbhgjjj.com`.

Expected:

```text
npm run dev 仍然正常显示本地开发页面。
```

---

## Task 7: Verify Remote-First Production Mode

**Files:**

- No code change required

- [x] **Step 1: 确保本地 dist 存在**

Run:

```bash
npm run build
```

Expected:

```text
dist/index.html 存在。
```

- [ ] **Step 2: 启动生产模式 Electron**

Run:

```bash
npm run start:electron
```

Expected:

```text
Electron 加载 https://hbhgjjj.com/d8N4kP7sVq2R/。
```

- [ ] **Step 3: 验证远程版本优先**

在远程 Web 页面加一个临时可见标识，例如页面标题或角落版本号：

```text
remote-web-test
```

重新部署 Web 后再打开 Electron。

Expected:

```text
Electron 显示远程新标识，不需要重新打包桌面应用。
```

---

## Task 8: Verify Offline Fallback

**Files:**

- Temporary Modify: `electron/config.js`

- [x] **Step 1: 准备本地兜底版本**

Run:

```bash
npm run build
```

Expected:

```text
本地 dist/index.html 和 assets 已生成。
```

- [ ] **Step 2: 临时改成不可访问远程地址**

Temporarily change `electron/config.js`:

```js
const REMOTE_WEB_URL = 'https://invalid.example.invalid/d8N4kP7sVq2R/';
```

- [ ] **Step 3: 启动 Electron 生产模式**

Run:

```bash
npm run start:electron
```

Expected:

```text
Electron 不白屏，自动加载本地 dist/index.html。
页面内容与打包时的本地版本一致。
```

- [ ] **Step 4: 恢复真实远程地址**

Restore:

```js
const REMOTE_WEB_URL = 'https://hbhgjjj.com/d8N4kP7sVq2R/';
```

- [ ] **Step 5: 再次验证远程优先**

Run:

```bash
npm run start:electron
```

Expected:

```text
联网情况下重新显示远程页面。
```

---

## Task 9: Verify Navigation Security

**Files:**

- No code change required

- [ ] **Step 1: 验证允许同域页面**

In Electron DevTools console:

```js
location.href = 'https://hbhgjjj.com/d8N4kP7sVq2R/#/';
```

Expected:

```text
主窗口允许跳转。
```

- [ ] **Step 2: 验证阻止第三方域名占据主窗口**

In Electron DevTools console:

```js
location.href = 'https://example.com';
```

Expected:

```text
Electron 主窗口不被第三方页面替换；第三方链接交给系统浏览器打开。
```

- [ ] **Step 3: 验证本地 file 页面可用**

在远程 URL 不可达时启动 Electron。

Expected:

```text
本地 file:// dist/index.html 能正常加载，不被白名单逻辑拦截。
```

---

## Task 10: Build Desktop Installer With Offline Dist

**Files:**

- No code change required

- [ ] **Step 1: 构建当前本地兜底版本**

Run:

```bash
npm run build
```

Expected:

```text
dist/ 是将要被打进 Electron 包的离线兜底版本。
```

- [ ] **Step 2: 打包 Electron**

Run:

```bash
npm run make
```

Expected:

```text
生成桌面安装包。
```

- [ ] **Step 3: 安装并验证联网模式**

在目标电脑安装后打开。

Expected:

```text
联网时加载 https://hbhgjjj.com/d8N4kP7sVq2R/。
```

- [ ] **Step 4: 安装并验证离线模式**

断开目标电脑网络后打开。

Expected:

```text
显示 Electron 包内置的 dist 页面。
```

---

## Task 11: Update README With Operating Procedures

**Files:**

- Modify: `README.md`

- [x] **Step 1: 记录 Nginx 部署路径**

Add:

````md
## 线上 Web 地址

当前线上地址：

https://hbhgjjj.com/d8N4kP7sVq2R/

Vite 必须配置：

```js
base: '/d8N4kP7sVq2R/',
```
````

- [x] **Step 2: 记录 Web 发布流程**

Add:

```md
## Web 发布

1. 修改 `src/` 或前端资源。
2. 执行 `npm run build`。
3. 上传 `dist/` 内容到服务器 `/var/www/navigation/`。
4. 确认服务器上存在 `/var/www/navigation/index.html` 和 `/var/www/navigation/assets/`。
5. 访问 `https://hbhgjjj.com/d8N4kP7sVq2R/` 验证。
6. Electron 联网时会自动加载最新远程 Web。
```

- [x] **Step 3: 记录 Electron 发布流程**

Add:

```md
## Electron 发布

只有修改 Electron 壳、远程地址、安全策略、preload、安装器，或需要更新离线兜底版本时，才需要重新打包桌面应用。

1. 执行 `npm run build`，生成要内置进安装包的本地兜底 `dist`。
2. 执行 `npm run start:electron` 验证远程优先。
3. 临时改成不可访问 URL，验证本地 `dist` 兜底。
4. 恢复真实 URL。
5. 执行 `npm run make` 生成安装包。
6. 在目标电脑验证联网和断网两种情况。
```

- [x] **Step 4: 记录离线版本规则**

Add:

```md
## 离线兜底规则

Electron 启动后优先加载远程 Web：

https://hbhgjjj.com/d8N4kP7sVq2R/

如果远程页面加载失败，会回退到安装包内置的 `dist/index.html`。

注意：Web 端单独发布不会更新本地离线兜底版本。要更新离线兜底版本，必须重新 `npm run build` 并重新打包 Electron。
```

- [x] **Step 5: 记录 Nginx location**

Add:

````md
## Nginx 配置

```nginx
location /d8N4kP7sVq2R/ {
    alias /var/www/navigation/;
    index index.html;
    try_files $uri $uri/ /d8N4kP7sVq2R/index.html;
}
```
````

---

## Acceptance Criteria

- [x] Vite `base` 已配置为 `/d8N4kP7sVq2R/`
- [x] Web 已部署到 `https://hbhgjjj.com/d8N4kP7sVq2R/`
- [ ] 生产环境 Electron 优先加载远程 Web
- [ ] 远程 Web 不可访问时，Electron 自动加载内置 `dist/index.html`
- [ ] 开发环境 `npm run dev` 仍加载本地 Vite
- [x] `electron/preload.js` 不再暴露 IPC 或 `window.api`
- [x] `package.json` 继续打包 `dist/**/*`
- [ ] Electron 主窗口不会被第三方域名替换
- [ ] 目标电脑联网时显示远程版本
- [ ] 目标电脑断网时显示安装包内置本地版本
- [ ] README 记录 Web 发布、Electron 发布、Nginx 配置和离线规则

---

## Risks And Decisions

### Risk: Web 更新不会自动更新离线兜底版本

远程 Web 可以随时发布，但 Electron 包内的 `dist` 是打包时固定的。

Decision:

```text
接受这个差异。离线兜底只保证可用，不保证永远是最新版本。需要更新离线版本时重新打包 Electron。
```

### Risk: 远程页面拥有 Electron preload 能力

远程页面如果能访问 IPC，会扩大安全风险。

Decision:

```text
清空 preload，不暴露 window.api。后续只有明确原生能力需求时，才按白名单重新开放。
```

### Risk: 远程路径被改动后 Electron 无法加载

Electron 中的远程 URL 写在 `electron/config.js`，如果 Nginx 路径变化，旧桌面壳不会自动知道新路径。

Decision:

```text
固定使用 https://hbhgjjj.com/d8N4kP7sVq2R/。如果未来更换路径，需要重新打包 Electron 壳。
```

### Risk: Nginx 缓存导致 Web 更新不及时

如果 `index.html` 被强缓存，Electron 可能仍看到旧入口。

Decision:

```text
服务器应避免强缓存 index.html；assets 可以长期缓存，因为 Vite 会生成 hash 文件名。
```

---

## Recommended Execution Order

1. 创建 `electron/config.js`。
2. 改造 `electron/main.js`，实现远程优先、本地 `dist` 回退。
3. 清空 `electron/preload.js`。
4. 确认 `package.json` 继续包含 `dist/**/*`。
5. 增加 `start:electron` 脚本。
6. 执行 `npm run build`。
7. 执行 `npm run dev` 验证开发模式。
8. 执行 `npm run start:electron` 验证远程优先。
9. 临时改坏远程 URL，验证本地 `dist` 回退。
10. 恢复真实远程 URL。
11. 执行 `npm run make` 打包。
12. 在目标电脑验证联网和断网两种启动场景。
