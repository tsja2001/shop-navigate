# 编辑数据（图形化维护）

商户、品类、**以及右侧版面布局**都存在**后端数据库**里，通过 `?type=dev2` 下的「数据管理」图形界面维护，不再需要改代码、重新打包。

## 数据从哪来

- 数据源：后端接口 `GET /api/map/data`（线上 `https://hbhgjjj.com/api/map/data`，反代到后端 7999 端口，数据存 MySQL 的 `map_category` / `map_shop` 两张表）。
- 每个品类带 `layout_col`（在第几列）、`sort_order`（列内顺序）、`width_cols`（卡片宽度 1/2 列），右侧品类区完全由这些字段驱动渲染（`src/map/shopList/ShopList.jsx`），不再硬编码各楼层布局。
- 页面启动时拉取最新数据并缓存到 `localStorage`；断网时依次回退到「缓存 → 代码里内置的 `src/config/f*.config.js` 快照」，所以离线仍可正常展示。
- 接口与数据库说明见后端项目 `hbh_endside/doc/map-api.md`。

## 进入编辑模式

1. 启动：`npm run dev`（或 `npm run start` 只跑 web）。
2. 浏览器访问带 `?type=dev2` 的地址：`http://localhost:5173/d8N4kP7sVq2R/#/home/floor?type=dev2`（参数要在**加载时**就带上）。
3. 左下角出现「📋 数据管理」按钮，点开是一个**可拖拽的浮窗**（按住蓝色标题栏拖动，随时挪开看地图）。
4. 首次进入需**登录**（用户名 `tsja`，密码见后端 `.env` 的 `MAP_ADMIN_PASSWORD`）。登录后 token 存在浏览器，30 天内免登录；右上角可「退出登录」。
   > 本地 dev 通过 `vite.config.js` 的 proxy 把 `/api` 转发到线上后端，所以**编辑器直接维护线上数据**，改完即时生效。
   > 读接口（大屏展示）公开无需登录；只有增删改写接口需要登录。旧的 `?type=dev`（手动点选复制坐标）仍保留，不受影响。

登录后面板顶部有两个开关：**显示所有位置**（在地图上把所有商户的位置点标出来）、**显示名称**（在地图上叠加商户名），方便核对位置。

## 「商户」标签页

- **新增 / 改名 / 改铺位号 / 换品类**：每个商户行的铅笔按钮，品类用下拉切换。
- **撤场（删除商户）**：商户行红色删除按钮。
- **新增商户**：每个品类底部「新增商户」。
- **品类增删改**：右上「新增品类」（默认落在最右新列，立即可见）；品类标题右侧铅笔/垃圾桶改名改色、删除（删品类连带删其下商户）。
- **设置 / 修改位置**：点商户行的「定位」按钮（准星）选中 → 在地图上点新位置（黄点实时更新，可点多个 = 多铺位）→「保存位置」写库，「清除」可重设。

## 「版面布局」标签页（控制右侧每列放什么）

每层屏幕右侧的品类是**分列展示**的，每列可叠放多个品类卡片（高度随商户数自然变化）。在这里：

- **← →**：把品类移到相邻列（往最右移会新建一列）。
- **↑ ↓**：调整同一列内品类的上下顺序。
- **1列 / 2列**：切换卡片宽度（商户多的品类用 2 列更紧凑）。

新增的品类会自动出现在最右新列，再用这里把它挪到合适的位置即可——**不会再出现“加了品类却不显示”的问题**。

> 楼层底部那段简介文案仍是前端常量（`src/map/shopList/floorMeta.js`），改文案时编辑它。

# 当前项目结构

这个项目现在分两部分：

1. Web 页面：日常维护地图、商户、楼层、样式，代码主要在 `src/`。
2. Electron 桌面壳：只负责打开页面。联网时打开线上 Web，打不开时使用安装包里自带的本地页面。

线上 Web 地址是：

```text
https://hbhgjjj.com/d8N4kP7sVq2R/
```

Electron 里的远程地址配置在：

```text
electron/config.js
```

## 日常发布 Web

如果只是改商户、地图、楼层配置、样式、页面交互，一般只需要发布 Web，不需要重新打桌面安装包。

1. 修改 `src/` 或前端资源。
2. 执行 `npm run build`。
3. 把 `dist/` 里的内容上传到服务器 `/var/www/navigation/`。
4. 访问 `https://hbhgjjj.com/d8N4kP7sVq2R/` 验证。

已安装的 Electron 应用联网时，会自动加载这个线上版本。

## Kiosk 模式（全屏锁定）

Electron 包在 Windows 上以 **Kiosk 模式**运行：

- 启动后自动全屏，隐藏任务栏和窗口边框。
- Alt+F4、点击关闭按钮等操作均被拦截，无法直接退出。
- 屏幕右上角有一个小电源图标，点击后弹出数字键盘，输入正确密码才能退出应用。

**退出密码**在 `electron/main.js` 的 `EXIT_PASSWORD` 变量中修改。当前密码 **129988**

> 注意：退出按钮和密码弹窗由 `electron/preload.js` 注入，属于 Electron 壳的一部分，**与 Web 内容无关**，不需要更新 Web 端。修改密码或调整退出逻辑后，需要重新打 Electron 包。

### 关闭边缘滑动手势（右滑呼出通知中心、左滑呼出任务视图）
这个需要改注册表，无法从普通设置界面关闭。

以管理员身份运行 PowerShell，执行：

# 禁用所有边缘滑动手势
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\EdgeUI" /v AllowEdgeSwipe /t REG_DWORD /d 0 /f

恢复的话：
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\EdgeUI" /v AllowEdgeSwipe /f


---

## 重新打 Electron 包

只有这些情况才需要重新打 Electron 包：

1. 修改 `electron/` 里的桌面壳逻辑（包括修改退出密码）。
2. 修改线上 Web 地址。
3. 修改离线兜底逻辑。
4. 想更新安装包里自带的离线版本。

打包流程：

1. 执行 `npm run build`，生成要放进安装包的本地 `dist`。
2. 执行 `npm run make`。
3. 使用 `out/` 里生成的安装包或 zip。

## 离线兜底

Electron 启动后会先打开线上 Web：

```text
https://hbhgjjj.com/d8N4kP7sVq2R/
```

如果线上页面加载失败，会自动回退到安装包内置的 `dist/index.html`。

Web 页面打开后会先预加载楼层地图图片。开屏加载页会显示当前下载的资源、已完成数量、估算网速和重试状态；单个资源加载失败时会自动重试 5 次。如果 5 次后仍失败，页面会显示网络异常、卡住的资源文件和最后错误，并提供“重新加载”按钮。

注意：单独发布 Web 不会更新离线兜底版本。要更新离线兜底版本，必须先 `npm run build`，再重新 `npm run make`。

## Nginx 路径

当前 Vite 的 base 是：

```js
base: '/d8N4kP7sVq2R/',
```

服务器对应路径：

```nginx
location /d8N4kP7sVq2R/ {
    alias /var/www/navigation/;
    index index.html;
    try_files $uri $uri/ /d8N4kP7sVq2R/index.html;
}
```
