# 下载并设置 mkcert 的简单脚本

Write-Host "=== 下载 mkcert ===" -ForegroundColor Cyan
Write-Host ""

$mkcertUrl = "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-windows-amd64.exe"
$mkcertPath = Join-Path $PSScriptRoot "mkcert.exe"

# 检查是否已存在
if (Test-Path $mkcertPath) {
    Write-Host "✅ mkcert.exe 已存在" -ForegroundColor Green
} else {
    Write-Host "正在下载 mkcert..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $mkcertUrl -OutFile $mkcertPath
        Write-Host "✅ 下载完成" -ForegroundColor Green
    } catch {
        Write-Host "❌ 下载失败: $_" -ForegroundColor Red
        Write-Host "请手动下载: $mkcertUrl" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "安装根证书（需要管理员权限）..." -ForegroundColor Yellow
Write-Host "如果提示权限错误，请以管理员身份运行 PowerShell" -ForegroundColor Yellow
Write-Host ""

try {
    & $mkcertPath -install
    Write-Host "✅ 根证书安装成功" -ForegroundColor Green
} catch {
    Write-Host "⚠️  根证书安装可能失败，请以管理员身份运行" -ForegroundColor Yellow
    Write-Host "   错误: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "生成 localhost 证书..." -ForegroundColor Yellow

try {
    & $mkcertPath localhost
    Write-Host "✅ 证书生成成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "现在可以运行: npm run start:server" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 证书生成失败: $_" -ForegroundColor Red
    exit 1
}

