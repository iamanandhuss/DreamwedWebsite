$files = @("dist/favicon.png", "dist/favicon2.png", "dist/appIcon.png")
foreach ($f in $files) {
    if (Test-Path $f) {
        $bytes = [System.IO.File]::ReadAllBytes($f)
        if ($bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47) {
            $widthBytes = $bytes[16..19]
            $heightBytes = $bytes[20..23]
            if ([System.BitConverter]::IsLittleEndian) {
                [System.Array]::Reverse($widthBytes)
                [System.Array]::Reverse($heightBytes)
            }
            $width = [System.BitConverter]::ToInt32($widthBytes, 0)
            $height = [System.BitConverter]::ToInt32($heightBytes, 0)
            Write-Host "$f is PNG: $width x $height"
        } else {
            Write-Host "$f is not PNG or signature mismatch"
        }
    } else {
        Write-Host "$f does not exist"
    }
}
