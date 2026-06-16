Add-Type -AssemblyName System.Drawing

$baseDir = "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite"
$publicDir = "$baseDir\public"
$backupDir = "$baseDir\scratch\backup"

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# 1. Back up original files
$filesToBackup = @("favicon.png", "favicon2.png", "appIcon.png", "favicon.ico")
foreach ($f in $filesToBackup) {
    if (Test-Path "$publicDir\$f") {
        Copy-Item "$publicDir\$f" "$backupDir\$f" -Force
        Write-Host "Backed up $f to scratch/backup/$f"
    }
}

# 2. Function to pad image to square and resize
function Process-Image {
    param(
        [string]$srcPath,
        [string]$destPath,
        [int]$targetWidth,
        [int]$targetHeight,
        [bool]$makeSquare
    )

    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $srcW = $srcImg.Width
    $srcH = $srcImg.Height

    # Determine size of square canvas if making square
    $canvasW = $srcW
    $canvasH = $srcH
    if ($makeSquare) {
        $maxDim = [Math]::Max($srcW, $srcH)
        $canvasW = $maxDim
        $canvasH = $maxDim
    }

    # Create new bitmap with transparent background
    $newBmp = New-Object System.Drawing.Bitmap($canvasW, $canvasH)
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.Clear([System.Drawing.Color]::Transparent)

    # Set high quality drawing settings
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Draw original image centered
    $x = ($canvasW - $srcW) / 2
    $y = ($canvasH - $srcH) / 2
    $g.DrawImage($srcImg, $x, $y, $srcW, $srcH)
    $g.Dispose()
    $srcImg.Dispose()

    # Now, if we need to resize to target dimensions
    if ($targetWidth -gt 0 -and $targetHeight -gt 0) {
        $resizedBmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $gResized = [System.Drawing.Graphics]::FromImage($resizedBmp)
        $gResized.Clear([System.Drawing.Color]::Transparent)
        $gResized.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $gResized.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $gResized.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $gResized.DrawImage($newBmp, 0, 0, $targetWidth, $targetHeight)
        $gResized.Dispose()
        $newBmp.Dispose()
        $finalBmp = $resizedBmp
    } else {
        $finalBmp = $newBmp
    }

    # Save as PNG
    $finalBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $finalBmp.Dispose()
    Write-Host "Created $destPath ($($targetWidth)x$($targetHeight)) from $srcPath"
}

# Process favicon2.png to be a 2048x2048 square
Process-Image -srcPath "$backupDir\favicon2.png" -destPath "$publicDir\favicon2.png" -targetWidth 2048 -targetHeight 2048 -makeSquare $true

# Process favicon.png to be a 512x512 square
Process-Image -srcPath "$backupDir\favicon2.png" -destPath "$publicDir\favicon.png" -targetWidth 512 -targetHeight 512 -makeSquare $true

# Process appIcon.png to be a 512x512 square
Process-Image -srcPath "$backupDir\favicon2.png" -destPath "$publicDir\appIcon.png" -targetWidth 512 -targetHeight 512 -makeSquare $true

# Process favicon.ico as a 256x256 square (since ico format supports PNG, browsers can load it directly)
Process-Image -srcPath "$backupDir\favicon2.png" -destPath "$publicDir\favicon.ico" -targetWidth 256 -targetHeight 256 -makeSquare $true

Write-Host "Favicons successfully updated to 1:1 aspect ratio square!"
