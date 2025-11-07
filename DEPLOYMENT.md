# 部署指南

## 部署 React 应用到 Vercel

### 方法 1: 使用 Vercel CLI

1. 安装 Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel:
   ```bash
   vercel login
   ```

3. 在 `web-app` 目录下部署:
   ```bash
   cd web-app
   vercel
   ```

4. 按照提示完成部署，选择：
   - 项目名称
   - 是否覆盖现有项目
   - 构建命令: `npm run build`
   - 输出目录: `dist`

5. 部署完成后，Vercel 会提供一个 HTTPS 链接，例如: `https://your-app-name.vercel.app`

### 方法 2: 通过 GitHub 部署

1. 将代码推送到 GitHub 仓库

2. 访问 [Vercel](https://vercel.com) 并登录

3. 点击 "New Project"

4. 导入你的 GitHub 仓库

5. 配置项目:
   - Framework Preset: Vite
   - Root Directory: `web-app`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. 点击 "Deploy"

## 部署到 Netlify

### 方法 1: 使用 Netlify CLI

1. 安装 Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. 登录 Netlify:
   ```bash
   netlify login
   ```

3. 在 `web-app` 目录下部署:
   ```bash
   cd web-app
   netlify deploy --prod
   ```

### 方法 2: 通过 GitHub 部署

1. 将代码推送到 GitHub 仓库

2. 访问 [Netlify](https://www.netlify.com) 并登录

3. 点击 "Add new site" > "Import an existing project"

4. 选择你的 GitHub 仓库

5. 配置构建设置:
   - Base directory: `web-app`
   - Build command: `npm run build`
   - Publish directory: `web-app/dist`

6. 点击 "Deploy site"

## 重要：更新 CORS 配置

部署完成后，**必须**更新 `local-server/server.js` 中的 `allowedOrigins` 数组，添加你的实际部署域名：

```javascript
const allowedOrigins = [
  'https://your-actual-app-name.vercel.app',  // 替换为实际域名
  // 或
  'https://your-actual-app-name.netlify.app', // 替换为实际域名
]
```

然后重启本地服务器。

## 验证部署

1. 访问部署的 HTTPS 链接
2. 确保本地服务器正在运行 (`npm run start:server` 在 `local-server` 目录)
3. 确保已安装并信任 mkcert 证书（见 README.md）
4. 检查浏览器控制台是否有 CORS 错误
5. 如果出现 CORS 错误，确认已更新 `allowedOrigins` 并重启服务器

