Add-Type -AssemblyName System.Drawing

$baseDir = "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite"
$publicDir = "$baseDir\public"
$backupDir = "$baseDir\scratch\backup"

# Function to pad image to square and resize
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

# Source image: backup/favicon.png (which is the transparent black logo)
$srcLogo = "$backupDir\favicon.png"

# Process all favicons to be square transparent black logos
Process-Image -srcPath $srcLogo -destPath "$publicDir\favicon2.png" -targetWidth 1024 -targetHeight 1024 -makeSquare $true
Process-Image -srcPath $srcLogo -destPath "$publicDir\favicon.png" -targetWidth 512 -targetHeight 512 -makeSquare $true
Process-Image -srcPath $srcLogo -destPath "$publicDir\appIcon.png" -targetWidth 512 -targetHeight 512 -makeSquare $true
Process-Image -srcPath $srcLogo -destPath "$publicDir\favicon.ico" -targetWidth 256 -targetHeight 256 -makeSquare $true

Write-Host "All logo files updated to transparent black square versions successfully!"
