@echo off
setlocal
chcp 65001 >nul
title 博客批量导图机器人

set "SCRIPT=C:\Users\Administrator\Desktop\ai视频\codextest2\blog-fanxiaoqin0852-fuwari\scripts\import-and-sync-media.ps1"

if not exist "%SCRIPT%" (
  echo 找不到机器人脚本：
  echo %SCRIPT%
  echo.
  pause
  exit /b 1
)

if "%~1"=="" (
  powershell -ExecutionPolicy Bypass -File "%SCRIPT%"
) else (
  powershell -ExecutionPolicy Bypass -File "%SCRIPT%" -SourceDir "%~1"
)

echo.
pause
exit /b %ERRORLEVEL%
