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
        throw "The repo has pending changes. Please resolve them before running this bot.`n$($filtered -join "`n")"
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
    $SourceDir = Normalize-Input (Read-Host "Source folder path")
}

if (-not $TargetFolderName) {
    $TargetFolderName = Normalize-Input (Read-Host "Target folder name in blog")
}

if (-not $SourceDir) {
    throw "Source folder path is required."
}

if (-not $TargetFolderName) {
    throw "Target folder name is required."
}

$branchBefore = (Get-GitOutput branch --show-current | Select-Object -First 1).Trim()

try {
    Write-Step "Check repo status"
    Ensure-CleanWorktree

    if ($branchBefore -ne "main") {
        throw "This bot only runs on the main branch."
    }

    Write-Step "Import media files"
    & node (Join-Path $repoRoot "scripts/import-media.js") $SourceDir $TargetFolderName
    if ($LASTEXITCODE -ne 0) {
        throw "Media import failed."
    }

    $relativeTarget = "public/assets/$TargetFolderName"
    $targetFolderPath = Join-Path $repoRoot $relativeTarget

    $pendingFiles = Get-GitOutput status --short -- $relativeTarget
    if ($pendingFiles.Count -eq 0) {
        Write-Step "Nothing new to sync"
        Write-Host "All files from this folder are already online." -ForegroundColor Green
        exit 0
    }

    Write-Step "Commit to origin/main"
    Invoke-Git add -- $relativeTarget

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    Invoke-Git commit -m "feat: import media $TargetFolderName ($timestamp)"
    $mainCommit = (Get-GitOutput rev-parse --short HEAD | Select-Object -First 1).Trim()
    Invoke-Git push origin main

    Write-Step "Sync to deploy repo"
    Invoke-Git fetch zaohello-origin
    Invoke-Git switch -C deploy-sync zaohello-origin/main
    Invoke-Git cherry-pick $mainCommit
    Invoke-Git push zaohello-origin deploy-sync:main
    Invoke-Git switch main

    Write-Step "Done"
    Write-Host "Media imported and synced successfully." -ForegroundColor Green
    Write-Host "Folder: $targetFolderPath"
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
    Write-Host "Bot failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
