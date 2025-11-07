# 快速开始指南

## 前置要求

- Node.js 16+ 
- npm 或 yarn
- mkcert (用于生成 SSL 证书)

## 5 分钟快速启动

### 步骤 1: 安装 mkcert 并生成证书

**Windows (使用 Chocolatey)**:
```powershell
choco install mkcert
mkcert -install
cd local-server
mkcert localhost
```

**macOS**:
```bash
brew install mkcert
mkcert -install
cd local-server
mkcert localhost
```

**Linux**:
```bash
# 安装 mkcert (见 README.md 详细说明)
mkcert -install
cd local-server
mkcert localhost
```

### 步骤 2: 启动本地服务器

```bash
cd local-server
npm install
npm run start:server
```

你应该看到:
```
✅ HTTPS server running on https://localhost:9527
📁 Managed files directory: ...
🔒 CORS enabled for: ...
```

### 步骤 3: 启动 React 应用 (开发环境)

打开新的终端窗口:

```bash
cd web-app
npm install
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 步骤 4: 测试功能

1. 打开浏览器访问 `http://localhost:3000`
2. 检查顶部连接状态（应该显示 "服务已连接"）
3. 点击 "新建文件" 创建测试文件
4. 编辑文件内容并保存
5. 测试删除功能

## 部署到公网

### 部署 React 应用

1. 按照 `DEPLOYMENT.md` 中的说明部署到 Vercel 或 Netlify
2. 获取部署的 HTTPS 链接

### 更新 CORS 配置

在 `local-server/server.js` 中更新 `allowedOrigins`:

```javascript
const allowedOrigins = [
  'https://your-actual-deployment-url.vercel.app', // 替换为实际 URL
]
```

重启本地服务器。

### 测试公网部署

1. 访问部署的 HTTPS 链接
2. 确保本地服务器正在运行
3. 检查连接状态
4. 测试所有 CRUD 功能

## 常见问题

**Q: 浏览器显示证书错误**
A: 确保已运行 `mkcert -install` 并重启浏览器

**Q: CORS 错误**
A: 检查 `allowedOrigins` 是否包含实际部署域名

**Q: 无法连接到本地服务**
A: 确认本地服务器正在运行在 `https://localhost:9527`

