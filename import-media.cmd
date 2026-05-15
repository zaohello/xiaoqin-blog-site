@echo off
setlocal

set "REPO_DIR=%~dp0"
set /p SOURCE_DIR=要导入的图片文件夹路径：

if "%SOURCE_DIR%"=="" (
  echo 没有输入文件夹路径。
  pause
  exit /b 1
)

set /p TARGET_DIR=博客里的目标文件夹名（可留空）：

pushd "%REPO_DIR%"
if "%TARGET_DIR%"=="" (
  node scripts\import-media.js "%SOURCE_DIR%"
) else (
  node scripts\import-media.js "%SOURCE_DIR%" "%TARGET_DIR%"
)
set "EXIT_CODE=%ERRORLEVEL%"
popd

echo.
pause
exit /b %EXIT_CODE%
