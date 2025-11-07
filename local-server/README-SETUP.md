# 快速设置 SSL 证书

## 最简单的方法（推荐）

### 选项 1: 使用自动化脚本

1. **以管理员身份打开 PowerShell**
   - 右键点击 PowerShell
   - 选择"以管理员身份运行"

2. **运行设置脚本**:
   ```powershell
   cd C:\Users\29182\Desktop\demo1\local-server
   .\setup-cert.ps1
   ```

   脚本会自动：
   - 检查并安装 mkcert（如果已安装 Chocolatey）
   - 安装根证书
   - 生成 localhost 证书

### 选项 2: 手动安装（如果脚本失败）

#### 步骤 1: 安装 mkcert

**使用 Chocolatey（推荐）**:
```powershell
# 以管理员身份运行
choco install mkcert
```

**或使用 Scoop**:
```powershell
scoop bucket add extras
scoop install mkcert
```

**或手动下载**:
- 访问: https://github.com/FiloSottile/mkcert/releases
- 下载 `mkcert-v1.4.4-windows-amd64.exe`
- 重命名为 `mkcert.exe` 并放到 PATH 中

#### 步骤 2: 安装根证书

```powershell
# 以管理员身份运行
mkcert -install
```

#### 步骤 3: 生成证书

```powershell
cd C:\Users\29182\Desktop\demo1\local-server
mkcert localhost
```

这会生成两个文件：
- `localhost.pem`
- `localhost-key.pem`

#### 步骤 4: 启动服务器

```powershell
npm run start:server
```

## 验证

运行 `mkcert localhost` 后，确认以下文件存在：

```
local-server/
├── localhost.pem      ✅
├── localhost-key.pem  ✅
└── server.js
```

## 故障排除

**问题**: "mkcert: command not found"
- **解决**: 确保 mkcert 已安装并在 PATH 中，或使用完整路径

**问题**: "权限被拒绝"
- **解决**: 以管理员身份运行 PowerShell

**问题**: 证书生成成功但服务器仍报错
- **解决**: 确认文件在 `local-server` 目录下，文件名完全匹配

## 详细说明

更多详细信息请查看 `setup-certificates.md`

