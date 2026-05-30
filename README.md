# 编辑数据

1. 启动：npm run dev
2. 浏览器访问：http://localhost:5173
3. **加上?type=dev是开发模式**，也就是输入http://localhost:5173/#/home/floor?type=dev，然后再刷新，就是开发模式
4. 我一般习惯点击右上角的“在地图上展示名称“按钮，就可以在地图上显示数据了。方便和最新的地图数据对比，看商户变化。
5. 在web端无论怎么点击操作，都不会改变数据，数据只存在本地代码中。
6. 核心与地图商户相关的配置文件为：src/config/f1.config.js....（日常只需要编辑这个）
7. 编辑分组分类：src/map/shopList/ShopList1F.jsx ...(只有涉及到处理分组时，才需要编辑)

## 修改商户位置

1. 先启动进入dev模式
2. 点击商户名称，在地图上可以看到商户当前的位置
3. 点击右上角，清楚position
4. 用鼠标在地图上上点击商户的新位置
5. 这时候左下角商户名称旁边会有一个新的坐标[x,y]，点击复制到config文件中

## 新建商户

1. 先启动进入dev模式
2. 在config文件中对应的类别中新增一个商户，比如
   ```
    {
       num: 'B8320(可以不填，只是方便维护)',
       name: '沃伦门窗',
       isClick: false,
       position: [],
     },
   ```
3. 进入网页，点击新建的这个商户的名称，在地图上再点击他要在的位置
4. 这时候左下角商户名称旁边会有一个新的坐标[x,y]，点击复制到config文件中
   

# 打包

1. 启动：npm run build

## 线上 Web 地址

当前线上地址：

https://hbhgjjj.com/d8N4kP7sVq2R/

Vite 必须配置：

```js
base: '/d8N4kP7sVq2R/',
```

## Web 发布

1. 修改 `src/` 或前端资源。
2. 执行 `npm run build`。
3. 上传 `dist/` 内容到服务器 `/var/www/navigation/`。
4. 确认服务器上存在 `/var/www/navigation/index.html` 和 `/var/www/navigation/assets/`。
5. 访问 `https://hbhgjjj.com/d8N4kP7sVq2R/` 验证。
6. Electron 联网时会自动加载最新远程 Web。

## Electron 发布

只有修改 Electron 壳、远程地址、安全策略、preload、安装器，或需要更新离线兜底版本时，才需要重新打包桌面应用。

1. 执行 `npm run build`，生成要内置进安装包的本地兜底 `dist`。
2. 执行 `npm run start:electron` 验证远程优先。
3. 临时改成不可访问 URL，验证本地 `dist` 兜底。
4. 恢复真实 URL。
5. 执行 `npm run make` 生成安装包。
6. 在目标电脑验证联网和断网两种情况。

## 离线兜底规则

Electron 启动后优先加载远程 Web：

https://hbhgjjj.com/d8N4kP7sVq2R/

如果远程页面加载失败，会回退到安装包内置的 `dist/index.html`。

注意：Web 端单独发布不会更新本地离线兜底版本。要更新离线兜底版本，必须重新 `npm run build` 并重新打包 Electron。

## Nginx 配置

```nginx
location /d8N4kP7sVq2R/ {
    alias /var/www/navigation/;
    index index.html;
    try_files $uri $uri/ /d8N4kP7sVq2R/index.html;
}
```

