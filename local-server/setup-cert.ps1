# mkcert 安装和证书生成脚本
# 需要以管理员身份运行

Write-Host "=== mkcert SSL 证书设置脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否以管理员身份运行
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  警告: 建议以管理员身份运行此脚本" -ForegroundColor Yellow
    Write-Host "   右键点击 PowerShell，选择'以管理员身份运行'" -ForegroundColor Yellow
    Write-Host ""
}

# 检查 mkcert 是否已安装
Write-Host "检查 mkcert 是否已安装..." -ForegroundColor Yellow
$mkcertInstalled = $false
$mkcertPath = $null

# 检查 PATH 中是否有 mkcert
if (Get-Command mkcert -ErrorAction SilentlyContinue) {
    $mkcertInstalled = $true
    $mkcertPath = "mkcert"
    Write-Host "✅ mkcert 已在 PATH 中找到" -ForegroundColor Green
} else {
    # 检查 Chocolatey
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Host "检测到 Chocolatey，尝试安装 mkcert..." -ForegroundColor Yellow
        try {
            choco install mkcert -y
            if (Get-Command mkcert -ErrorAction SilentlyContinue) {
                $mkcertInstalled = $true
                $mkcertPath = "mkcert"
                Write-Host "✅ mkcert 安装成功" -ForegroundColor Green
            }
        } catch {
            Write-Host "❌ Chocolatey 安装失败: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ mkcert 未安装，且未检测到 Chocolatey" -ForegroundColor Red
        Write-Host ""
        Write-Host "请选择以下方式之一安装 mkcert:" -ForegroundColor Yellow
        Write-Host "1. 安装 Chocolatey 后运行: choco install mkcert" -ForegroundColor Cyan
        Write-Host "2. 安装 Scoop 后运行: scoop install mkcert" -ForegroundColor Cyan
        Write-Host "3. 手动下载: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "详细说明请查看: setup-certificates.md" -ForegroundColor Yellow
        exit 1
    }
}

if (-not $mkcertInstalled) {
    Write-Host "❌ 无法安装 mkcert，请手动安装" -ForegroundColor Red
    exit 1
}

# 安装根证书
Write-Host ""
Write-Host "安装 mkcert 根证书到系统信任存储..." -ForegroundColor Yellow
try {
    & $mkcertPath -install
    Write-Host "✅ 根证书安装成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 根证书安装失败: $_" -ForegroundColor Red
    Write-Host "   请确保以管理员身份运行此脚本" -ForegroundColor Yellow
    exit 1
}

# 生成 localhost 证书
Write-Host ""
Write-Host "生成 localhost 证书..." -ForegroundColor Yellow
$currentDir = Get-Location
try {
    & $mkcertPath localhost
    Write-Host "✅ 证书生成成功" -ForegroundColor Green
    Write-Host ""
    Write-Host "证书文件位置:" -ForegroundColor Cyan
    Write-Host "  - $currentDir\localhost.pem" -ForegroundColor White
    Write-Host "  - $currentDir\localhost-key.pem" -ForegroundColor White
} catch {
    Write-Host "❌ 证书生成失败: $_" -ForegroundColor Red
    exit 1
}

# 验证文件是否存在
Write-Host ""
if (Test-Path "localhost.pem" -PathType Leaf) {
    if (Test-Path "localhost-key.pem" -PathType Leaf) {
        Write-Host "✅ 所有证书文件已就绪！" -ForegroundColor Green
        Write-Host ""
        Write-Host "现在可以运行: npm run start:server" -ForegroundColor Cyan
    } else {
        Write-Host "❌ localhost-key.pem 文件未找到" -ForegroundColor Red
    }
} else {
    Write-Host "❌ localhost.pem 文件未找到" -ForegroundColor Red
}

