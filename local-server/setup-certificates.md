# Windows 上安装 mkcert 和生成证书

## 方法 1: 使用 Chocolatey（推荐）

### 步骤 1: 安装 Chocolatey（如果还没有）

以管理员身份打开 PowerShell，运行：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 步骤 2: 安装 mkcert

```powershell
choco install mkcert
```

### 步骤 3: 安装本地 CA 根证书

```powershell
mkcert -install
```

### 步骤 4: 生成 localhost 证书

在 `local-server` 目录下运行：

```powershell
cd C:\Users\29182\Desktop\demo1\local-server
mkcert localhost
```

这会生成两个文件：
- `localhost.pem`
- `localhost-key.pem`

## 方法 2: 使用 Scoop

### 步骤 1: 安装 Scoop（如果还没有）

在 PowerShell 中运行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### 步骤 2: 安装 mkcert

```powershell
scoop bucket add extras
scoop install mkcert
```

### 步骤 3: 安装本地 CA 根证书

```powershell
mkcert -install
```

### 步骤 4: 生成 localhost 证书

```powershell
cd C:\Users\29182\Desktop\demo1\local-server
mkcert localhost
```

## 方法 3: 手动下载（如果上述方法都不行）

### 步骤 1: 下载 mkcert

1. 访问: https://github.com/FiloSottile/mkcert/releases
2. 下载 `mkcert-v1.4.4-windows-amd64.exe`（或最新版本）
3. 重命名为 `mkcert.exe`
4. 将 `mkcert.exe` 放到一个在 PATH 中的目录（如 `C:\Windows\System32`），或者放到项目目录

### 步骤 2: 安装本地 CA 根证书

在 PowerShell 中运行（以管理员身份）：

```powershell
.\mkcert.exe -install
```

或者如果 mkcert 在 PATH 中：

```powershell
mkcert -install
```

### 步骤 3: 生成 localhost 证书

```powershell
cd C:\Users\29182\Desktop\demo1\local-server
.\mkcert.exe localhost
```

或者：

```powershell
mkcert localhost
```

## 验证证书生成

运行完 `mkcert localhost` 后，你应该在 `local-server` 目录下看到：

- ✅ `localhost.pem`
- ✅ `localhost-key.pem`

然后就可以运行 `npm run start:server` 了！

## 常见问题

**Q: 提示 "mkcert: command not found"**
A: mkcert 没有安装或不在 PATH 中。使用完整路径运行，或确保已正确安装。

**Q: 提示权限错误**
A: 运行 `mkcert -install` 需要管理员权限。右键 PowerShell 选择"以管理员身份运行"。

**Q: 证书生成成功但服务器仍报错**
A: 确认证书文件在 `local-server` 目录下，文件名必须是 `localhost.pem` 和 `localhost-key.pem`。

