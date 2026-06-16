Add-Type -AssemblyName System.Drawing

function Analyze-File ($path) {
    Write-Host "Analyzing: $path"
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap($img)
    $img.Dispose()

    $opaquePixels = 0
    $transparentPixels = 0
    $colors = @{}

    for ($x = 0; $x -lt $bmp.Width; $x += [Math]::Max(1, [Math]::Floor($bmp.Width / 20))) {
        for ($y = 0; $y -lt $bmp.Height; $y += [Math]::Max(1, [Math]::Floor($bmp.Height / 20))) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -gt 10) {
                $opaquePixels++
                $hex = "{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
                $colors[$hex] = ($colors[$hex] + 1)
            } else {
                $transparentPixels++
            }
        }
    }
    $bmp.Dispose()

    Write-Host "Opaque (visible) pixels: $opaquePixels"
    Write-Host "Transparent pixels: $transparentPixels"
    Write-Host "Unique colors sampled: $($colors.Keys.Count)"
    Write-Host "Sampled color distribution:"
    foreach ($k in ($colors.Keys | Sort-Object { $colors[$_] } -Descending | Select-Object -First 10)) {
        Write-Host "  $k : $($colors[$k])"
    }
    Write-Host "----------------------------------"
}

Analyze-File "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite\public\favicon.png"
Analyze-File "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite\public\appIcon.png"
Analyze-File "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite\public\favicon2.png"
Analyze-File "C:\Users\HP\.gemini\antigravity\scratch\DreamwedWebsite\public\favicon.ico"
