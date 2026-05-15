param(
    [string]$SourceDir,
    [string]$TargetFolderName
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$ignoredStatusLines = @(
    "?? dev-fuwari-4323.log"
)

function Write-Step([string]$message) {
    Write-Host ""
    Write-Host "== $message ==" -ForegroundColor Cyan
}

function Invoke-Git {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    & git -C $repoRoot @Args
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git -C `"$repoRoot`" $($Args -join ' ')"
    }
}

function Get-GitOutput {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    $output = & git -C $repoRoot @Args
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git -C `"$repoRoot`" $($Args -join ' ')"
    }
    return @($output)
}

function Ensure-CleanWorktree {
    $statusLines = Get-GitOutput status --short
    $filtered = $statusLines | Where-Object { $_ -and ($_ -notin $ignoredStatusLines) }
    if ($filtered.Count -gt 0) {
        throw "仓库里还有未处理改动。请先找我处理后再运行这个机器人。`n$($filtered -join "`n")"
    }
}

function Normalize-Input([string]$value) {
    if (-not $value) {
        return ""
    }

    return $value.Trim().Trim('"')
}

$SourceDir = Normalize-Input $SourceDir
$TargetFolderName = Normalize-Input $TargetFolderName

if (-not $SourceDir) {
    $SourceDir = Normalize-Input (Read-Host "把图片文件夹路径粘贴到这里")
}

if (-not $TargetFolderName) {
    $TargetFolderName = Normalize-Input (Read-Host "博客里的目标文件夹名（可留空）")
}

$branchBefore = (Get-GitOutput branch --show-current | Select-Object -First 1).Trim()

try {
    Write-Step "检查仓库状态"
    Ensure-CleanWorktree

    if ($branchBefore -ne "main") {
        throw "当前分支不是 main，机器人为了安全只在 main 上运行。"
    }

    Write-Step "导入图片"
    $importArgs = @("scripts/import-media.js", $SourceDir)
    if ($TargetFolderName) {
        $importArgs += $TargetFolderName
    }

    & node (Join-Path $repoRoot $importArgs[0]) @($importArgs[1..($importArgs.Length - 1)])
    if ($LASTEXITCODE -ne 0) {
        throw "导图失败。"
    }

    $effectiveFolder = $TargetFolderName
    if (-not $effectiveFolder) {
        $effectiveFolder = Split-Path -Leaf $SourceDir
    }

    $targetFolderPath = Join-Path $repoRoot ("public/assets/" + $effectiveFolder)
    $relativeTarget = "public/assets/$effectiveFolder"

    $pendingFiles = Get-GitOutput status --short -- $relativeTarget
    if ($pendingFiles.Count -eq 0) {
        Write-Step "没有新图片要同步"
        Write-Host "这批图片已经在线上了，不需要重复提交。" -ForegroundColor Green
        exit 0
    }

    Write-Step "提交到主仓库"
    Invoke-Git add -- $relativeTarget

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    Invoke-Git commit -m "feat: import media $effectiveFolder ($timestamp)"
    $mainCommit = (Get-GitOutput rev-parse --short HEAD | Select-Object -First 1).Trim()
    Invoke-Git push origin main

    Write-Step "同步到发布仓库"
    Invoke-Git fetch zaohello-origin
    Invoke-Git switch -C deploy-sync zaohello-origin/main
    Invoke-Git cherry-pick $mainCommit
    Invoke-Git push zaohello-origin deploy-sync:main
    Invoke-Git switch main

    Write-Step "完成"
    Write-Host "图片已经导入并同步线上。" -ForegroundColor Green
    Write-Host "目录：$targetFolderPath"
}
catch {
    try {
        $currentBranch = (Get-GitOutput branch --show-current | Select-Object -First 1).Trim()
        if ($currentBranch -ne "main") {
            Invoke-Git switch main
        }
    }
    catch {
    }

    Write-Host ""
    Write-Host "机器人执行失败：" -ForegroundColor Red -NoNewline
    Write-Host " $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
