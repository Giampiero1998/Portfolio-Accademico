# create-zip.ps1
$ErrorActionPreference = "Stop"

# Nome del file di output
$zipName = "scripta-manent.zip"
$sourcePath = Get-Location
$tempFolder = Join-Path ([System.IO.Path]::GetTempPath()) "temp_zip_$(New-Guid)"

Write-Host "🗜️  Preparazione ambiente..." -ForegroundColor Cyan

# Cartelle da escludere (nomi esatti delle cartelle)
$excludeDirs = @(
    "node_modules",
    "dist",
    "build",
    ".git",
    "coverage",
    ".next",
    "out",
    ".vs",
    ".idea"
)

# Pattern di file da escludere
$excludePatterns = @(
    "*.log",
    ".env",
    ".env.local",
    "*.zip",
    "*.tmp"
)

# Crea cartella temporanea
New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null

Write-Host "📁 Analisi e copia file..." -ForegroundColor Yellow

# Ottieni tutti i file
$files = Get-ChildItem -Path $sourcePath -Recurse -File

$count = 0

foreach ($file in $files) {
    # Calcola il percorso relativo rispetto alla radice del progetto
    $relativePath = $file.FullName.Substring($sourcePath.Path.Length + 1)
    
    # Dividi il percorso in segmenti per controllare le cartelle
    $pathParts = $relativePath -split "[\\/]"
    
    # CHECK 1: Controlla se una delle cartelle genitore è nella lista di esclusione
    $isExcludedDir = $false
    foreach ($part in $pathParts) {
        if ($excludeDirs -contains $part) {
            $isExcludedDir = $true
            break
        }
    }
    if ($isExcludedDir) { continue }

    # CHECK 2: Controlla se il nome del file corrisponde ai pattern esclusi
    $isExcludedFile = $false
    foreach ($pattern in $excludePatterns) {
        if ($file.Name -like $pattern) {
            $isExcludedFile = $true
            break
        }
    }
    if ($isExcludedFile) { continue }

    # Se passa i controlli, ricrea la struttura nella cartella temporanea
    $destFile = Join-Path $tempFolder $relativePath
    $destDir = Split-Path $destFile -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    Copy-Item -Path $file.FullName -Destination $destFile
    $count++
}

Write-Host "📦 Compressione di $count file in corso..." -ForegroundColor Yellow

# Rimuove lo zip vecchio se esiste
if (Test-Path $zipName) { Remove-Item $zipName -Force }

# Comprime il contenuto della cartella temporanea
# Usiamo Get-ChildItem sul temp folder per evitare di includere la cartella temp stessa nello zip
Get-ChildItem -Path $tempFolder | Compress-Archive -DestinationPath $zipName -Force

# Pulizia
Remove-Item -Path $tempFolder -Recurse -Force

# Verifica finale
if (Test-Path $zipName) {
    $size = (Get-Item $zipName).Length / 1MB
    Write-Host "✅ ZIP creato con successo!" -ForegroundColor Green
    Write-Host "📊 Dimensione: $([math]::Round($size, 2)) MB" -ForegroundColor Green
    Write-Host "📍 Percorso: $(Join-Path $sourcePath $zipName)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Errore nella creazione dello zip." -ForegroundColor Red
}