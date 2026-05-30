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

## 重新打 Electron 包

只有这些情况才需要重新打 Electron 包：

1. 修改 `electron/` 里的桌面壳逻辑。
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
