<#
    Crops and compresses source photos into every image slot the site expects.

    Why this exists: source photos arrive at arbitrary sizes and are usually far
    too heavy. Each slot has a fixed aspect ratio and a weight budget (see the
    asset manifest in kunafah-guy-build-spec.md). This script crops to the right
    shape and then steps JPEG quality down until the file fits its budget.

    Usage
      # Re-create every slot from the photos currently mapped at the bottom
      .\scripts\process-photos.ps1

      # Drop a new photo into one slot, centre-cropped to that slot's aspect
      .\scripts\process-photos.ps1 -Source 'C:\path\shawarma.jpg' -Slot 'menu-shawarma'

    Sizing rule worth keeping: do NOT upscale a small source to the slot's ideal
    pixel size and then crush quality to fit the budget. Fine food texture
    (kataifi strands especially) is JPEG-hostile, and the result looks worse than
    a smaller, higher-quality image. Stay near the source resolution instead.
#>

param(
    [string]$Source,
    [string]$Slot
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$imgDir = Join-Path $root 'public\images'

# name -> output pixels + weight budget. Aspect is implied by width/height.
$Slots = @{
    'hero-kunafa-pull'    = @{ W = 900;  H = 1200; KB = 245 }  # 3:4, full-bleed hero
    'menu-kunafa-classic' = @{ W = 1050; H = 525;  KB = 120 }  # 2:1, featured menu card
    'menu-burger-smash'   = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'menu-burger-double'  = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'menu-shawarma'       = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'process-shred'       = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-sear'        = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-pull'        = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-drench'      = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
}

function Save-Jpeg($bmp, $path, $q) {
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$q)
    $bmp.Save($path, $enc, $ep)
}

# Largest rectangle of the given aspect that fits the source, centred.
function Get-CenterCrop($srcW, $srcH, $targetW, $targetH) {
    $targetAspect = $targetW / $targetH
    if (($srcW / $srcH) -gt $targetAspect) {
        $h = $srcH; $w = [int]($srcH * $targetAspect)
    }
    else {
        $w = $srcW; $h = [int]($srcW / $targetAspect)
    }
    return @{ X = [int](($srcW - $w) / 2); Y = [int](($srcH - $h) / 2); W = $w; H = $h }
}

<#  Crop $sx,$sy,$sw,$sh out of $srcPath, scale into the slot, shrink quality
    until it fits budget. Pass -1 for $sx to centre-crop automatically. #>
function Write-Slot($slotName, $srcPath, $sx = -1, $sy = 0, $sw = 0, $sh = 0) {
    if (-not $Slots.ContainsKey($slotName)) { throw "Unknown slot '$slotName'. Known: $($Slots.Keys -join ', ')" }
    if (-not (Test-Path $srcPath)) { throw "Source photo not found: $srcPath" }

    $spec = $Slots[$slotName]
    $dstPath = Join-Path $imgDir "$slotName.jpg"
    $src = [System.Drawing.Image]::FromFile($srcPath)

    if ($sx -lt 0) {
        $c = Get-CenterCrop $src.Width $src.Height $spec.W $spec.H
        $sx = $c.X; $sy = $c.Y; $sw = $c.W; $sh = $c.H
    }

    $dst = New-Object System.Drawing.Bitmap($spec.W, $spec.H)
    $g = [System.Drawing.Graphics]::FromImage($dst)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.SmoothingMode = 'HighQuality'
    $g.CompositingQuality = 'HighQuality'
    $g.DrawImage($src,
        (New-Object System.Drawing.Rectangle(0, 0, $spec.W, $spec.H)),
        (New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose(); $src.Dispose()

    $q = 86
    do {
        Save-Jpeg $dst $dstPath $q
        $kb = [math]::Round((Get-Item $dstPath).Length / 1KB)
        $q -= 6
    } while ($kb -gt $spec.KB -and $q -ge 40)

    $dst.Dispose()
    "{0,-24} {1,4}x{2,-4} q{3,-3} {4,4} KB" -f $slotName, $spec.W, $spec.H, ($q + 6), $kb
}

# ---------------------------------------------------------------------------
if ($Source -and $Slot) {
    Write-Slot $Slot $Source          # centre-crop a new photo into one slot
    return
}
if ($Source -xor $Slot) { throw 'Pass -Source and -Slot together, or neither.' }

# ---------------------------------------------------------------------------
# Current mapping. Both photos were supplied by the owner in July 2026.
# Replace these paths as real photography arrives, then re-run.
$KUNAFA = 'C:\Users\shous\Downloads\kunafa.jpeg'        # 736 x 1103
$BURGER = 'C:\Users\shous\Downloads\double smash.jpeg'  # 236 x 314 (thumbnail - soft when enlarged)

if (-not (Test-Path $KUNAFA)) { Write-Warning "Source photo missing: $KUNAFA"; return }

# Hand-picked crop rects against the 736x1103 kunafa photo. The four process
# crops deliberately target different textures so the steps look distinct.
Write-Slot 'hero-kunafa-pull'    $KUNAFA   0   40 736 981
Write-Slot 'menu-kunafa-classic' $KUNAFA   0  401 736 368
Write-Slot 'process-shred'       $KUNAFA  40  700 300 300   # loose strands at the tray edge
Write-Slot 'process-sear'        $KUNAFA  60  290 300 300   # toasted golden crust
Write-Slot 'process-pull'        $KUNAFA 170  590 300 300   # cut wedge, interior showing
Write-Slot 'process-drench'      $KUNAFA 230  360 300 300   # pistachio blanket

if (Test-Path $BURGER) {
    Write-Slot 'menu-burger-double' $BURGER  0  67 236 177
    Write-Slot 'menu-burger-smash'  $BURGER 12  80 212 159
}
