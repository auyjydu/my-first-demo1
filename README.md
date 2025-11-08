# 文本编辑器 - React + 本地文件服务

一个部署在公网 HTTPS 上的 React 文本编辑器应用，能够安全地与运行在用户本地的 HTTPS 服务器进行通信，实现对本地 `.txt` 文件的 CRUD 操作。

## 🌐 公网部署链接

**部署地址**: https://my-first-demo-sand.vercel.app/

## 📋 项目结构

```
demo1/
├── web-app/              # React 前端应用
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── store.ts     # Zustand 状态管理
│   │   ├── api.ts       # API 调用封装
│   │   └── App.tsx      # 主应用组件
│   └── package.json
├── local-server/         # Node.js 本地 HTTPS 服务器
│   ├── server.js        # Express 服务器
│   └── package.json
└── README.md
```

## 🚀 快速开始

### 1. 启动本地服务器

#### 1.1 安装依赖

```bash
cd local-server
npm install
```

#### 1.2 生成并信任 SSL 证书（关键步骤）

这是项目的核心挑战之一。浏览器默认不信任自签名证书，必须安装并信任 mkcert 生成的本地 CA 根证书。

##### Windows 系统：

1. **安装 mkcert**:
   ```powershell
   # 使用 Chocolatey
   choco install mkcert
   
   # 或使用 Scoop
   scoop bucket add extras
   scoop install mkcert
   
   # 或从 GitHub 下载: https://github.com/FiloSottile/mkcert/releases
   ```

2. **安装本地 CA 根证书**:
   ```powershell
   mkcert -install
   ```
   这会将 mkcert 的根证书安装到 Windows 证书存储中。

3. **生成 localhost 证书**:
   ```powershell
   cd local-server
   mkcert localhost
   ```
   这会生成两个文件：
   - `localhost.pem` (证书)
   - `localhost-key.pem` (私钥)

4. **验证证书安装**:
   - 打开 `certlm.msc` (证书管理器)
   - 导航到 `受信任的根证书颁发机构` > `证书`
   - 确认存在名为 `mkcert` 的证书

##### macOS 系统：

1. **安装 mkcert**:
   ```bash
   brew install mkcert
   ```

2. **安装本地 CA 根证书**:
   ```bash
   mkcert -install
   ```

3. **生成 localhost 证书**:
   ```bash
   cd local-server
   mkcert localhost
   ```

##### Linux 系统：

1. **安装 mkcert**:
   ```bash
   # Ubuntu/Debian
   sudo apt install libnss3-tools
   wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
   chmod +x mkcert-v1.4.4-linux-amd64
   sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
   ```

2. **安装本地 CA 根证书**:
   ```bash
   mkcert -install
   ```

3. **生成 localhost 证书**:
   ```bash
   cd local-server
   mkcert localhost
   ```

> ⚠️ **重要提示**: 
> - 证书文件 (`localhost.pem` 和 `localhost-key.pem`) 已添加到 `.gitignore`，不会提交到 Git
> - 每个开发者都需要在自己的机器上运行 `mkcert -install` 和 `mkcert localhost`
> - 如果不信任根证书，浏览器会显示 "NET::ERR_CERT_AUTHORITY_INVALID" 错误

#### 1.3 启动服务器

```bash
npm run start:server
```

服务器将在 `https://localhost:9527` 启动。

### 2. 启动 React 前端（开发环境）

```bash
cd web-app
npm install
npm run dev
```

前端将在 `http://localhost:3000` 启动（开发环境）。

## 🔧 技术方案说明

### 为什么使用 HTTPS？

1. **Mixed Content 安全策略**: 
   - 现代浏览器禁止 HTTPS 页面通过 HTTP 加载资源（包括 API 请求）
   - 由于 React 应用部署在 HTTPS 上，本地服务器也必须使用 HTTPS

2. **安全通信**: 
   - HTTPS 提供加密传输，保护文件内容在传输过程中的安全

### 核心挑战与解决方案

#### 1. Mixed Content 问题

**问题**: HTTPS 页面无法向 HTTP 服务器发送请求。

**解决方案**: 本地服务器使用 HTTPS (`https://localhost:9527`)，与公网 HTTPS 应用保持一致。

#### 2. CORS 跨域问题

**问题**: 浏览器同源策略阻止跨域请求。

**解决方案**: 
- 在 Express 服务器中配置 `cors` 中间件
- 精确设置 `Access-Control-Allow-Origin` 为实际部署域名
- 正确处理 OPTIONS 预检请求

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}
```

#### 3. SSL 证书信任问题

**问题**: 浏览器默认不信任自签名证书，会显示安全警告。

**解决方案**: 
- 使用 `mkcert` 生成本地开发证书
- 安装 mkcert 的根证书到系统信任存储
- 浏览器自动信任由该根证书签发的所有证书

**关键步骤**:
1. 运行 `mkcert -install` 安装根证书
2. 运行 `mkcert localhost` 生成证书
3. 浏览器自动信任（无需手动操作）

## 📡 API 端点

### `GET /health`
健康检查端点。

**响应**:
```json
{ "status": "ok" }
```

### `GET /files`
获取所有 `.txt` 文件列表。

**响应**:
```json
["file1.txt", "file2.txt"]
```

### `GET /files/:filename`
获取指定文件的内容。

**响应**: 文件内容（text/plain）

### `POST /files`
创建新文件。

**请求体**:
```json
{
  "filename": "newfile.txt",
  "content": "文件内容"
}
```

### `PUT /files/:filename`
更新文件内容。

**请求体**:
```json
{
  "content": "更新后的内容"
}
```

### `DELETE /files/:filename`
删除指定文件。

## 🛡️ 安全特性

1. **文件操作限制**: 所有文件操作限制在 `_managed_files/` 目录
2. **文件名验证**: 只允许 `.txt` 文件，防止目录遍历攻击
3. **CORS 精确控制**: 只允许来自指定域名的请求
4. **错误处理**: 完善的错误处理和用户提示

## 📝 功能特性

- ✅ 实时连接状态检测
- ✅ 文件列表显示
- ✅ 文件内容编辑
- ✅ 文件创建、更新、删除
- ✅ 加载状态和错误提示
- ✅ 响应式 UI 设计

## 🐛 故障排除

### 问题: 浏览器显示 "NET::ERR_CERT_AUTHORITY_INVALID"

**解决方案**: 
1. 确认已运行 `mkcert -install`
2. 确认证书文件存在于 `local-server/` 目录
3. 重启浏览器

### 问题: CORS 错误

**解决方案**: 
1. 检查 `local-server/server.js` 中的 `allowedOrigins`
2. 确认已添加实际部署域名
3. 重启本地服务器

### 问题: 无法连接到本地服务

**解决方案**: 
1. 确认本地服务器正在运行
2. 确认端口 9527 未被占用
3. 检查防火墙设置

## 📄 许可证

MIT

